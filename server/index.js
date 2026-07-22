// Backend server for Shopify MCP integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Suppress Express stack fingerprint
app.disable('x-powered-by');

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CSP Report-Only for Shopify, Meta Pixel, Bootstrap, and unpkg
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "img-src 'self' data: https://www.facebook.com https://cdn.shopify.com",
    "font-src 'self' data: https://cdn.jsdelivr.net",
    "connect-src 'self' https://*.myshopify.com https://www.facebook.com",
    "frame-src 'self' https://www.facebook.com",
    "frame-ancestors 'self'"
  ].join('; ');

  res.setHeader('Content-Security-Policy-Report-Only', csp);
  next();
});

// Enable Gzip compression (and brotli depending on Node version)
app.use(compression());

//app.use(cors());
// Restrict CORS to your frontend domains
const allowedOrigins = ['http://localhost:5173', 'https://narawear.com', 'https://www.narawear.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlobServiceClient } from '@azure/storage-blob';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';
const { Pool } = pg;
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy required for Azure App Service load balancers to correctly identify client IPs for Rate Limiting
app.set('trust proxy', 1);

// Azure App Service appends ports to IPv4 addresses in X-Forwarded-For, which breaks req.ip and express-rate-limit.
// This middleware sanitizes the header before Express touches it, ensuring req.ip is globally clean and free of ports.
app.use((req, res, next) => {
  if (req.headers['x-forwarded-for']) {
    req.headers['x-forwarded-for'] = req.headers['x-forwarded-for']
      .split(',')
      .map(ip => {
        ip = ip.trim();
        // If it's IPv4 with a port, strip the port. (IPv6 has colons but no dots).
        if (ip.includes('.') && ip.includes(':')) {
          return ip.split(':')[0];
        }
        return ip;
      })
      .join(', ');
  }
  next();
});

// Rate Limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Safe concurrent file writer queue
const writeQueue = {};
const safeWriteFile = (filePath, content) => {
  if (!writeQueue[filePath]) writeQueue[filePath] = Promise.resolve();
  writeQueue[filePath] = writeQueue[filePath]
    .then(() => fsPromises.writeFile(filePath, content, 'utf8'))
    .catch(e => console.error(`Write error on ${filePath}:`, e));
  return writeQueue[filePath];
};

import prerender from 'prerender-node';

// Prerender.io middleware for AI Bots (Claude, ChatGPT, Google)
if (process.env.PRERENDER_TOKEN) {
  prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
  // Optional: add extra bot user agents if needed
  // prerender.crawlerUserAgents.push('ClaudeBot'); 
  app.use(prerender);
  console.log('Prerender.io middleware enabled for AI SEO.');
} else {
  console.warn('PRERENDER_TOKEN not found. AI SEO Dynamic Rendering disabled.');
}

// Serve static files from the React app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, {
  setHeaders: (res, path, stat) => {
    // Aggressive caching for hashed assets, images, fonts
    if (path.match(/\.(js|css|woff2?|ttf|png|jpe?g|gif|svg|webp|avif|ico)$/i)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.endsWith('.html')) {
      // Allow CDN caching for index.html with stale-while-revalidate
      res.set('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600');
    }
  }
}));

// Azure Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'nara-web-data';

let blobServiceClient;
let containerClient;

// DigitalOcean Spaces Configuration
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1", // DO Spaces uses "us-east-1" as a dummy region
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET
  }
});
const DO_SPACES_BUCKET = process.env.DO_SPACES_BUCKET;

// Multer Configuration for File Uploads
const upload = multer({ storage: multer.memoryStorage() });

// In-Memory Data Stores
let newsletterData = [];

let reviewsData = [];
let ugcVotesData = {}; // Format: { "videoFilename": { count: number, voters: [userIds] } }
let ugcCollaborationData = [];

// Initialize Azure
if (AZURE_STORAGE_CONNECTION_STRING) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    console.log(`Azure Blob Storage initialized. Container: ${AZURE_CONTAINER_NAME}`);

    // Create container if it doesn't exist
    containerClient.createIfNotExists().catch(err => console.error("Error creating container:", err.message));
  } catch (error) {
    console.error('Error initializing Azure Blob Storage:', error.message);
  }
} else {
  console.warn('AZURE_STORAGE_CONNECTION_STRING not found. Azure sync disabled.');
}

// Helper: Stream to Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

// Helper: Download from Azure
async function downloadFromAzure(blobName) {
  if (!containerClient) return null;
  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    if (await blobClient.exists()) {
      const downloadBlockBlobResponse = await blobClient.download(0);
      const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
      return JSON.parse(downloaded.toString());
    }
  } catch (error) {
    console.error(`Error downloading ${blobName} from Azure:`, error.message);
  }
  return null;
}

// Helper: Upload to Azure
async function uploadToAzure(blobName, data) {
  if (!containerClient) return;
  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const content = JSON.stringify(data, null, 2);
    await blobClient.upload(content, content.length);
    console.log(`Synced ${blobName} to Azure.`);
  } catch (error) {
    console.error(`Error uploading ${blobName} to Azure:`, error.message);
  }
}

// Initialize Data on Start
async function initializeData() {
  // Load Newsletter
  const azureNewsletter = await downloadFromAzure('newsletter_data.json');
  if (azureNewsletter) {
    newsletterData = azureNewsletter;
    console.log(`Loaded ${newsletterData.length} newsletter entries from Azure.`);
  } else {
    // Fallback to local file if exists (migration/dev)
    const localFile = path.join(__dirname, 'newsletter_data.json');
    if (fs.existsSync(localFile)) {
      try {
        newsletterData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded ${newsletterData.length} newsletter entries from local file.`);
      } catch (e) { console.error("Error reading local newsletter file", e); }
    }
  }

  // Load Reviews
  const azureReviews = await downloadFromAzure('reviews_data.json');
  if (azureReviews) {
    reviewsData = azureReviews;
    console.log(`Loaded ${reviewsData.length} reviews from Azure.`);
  } else {
    // Fallback to local file
    const localFile = path.join(__dirname, 'reviews_data.json');
    if (fs.existsSync(localFile)) {
      try {
        reviewsData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded ${reviewsData.length} reviews from local file.`);
      } catch (e) { console.error("Error reading local reviews file", e); }
    }
  }

  // Load UGC Votes
  const azureVotes = await downloadFromAzure('ugc_votes_data.json');
  if (azureVotes) {
    ugcVotesData = azureVotes;
    console.log(`Loaded UGC votes from Azure.`);
  } else {
    // Fallback to local file
    const localFile = path.join(__dirname, 'ugc_votes_data.json');
    if (fs.existsSync(localFile)) {
      try {
        ugcVotesData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded UGC votes from local file.`);
      } catch (e) { console.error("Error reading local votes file", e); }
    }
  }

  // Load UGC Collaboration Data
  const azureCollaboration = await downloadFromAzure('ugc_collaboration_data.json');
  if (azureCollaboration) {
    ugcCollaborationData = azureCollaboration;
    console.log(`Loaded ${ugcCollaborationData.length} collaboration entries from Azure.`);
  } else {
    // Fallback to local file
    const localFile = path.join(__dirname, 'ugc_collaboration_data.json');
    if (fs.existsSync(localFile)) {
      try {
        ugcCollaborationData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded ${ugcCollaborationData.length} collaboration entries from local file.`);
      } catch (e) { console.error("Error reading local collaboration file", e); }
    }
  }
}

initializeData();

// Initialize PostgreSQL connection
const dbOptions = {
  connectionString: process.env.DATABASE_URL,
};

// Add ssl option if not localhost
if (dbOptions.connectionString && !dbOptions.connectionString.includes('localhost')) {
  dbOptions.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(dbOptions);

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS spinning_wheel_data (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(50) NOT NULL,
        name VARCHAR(255),
        customer_id VARCHAR(255),
        anonymous_id VARCHAR(255),
        result VARCHAR(100) NOT NULL,
        spun_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("PostgreSQL: spinning_wheel_data table is ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_removals (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        product_name VARCHAR(255),
        variant_size VARCHAR(100),
        reason VARCHAR(255) NOT NULL,
        removed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add columns if they don't exist
    await pool.query(`
      ALTER TABLE cart_removals
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS anonymous_id VARCHAR(255);
    `);
    console.log("PostgreSQL: cart_removals table is ready.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS emailed_carts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        cart_data JSONB NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255),
        anonymous_id VARCHAR(255)
      );
    `);
    
    // Fallback alter just in case table already exists
    await pool.query(`
      ALTER TABLE emailed_carts
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS anonymous_id VARCHAR(255);
    `);
    console.log("PostgreSQL: emailed_carts table is ready.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}
initDB();

// Cart Removals Endpoint
app.post('/api/removals', async (req, res) => {
  console.log('--- Received POST request at /api/removals ---');
  try {
    const { productId, productName, variantSize, reason, userId, anonymousId } = req.body;
    console.log('Payload received:', { productId, productName, variantSize, reason, userId, anonymousId });

    if (!productId || !reason) {
      console.log('Validation failed: Missing productId or reason');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO cart_removals (product_id, product_name, variant_size, reason, user_id, anonymous_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [productId, productName, variantSize, reason, userId, anonymousId];
    console.log('Executing DB query with values:', values);

    const result = await pool.query(query, values);
    console.log('Successfully inserted into cart_removals DB:', result.rows[0]);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error logging removal reason to DB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  console.log('--- Finished processing /api/removals ---');
});

// Email Cart Endpoint
app.post('/api/cart/email-cart', async (req, res) => {
  try {
    const { email, products, subtotal, userId, anonymousId, savings, deliveryFee } = req.body;
    if (!email || !products) {
      return res.status(400).json({ error: 'Missing email or products' });
    }

    // Insert into DB
    const query = `
      INSERT INTO emailed_carts (email, cart_data, subtotal, user_id, anonymous_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [email, JSON.stringify(products), subtotal, userId || null, anonymousId || null];
    await pool.query(query, values);

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_SERVER || 'smtpout.secureserver.net',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'info@narawear.com',
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
      }
    });

    const productsHtml = products.map(p => {
      // Check if item has pricing info
      const pricing = p.pricing;
      let priceDisplay = '';
      if (pricing) {
          if (pricing.totalEffectivePrice === 0) {
              let secondStrikethrough = '';
              if (pricing.totalStrikeoutPrice !== pricing.originalPrice * p.quantity) {
                  secondStrikethrough = `<span style="text-decoration: line-through; color: #9ca3af; font-size: 12px; margin-right: 4px;">₹${(pricing.originalPrice * p.quantity).toFixed(2)}</span>`;
              }
              priceDisplay = `<span style="text-decoration: line-through; color: #9ca3af; font-size: 12px; margin-right: 4px;">₹${pricing.totalStrikeoutPrice.toFixed(2)}</span>${secondStrikethrough}<br/><strong style="color: #111827;">FREE</strong>`;
          } else {
              if (pricing.totalStrikeoutPrice !== pricing.totalEffectivePrice) {
                  priceDisplay = `<span style="text-decoration: line-through; color: #9ca3af; font-size: 12px; margin-right: 4px;">₹${pricing.totalStrikeoutPrice.toFixed(2)}</span><br/><strong style="color: #111827;">₹${pricing.totalEffectivePrice.toFixed(2)}</strong>`;
              } else {
                  priceDisplay = `<strong style="color: #111827;">₹${pricing.totalEffectivePrice.toFixed(2)}</strong>`;
              }
          }
      } else {
          priceDisplay = `<strong style="color: #111827;">₹${(p.price * p.quantity).toFixed(2)}</strong>`;
      }
      
      let bogoBadge = '';
      if (pricing?.isBogo) {
          bogoBadge = `<div style="font-size: 11px; color: #6b7280; margin-top: 6px; display: flex; align-items: center; gap: 4px;">
              <span>🏷️</span> BUY 1 GET 1 ${pricing.freeCount > 0 ? `(-₹${(pricing.originalPrice * pricing.freeCount).toFixed(2)})` : ''}
          </div>`;
      }

      return `
        <tr>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; width: 90px; vertical-align: top;">
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-color: #fff; width: 70px; height: 70px;">
              <img src="${p.image}" alt="${p.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </div>
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
            <div style="font-weight: 600; font-size: 15px; color: #111827; margin-bottom: 4px;">${p.title}</div>
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 2px;">Size: ${p.size || 'N/A'}</div>
            <div style="color: #6b7280; font-size: 13px;">Qty: ${p.quantity}</div>
            ${bogoBadge}
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; vertical-align: top; white-space: nowrap;">
            ${priceDisplay}
          </td>
        </tr>
      `;
    }).join('');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; color: #374151;">
          <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px;">YOUR CART</h2>
          <p style="color: #4b5563; font-size: 14px; margin-bottom: 24px;">Here is the breakdown of the items you saved:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            ${productsHtml}
          </table>
          
          <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #f3f4f6;">
              <table style="width: 100%; border-collapse: collapse;">
                  ${deliveryFee !== undefined ? `
                  <tr>
                      <td style="padding: 6px 0; color: #16a34a; font-weight: 600; font-size: 15px;">Delivery</td>
                      <td style="padding: 6px 0; text-align: right;">
                          <span style="text-decoration: line-through; color: #ef4444; margin-right: 8px; font-size: 14px;">₹${deliveryFee}</span>
                          <span style="color: #16a34a; font-weight: 600; font-size: 15px;">FREE</span>
                      </td>
                  </tr>` : ''}
                  ${savings ? `
                  <tr>
                      <td style="padding: 6px 0; color: #16a34a; font-weight: 600; font-size: 15px;">You Saved:</td>
                      <td style="padding: 6px 0; text-align: right; color: #16a34a; font-weight: 700; font-size: 16px;">₹${Number(savings).toFixed(2)}</td>
                  </tr>
                  <tr>
                      <td colspan="2" style="padding: 0; text-align: right; color: #16a34a; font-size: 11px;">(Total savings on this order!)</td>
                  </tr>` : ''}
                  <tr>
                      <td colspan="2"><hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" /></td>
                  </tr>
                  <tr>
                      <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #111827;">Subtotal:</td>
                      <td style="padding: 8px 0; font-size: 22px; font-weight: 900; text-align: right; color: #1F4A40;">₹${Number(subtotal).toFixed(2)}</td>
                  </tr>
                  <tr>
                      <td colspan="2" style="padding-top: 4px; text-align: right; color: #6b7280; font-size: 11px;">Taxes and shipping calculated at checkout</td>
                  </tr>
              </table>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
              <a href="https://narawear.com/cart" style="background-color: #1F4A40; color: #ffffff; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 15px;">Resume Shopping</a>
          </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Nara" <${process.env.EMAIL_USER || 'info@narawear.com'}>`,
      to: email,
      subject: "Your NARA Cart",
      html: html
    });

    res.status(200).json({ success: true, message: 'Cart emailed successfully' });
  } catch (error) {
    console.error('Error emailing cart:', error);
    res.status(500).json({ error: 'Failed to email cart' });
  }
});

// Spinning Wheel Endpoints
app.get('/api/spinning-wheel/check', async (req, res) => {
  try {
    const { customerId, anonymousId } = req.query;
    if (!customerId && !anonymousId) {
      return res.status(400).json({ error: 'Missing customerId or anonymousId' });
    }

    let query = 'SELECT 1 FROM spinning_wheel_data WHERE ';
    let values = [];
    if (customerId) {
      query += 'customer_id = $1';
      values = [customerId];
    } else {
      query += 'anonymous_id = $1';
      values = [anonymousId];
    }
    query += ' LIMIT 1';

    const result = await pool.query(query, values);
    res.json({ hasSpun: result.rowCount > 0 });
  } catch (error) {
    console.error('Error checking spinning wheel status:', error);
    res.status(500).json({ error: 'Database check failed' });
  }
});

app.post('/api/spinning-wheel/spin', async (req, res) => {
  try {
    const { phoneNumber, name, customerId, anonymousId } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Missing phone number' });
    }

    const segments = [
      { text: '10% OFF', color: '#1F4A40', value: 'win_10' },
      { text: '₹300 OFF', color: '#2a6357', value: 'win_300' },
      { text: 'So Close', color: '#4a7c6f', value: 'lose' },
      { text: '₹200 OFF', color: '#1F4A40', value: 'win_200' },
      { text: '15% OFF', color: '#2a6357', value: 'win_15' },
      { text: 'Not Your\\nDay', color: '#4a7c6f', value: 'lose' },
      { text: '20% OFF', color: '#1F4A40', value: 'win_20' },
      { text: '₹100 OFF', color: '#2a6357', value: 'win_100' },
    ];

    const codeMap = {
      '10% OFF': 'LUCKY10',
      '₹300 OFF': 'LUCKY300',
      '₹200 OFF': 'LUCKY200',
      '15% OFF': 'LUCKY15',
      '20% OFF': 'LUCKY20',
      '₹100 OFF': 'LUCKY100',
      'So Close': 'LUCKY10',
      'Not Your\\nDay': 'LUCKY10',
    };

    let randomIndex = Math.floor(Math.random() * segments.length);

    // Rig the wheel: Never land on '₹300 OFF'
    while (segments[randomIndex].text === '₹300 OFF') {
      randomIndex = Math.floor(Math.random() * segments.length);
    }

    const selectedSegment = segments[randomIndex];
    const couponCode = codeMap[selectedSegment.text];

    await pool.query(`
      INSERT INTO spinning_wheel_data (phone_number, name, customer_id, anonymous_id, result)
      VALUES ($1, $2, $3, $4, $5)
    `, [phoneNumber, name || null, customerId || null, anonymousId || null, selectedSegment.text.replace('\\n', ' ')]);

    res.json({ success: true, segment: selectedSegment, segmentIndex: randomIndex, couponCode });
  } catch (error) {
    console.error('Error saving spinning wheel data:', error);
    res.status(500).json({ error: 'Database saving failed' });
  }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    const newEntry = {
      email,
      phone,
      timestamp: new Date().toISOString()
    };

    // Update Memory
    newsletterData.push(newEntry);

    // Sync to Azure (Background)
    uploadToAzure('newsletter_data.json', newsletterData);

    // Sync to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'newsletter_data.json');
      safeWriteFile(dataFile, JSON.stringify(newsletterData, null, 2));
    } catch (e) { console.error("Error writing local newsletter file", e); }

    res.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error saving newsletter data:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Reviews Endpoints

// GET Reviews for a product
app.get('/api/reviews', (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Filter reviews for this product
    const productReviews = reviewsData.filter(r => r.productId === productId);
    // Sort by date desc
    productReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ reviews: productReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST Review
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, userName, rating, comment, images } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and Rating are required' });
    }

    const newReview = {
      id: Date.now().toString(), // Simple ID
      productId,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      comment,
      images: images || [],
      timestamp: new Date().toISOString()
    };

    // Update Memory
    reviewsData.push(newReview);

    // Sync to Azure (Background)
    uploadToAzure('reviews_data.json', reviewsData);

    // Sync to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'reviews_data.json');
      safeWriteFile(dataFile, JSON.stringify(reviewsData, null, 2));
    } catch (e) { console.error("Error writing local reviews file", e); }

    res.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// POST Review Photos to DigitalOcean Spaces
app.post('/api/reviews/upload', upload.array('photos', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const extension = file.originalname.split('.').pop();
      const filename = `customer_review/${Date.now()}-${uuidv4()}.${extension}`;

      const uploadParams = {
        Bucket: DO_SPACES_BUCKET,
        Key: filename,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      // DigitalOcean Spaces public URL format
      const publicUrl = `https://${DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    res.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

// UGC Votes Endpoints

// GET all votes
app.get('/api/ugc-votes', (req, res) => {
  res.set('Cache-Control', 'no-store');
  // Return simple format for frontend: { videoId: count }
  // Also return user specific vote status if userId is provided in query
  const { userId } = req.query;

  const simpleVotes = {};
  const userVotedVideos = {};

  Object.keys(ugcVotesData).forEach(key => {
    const entry = ugcVotesData[key];
    // Handle migration from old number format to object format
    const count = typeof entry === 'number' ? entry : (entry.count || 0);
    simpleVotes[key] = count;

    if (userId && typeof entry === 'object' && entry.voters && entry.voters.includes(userId)) {
      userVotedVideos[key] = true;
    }
  });

  res.json({ votes: simpleVotes, userVotedVideos });
});

// POST toggle vote
app.post('/api/ugc-votes', (req, res) => {
  try {
    const { videoId, increment, userId } = req.body; // increment: true (upvote) or false (remove vote)

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // Initialize if missing
    if (!ugcVotesData[videoId]) {
      ugcVotesData[videoId] = { count: 0, voters: [] };
    }
    // Migration: Convert old number format to object
    if (typeof ugcVotesData[videoId] === 'number') {
      ugcVotesData[videoId] = { count: ugcVotesData[videoId], voters: [] };
    }

    const entry = ugcVotesData[videoId];

    if (userId) {
      // Logged-in user logic
      const hasVoted = entry.voters.includes(userId);

      if (increment) {
        if (!hasVoted) {
          entry.voters.push(userId);
          entry.count++;
        }
      } else {
        if (hasVoted) {
          entry.voters = entry.voters.filter(id => id !== userId);
          entry.count = Math.max(0, entry.count - 1);
        }
      }
    } else {
      // Guest logic (just update count)
      if (increment) {
        entry.count++;
      } else {
        entry.count = Math.max(0, entry.count - 1);
      }
    }

    // Cleanup if count is 0 and no voters (optional, but keeps it clean)
    if (entry.count === 0 && entry.voters.length === 0) {
      delete ugcVotesData[videoId];
    }

    // Sync to Azure (Background)
    uploadToAzure('ugc_votes_data.json', ugcVotesData);

    // Sync to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'ugc_votes_data.json');
      safeWriteFile(dataFile, JSON.stringify(ugcVotesData, null, 2));
    } catch (e) { console.error("Error writing local votes file", e); }

    // Return updated simple votes
    const simpleVotes = {};
    Object.keys(ugcVotesData).forEach(key => {
      const e = ugcVotesData[key];
      simpleVotes[key] = typeof e === 'number' ? e : e.count;
    });

    res.json({ success: true, votes: simpleVotes });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Failed to save vote' });
  }
});

// POST UGC Collaboration Form
app.post('/api/ugc-collaboration', async (req, res) => {
  try {
    const { name, email, phone, city, socialHandle, followers, ugcLink, brandsWorkedWith, contentIdeas } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, Email, and Phone are required' });
    }

    const newEntry = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      city,
      socialHandle,
      followers,
      ugcLink,
      brandsWorkedWith,
      contentIdeas,
      timestamp: new Date().toISOString()
    };

    // Update Memory
    ugcCollaborationData.push(newEntry);

    // Sync JSON to Azure (Background)
    uploadToAzure('ugc_collaboration_data.json', ugcCollaborationData);

    // Sync JSON to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'ugc_collaboration_data.json');
      safeWriteFile(dataFile, JSON.stringify(ugcCollaborationData, null, 2));
    } catch (e) { console.error("Error writing local collaboration file", e); }

    // Convert to CSV and Sync
    try {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'City', 'Social Handle', 'Followers', 'UGC Link', 'Brands Worked With', 'Content Ideas', 'Timestamp'];
      const csvRows = [headers.join(',')];

      ugcCollaborationData.forEach(entry => {
        const row = [
          entry.id,
          `"${(entry.name || '').replace(/"/g, '""')}"`,
          `"${(entry.email || '').replace(/"/g, '""')}"`,
          `"${(entry.phone || '').replace(/"/g, '""')}"`,
          `"${(entry.city || '').replace(/"/g, '""')}"`,
          `"${(entry.socialHandle || '').replace(/"/g, '""')}"`,
          `"${(entry.followers || '').replace(/"/g, '""')}"`,
          `"${(entry.ugcLink || '').replace(/"/g, '""')}"`,
          `"${(entry.brandsWorkedWith || '').replace(/"/g, '""')}"`,
          `"${(entry.contentIdeas || '').replace(/"/g, '""')}"`,
          entry.timestamp
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');

      // Sync CSV to Azure
      if (containerClient) {
        const blobClient = containerClient.getBlockBlobClient('ugc_collaboration.csv');
        await blobClient.upload(csvContent, csvContent.length);
        console.log(`Synced ugc_collaboration.csv to Azure.`);
      }

      // Sync CSV to Local
      const csvFile = path.join(__dirname, 'ugc_collaboration.csv');
      safeWriteFile(csvFile, csvContent);

    } catch (e) {
      console.error("Error generating/saving CSV", e);
    }

    res.json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving collaboration data:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// OTP Authentication Endpoints
const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore.set(phone, { otp, expiry });

    // In a real application, you would integrate with an SMS gateway (Twilio, AWS SNS, etc.) here.
    console.log(`[OTP SERVICE] Sent OTP ${otp} to phone ${phone}`);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const record = otpStore.get(phone);

    if (!record) {
      return res.status(400).json({ error: 'No OTP requested for this number' });
    }

    if (Date.now() > record.expiry) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid
    otpStore.delete(phone);

    // Provide a mock token or session object for the frontend
    const token = `mock_otp_token_${Date.now()}`;

    // Mock user response. Ideally, map the phone number to an actual customer in Shopify/Postgres.
    const mockUser = {
      id: `gid://shopify/Customer/otp_${Date.now()}`,
      phone,
      fullName: "OTP User",
      email: ""
    };

    res.json({ success: true, token, user: mockUser });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Delhivery Tracking API Proxy
app.get('/api/tracking', async (req, res) => {
  try {
    const { waybill, ref_id } = req.query;
    const token = process.env.DELHIVERY_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: 'Tracking API token is not configured' });
    }

    if (!waybill && !ref_id) {
      return res.status(400).json({ error: 'Either waybill or ref_id is required' });
    }

    let url = 'https://track.delhivery.com/api/v1/packages/json/?';
    if (waybill) url += `waybill=${encodeURIComponent(waybill)}`;
    else if (ref_id) url += `ref_ids=${encodeURIComponent(ref_id)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    res.status(500).json({ error: 'Failed to fetch tracking info' });
  }
});

// Shopify MCP API endpoints
// Note: These endpoints will proxy requests to Shopify MCP tools
// In production, you would configure MCP server connection here

app.post('/api/shopify/products', async (req, res) => {
  try {
    const { searchTitle, limit } = req.body;

    // This would call the MCP tool: mcp_shopify_get-products
    // For now, we'll use Shopify Storefront API as a fallback
    // In production, integrate with your MCP server

    const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

    const query = `
      query getProducts($first: Int!, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      first: limit || 10,
      query: searchTitle ? `title:*${searchTitle}*` : undefined
    };

    const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    res.json({
      products: data.data.products.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        price: edge.node.priceRange.minVariantPrice.amount,
        currency: edge.node.priceRange.minVariantPrice.currencyCode,
        image: edge.node.images.edges[0]?.node.url
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/shopify/product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          descriptionHtml
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken
      },
      body: JSON.stringify({ query, variables: { id } })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    res.json({ product: data.data.product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/shopify/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // This endpoint processes chatbot messages and uses Shopify data
    // It can call MCP tools or Shopify APIs based on the message intent

    // Detect if the message is about products
    const productKeywords = ['product', 'item', 'buy', 'price', 'shop', 'purchase', 'catalog'];
    const isProductQuery = productKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    let shopifyData = null;

    if (isProductQuery) {
      // Extract search term from message
      const searchMatch = message.match(/(?:search|find|show|get|list).*?(?:for|about|with)?\s+(.+?)(?:\?|$)/i);
      const searchTerm = searchMatch ? searchMatch[1].trim() : null;

      const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
      const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

      const query = `
        query getProducts($first: Int!, $query: String) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                description
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        first: 5,
        query: searchTerm ? `title:*${searchTerm}*` : undefined
      };

      const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken
        },
        body: JSON.stringify({ query, variables })
      });

      const data = await response.json();

      if (!data.errors && data.data) {
        shopifyData = {
          products: data.data.products.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.description,
            price: edge.node.priceRange.minVariantPrice.amount,
            currency: edge.node.priceRange.minVariantPrice.currencyCode,
            image: edge.node.images.edges[0]?.node.url,
            handle: edge.node.handle
          }))
        };
      }
    }

    res.json({
      shopifyData,
      context: context || {}
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// --- WISHLIST API ---
app.post('/api/wishlist', async (req, res) => {
  try {
    const { userId, wishlist } = req.body;
    if (!userId || !wishlist || !Array.isArray(wishlist)) {
      return res.status(400).json({ error: "Missing or invalid userId or wishlist array" });
    }

    const shopifyStore = process.env.SHOPIFY_STORE_URL || process.env.VITE_STORE_URL?.replace('https://', '') || '72cbc9-6d.myshopify.com';
    const adminToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!adminToken) {
      return res.status(500).json({ error: "Missing Shopify Admin Access Token" });
    }

    // value must be a JSON string of array of gids
    const stringifiedValue = JSON.stringify(wishlist);
    const formattedUserId = String(userId).includes("gid://") ? userId : `gid://shopify/Customer/${userId}`;

    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metafields: [
        {
          ownerId: formattedUserId,
          namespace: "custom",
          key: "wishlist",
          type: "list.product_reference",
          value: stringifiedValue
        }
      ]
    };

    const response = await fetch(`https://${shopifyStore}/admin/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken
      },
      body: JSON.stringify({ query: mutation, variables })
    });

    const data = await response.json();
    if (data.errors) {
      console.error("Shopify Admin API Errors:", data.errors);
      return res.status(500).json({ error: "Failed to update wishlist", details: data.errors });
    }
    if (data.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("Shopify Admin API User Errors:", data.data.metafieldsSet.userErrors);
      return res.status(400).json({ error: "Failed to update wishlist metafield", details: data.data.metafieldsSet.userErrors });
    }

    return res.json({ success: true, metafields: data.data?.metafieldsSet?.metafields });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Proxy endpoint for Shopify MCP
app.post('/api/mcp-proxy', async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Missing domain query parameter' });
    }

    const mcpEndpoint = `https://${domain}/api/mcp`;

    console.log('🔌 Proxying to MCP:', mcpEndpoint);
    console.log('📦 Payload:', JSON.stringify(req.body, null, 2));

    const response = await fetch(mcpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers here
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      console.error(`❌ MCP Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: `MCP server error: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log('📥 MCP Response:', JSON.stringify(data, null, 2));

    res.json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      error: `Proxy error: ${error.message}`,
      details: 'Check backend console for more info'
    });
  }
});

// Proxy endpoint for Anthropic API
app.post('/api/anthropic/messages', async (req, res) => {
  try {
    console.log('🤖 Proxying to Anthropic API');

    // Get API key from header or env var
    let apiKey = req.headers['x-api-key'] || process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

    // Fallback if frontend accidentally sends the literal string "undefined" (common Vite caching issue)
    if (apiKey === 'undefined' || apiKey === 'null') {
      apiKey = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
    }

    // Sanitize the key: Azure environment variables sometimes include literal quotes or hidden whitespace
    if (apiKey) {
      apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
      // Debug log (masking the secret part)
      console.log(`🔑 Extracted API Key (length ${apiKey.length}): ${apiKey.substring(0, 10)}...`);
    }

    if (!apiKey || apiKey === 'undefined') {
      console.error('❌ Missing Anthropic API Key in environment variables');
      return res.status(401).json({ error: 'Missing Anthropic API Key in Server Configuration' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Anthropic API Error: ${response.status} ${response.statusText}`, errorText);
      return res.status(response.status).json({
        error: `Anthropic API error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Anthropic Proxy Error:', error);
    res.status(500).json({ error: `Proxy error: ${error.message}` });
  }
});

// Proxy endpoint for Delhivery API
app.get('/api/delhivery/pincode', async (req, res) => {
  try {
    const { pincode } = req.query;

    if (!pincode) {
      return res.status(400).json({ error: 'Missing pincode query parameter' });
    }

    const token = process.env.DELHIVERY_API_TOKEN;

    if (!token) {
      // Mock successful response when token is unavailable (for dev/demo)
      return res.json({
        success: true,
        is_serviceable: true,
        expected_delivery: 4
      });
    }

    const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Delhivery API error' });
    }

    const data = await response.json();
    if (data.delivery_codes && data.delivery_codes.length > 0) {
      const codeData = data.delivery_codes[0].postal_code;

      // Calculate exact shipping days from Origin: 400706 (MH)
      let baseDays = 4;
      const destState = codeData.state_code;

      const westZone = ["MH", "GJ", "GA", "DD", "DN"];
      const northZone = ["DL", "HR", "UP", "PB", "RJ", "UK", "HP", "JK", "CH"];
      const southEastZone = ["KA", "TN", "KL", "AP", "TS", "WB", "OR", "BR", "JH"];
      const northEastZone = ["AS", "ML", "MZ", "NL", "TR", "AR", "MN", "SK"];

      if (westZone.includes(destState)) {
        baseDays = destState === "MH" ? 2 : 3;
      } else if (northZone.includes(destState)) {
        baseDays = 5;
      } else if (northEastZone.includes(destState)) {
        baseDays = 7;
      } else {
        baseDays = 4; // Standard national metro / south
      }

      // If destination is an Out of Delivery Area, it requires an extra 2 days
      if (codeData.is_oda === "Y") {
        baseDays += 2;
      }

      res.json({
        success: true,
        is_serviceable: true,
        expected_delivery: baseDays,
        city: codeData.city,
        state: codeData.state_code
      });
    } else {
      res.json({ success: true, is_serviceable: false });
    }
  } catch (error) {
    console.error('Delhivery proxy error:', error);
    res.status(500).json({ error: 'Failed to check pincode' });
  }
});

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  // Set Cache-Control for the SPA entry point
  res.set('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=3600');
  res.sendFile(path.join(distPath, 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Shopify MCP API server running on port ${PORT}`);
  });
}

export default app;

