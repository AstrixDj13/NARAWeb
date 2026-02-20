# NARAWEAR ANALYTICS IMPLEMENTATION PLAN
## Comprehensive Design & Execution Roadmap

**Project:** Complete Analytics System for NaraWear  
**Duration:** 8-10 Weeks  
**Team Size:** 1-2 Developers  
**Budget:** $25-65/month (infrastructure)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Implementation Phases Overview](#implementation-phases-overview)
3. [Detailed Phase Breakdown](#detailed-phase-breakdown)
4. [Master To-Do List](#master-to-do-list)
5. [Risk Management](#risk-management)
6. [Testing Strategy](#testing-strategy)
7. [Success Metrics](#success-metrics)
8. [Timeline & Milestones](#timeline--milestones)

---

## 1. EXECUTIVE SUMMARY

### **Project Scope**

Build a comprehensive analytics infrastructure for NaraWear that:
- Tracks 64 event types across customer journey
- Stores data in PostgreSQL for analysis
- Integrates with Meta Ads for campaign optimization
- Provides AI-powered insights via Claude MCP integration
- Maintains 100% uptime with zero impact on production

### **Key Deliverables**

1. ✅ **React Event Tracking System** - Non-invasive wrapper component
2. ✅ **Event Collection API** - Node.js service for event ingestion
3. ✅ **PostgreSQL Data Warehouse** - Complete schema with 6 core tables
4. ✅ **Shopify Integration** - Product/order sync service
5. ✅ **Meta Pixel Integration** - Browser + Server-side tracking
6. ✅ **MCP Server** - Claude AI query interface
7. ✅ **Monitoring Dashboard** - Health checks and alerts

### **Success Criteria**

- ✅ 99.9% event capture rate
- ✅ <100ms event collection latency
- ✅ Zero production errors
- ✅ 100% test coverage for critical paths
- ✅ Claude can query analytics within 5 seconds

---

## 2. IMPLEMENTATION PHASES OVERVIEW

```
Phase 1: Foundation (Week 1-2)
├── Infrastructure Setup
├── Database Design
└── Development Environment

Phase 2: Core Analytics (Week 3-4)
├── React Event Tracking
├── Event Collection API
└── Database Implementation

Phase 3: Integrations (Week 5-6)
├── Shopify Sync Service
├── Meta Pixel Integration
└── Meta Conversions API

Phase 4: Intelligence Layer (Week 7-8)
├── MCP Server Development
├── Analytics Queries
└── Claude Integration

Phase 5: Testing & Launch (Week 9-10)
├── End-to-End Testing
├── Performance Optimization
└── Production Deployment
```

---

## 3. DETAILED PHASE BREAKDOWN

---

## **PHASE 1: FOUNDATION (Week 1-2)**

### **Objective**
Set up infrastructure, development environment, and database schema.

---

### **Week 1: Infrastructure & Tools**

#### **Day 1-2: Account Setup & Configuration**

**Tasks:**
1. Create Railway account (or Render/Supabase alternative)
2. Set up GitHub repository for analytics services
3. Create Meta Business Manager account
4. Set up Meta Pixel and get Pixel ID
5. Create Shopify Private App for API access
6. Document all credentials in password manager

**Deliverables:**
- [ ] Railway account active
- [ ] GitHub repo: `narawear-analytics`
- [ ] Meta Pixel ID obtained
- [ ] Shopify API credentials secured
- [ ] `.env.example` files created

**Files to Create:**
```
narawear-analytics/
├── README.md
├── .gitignore
├── docs/
│   ├── SETUP.md
│   └── CREDENTIALS.md (gitignored)
└── infrastructure/
    └── railway.json (or terraform configs)
```

---

#### **Day 3-5: PostgreSQL Setup**

**Tasks:**
1. Provision PostgreSQL database on Railway/Supabase
2. Configure database connection pooling
3. Set up SSL certificates
4. Create admin user and application user
5. Configure automated backups
6. Set up monitoring alerts

**Deliverables:**
- [ ] PostgreSQL 15+ instance running
- [ ] Connection string documented
- [ ] Backup policy configured (daily + 30-day retention)
- [ ] Database accessible from local dev environment

**Database Configuration:**
```sql
-- Initial setup script
CREATE DATABASE narawear_analytics;
CREATE USER analytics_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE narawear_analytics TO analytics_app;
```

---

#### **Day 6-7: Schema Design & Creation**

**Tasks:**
1. Review complete schema specification
2. Create all 6 core tables (events, sessions, orders, products, variants, customers)
3. Add indexes for performance
4. Create stored procedures for common queries
5. Set up foreign key constraints
6. Test schema with sample data

**Deliverables:**
- [ ] All tables created successfully
- [ ] Indexes applied
- [ ] Sample data inserted
- [ ] Query performance validated (<100ms)

**Schema Files to Create:**
```
database/
├── migrations/
│   ├── 001_create_events_table.sql
│   ├── 002_create_sessions_table.sql
│   ├── 003_create_orders_table.sql
│   ├── 004_create_products_table.sql
│   ├── 005_create_variants_table.sql
│   ├── 006_create_customers_table.sql
│   └── 007_create_indexes.sql
├── seeds/
│   └── sample_data.sql
└── stored_procedures/
    ├── get_conversion_funnel.sql
    ├── get_traffic_sources.sql
    └── get_product_performance.sql
```

---

### **Week 2: Development Environment**

#### **Day 8-10: Local Development Setup**

**Tasks:**
1. Set up Node.js development environment (v20+)
2. Configure ESLint and Prettier
3. Set up Git hooks with Husky
4. Create Docker Compose for local PostgreSQL
5. Configure VS Code workspace
6. Document development setup in README

**Deliverables:**
- [ ] `package.json` with all dev dependencies
- [ ] `.eslintrc.json` configured
- [ ] `.prettierrc` configured
- [ ] `docker-compose.yml` for local DB
- [ ] `CONTRIBUTING.md` guide

**Files to Create:**
```
.eslintrc.json
.prettierrc
.huskyrc
docker-compose.yml
.vscode/
├── settings.json
├── launch.json
└── extensions.json
```

---

#### **Day 11-12: Project Structure Setup**

**Tasks:**
1. Create directory structure for all services
2. Initialize Node.js projects (Event API, MCP Server, Shopify Sync)
3. Set up TypeScript configuration
4. Create shared types package
5. Set up monorepo with npm workspaces (optional)

**Deliverables:**
- [ ] All project directories created
- [ ] `package.json` files initialized
- [ ] TypeScript compiling successfully
- [ ] Shared types accessible across projects

**Directory Structure:**
```
narawear-analytics/
├── packages/
│   ├── event-api/              # Event Collection API
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── mcp-server/             # Claude MCP Server
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── shopify-sync/           # Shopify Integration
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared-types/           # Shared TypeScript types
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── database/
│   └── migrations/
├── docs/
└── package.json                # Root package.json
```

---

#### **Day 13-14: Testing Framework Setup**

**Tasks:**
1. Install Jest for unit testing
2. Set up Supertest for API testing
3. Configure test database
4. Create test utilities and fixtures
5. Write example tests
6. Set up GitHub Actions for CI

**Deliverables:**
- [ ] Jest configured and running
- [ ] Test database created
- [ ] CI pipeline running tests on push
- [ ] 100% pass rate on example tests

**Files to Create:**
```
.github/
└── workflows/
    ├── test.yml
    └── deploy.yml
packages/event-api/
└── tests/
    ├── setup.ts
    ├── fixtures/
    │   └── sample-events.json
    └── api.test.ts
```

---

## **PHASE 2: CORE ANALYTICS (Week 3-4)**

### **Objective**
Build the core event tracking system for React and event collection API.

---

### **Week 3: React Event Tracking**

#### **Day 15-17: Analytics Wrapper Component**

**Tasks:**
1. Create `AnalyticsWrapper.jsx` component
2. Implement session management (sessionStorage)
3. Implement anonymous user tracking (localStorage)
4. Add device/browser detection
5. Add UTM parameter extraction
6. Create `trackEvent()` function
7. Test component in isolation

**Deliverables:**
- [ ] `AnalyticsWrapper.jsx` complete and tested
- [ ] Session ID persisting correctly
- [ ] UTM params captured correctly
- [ ] Zero console errors

**File Structure:**
```
NARA_UI/src/
├── components/
│   └── AnalyticsWrapper.jsx
├── utils/
│   ├── analytics.js
│   ├── sessionManager.js
│   └── deviceDetection.js
└── hooks/
    └── useAnalytics.js
```

---

#### **Day 18-19: Event Tracking Hooks**

**Tasks:**
1. Create `usePageView()` hook for automatic page tracking
2. Create `useProductView()` hook for product pages
3. Create `useCartEvents()` hook for cart interactions
4. Create `useCheckoutEvents()` hook for checkout flow
5. Test hooks with mock data

**Deliverables:**
- [ ] All hooks created and tested
- [ ] Hooks integrate cleanly with existing components
- [ ] Documentation for hook usage

**Hooks to Create:**
```javascript
// hooks/usePageView.js
export const usePageView = () => { /* ... */ }

// hooks/useProductView.js
export const useProductView = (product) => { /* ... */ }

// hooks/useCartEvents.js
export const useCartEvents = () => {
  return {
    trackAddToCart: (product) => { /* ... */ },
    trackRemoveFromCart: (product) => { /* ... */ },
    trackCartView: (cart) => { /* ... */ }
  }
}

// hooks/useCheckoutEvents.js
export const useCheckoutEvents = () => { /* ... */ }
```

---

#### **Day 20-21: Integration with Existing App**

**Tasks:**
1. Add `AnalyticsWrapper` to `App.js`
2. Add environment variables to `.env`
3. Test in local development
4. Verify events are being queued
5. Test with analytics disabled (flag=false)
6. Create integration documentation

**Deliverables:**
- [ ] Analytics integrated into app
- [ ] Events queuing in browser console
- [ ] Zero impact on existing functionality
- [ ] Toggle works correctly

**Changes to Existing Files:**
```javascript
// NARA_UI/src/App.js (BEFORE)
function App() {
  return (
    <Router>
      {/* existing app */}
    </Router>
  );
}

// NARA_UI/src/App.js (AFTER - ONE LINE CHANGE)
import AnalyticsWrapper from './components/AnalyticsWrapper';

function App() {
  return (
    <Router>
      <AnalyticsWrapper>
        {/* existing app */}
      </AnalyticsWrapper>
    </Router>
  );
}
```

---

### **Week 4: Event Collection API**

#### **Day 22-24: API Server Setup**

**Tasks:**
1. Initialize Express.js application
2. Set up CORS middleware
3. Add request validation middleware
4. Add error handling middleware
5. Create health check endpoint
6. Set up logging (Winston/Pino)
7. Add rate limiting

**Deliverables:**
- [ ] Express server running on port 3001
- [ ] Health check responding: `GET /health`
- [ ] CORS configured for frontend
- [ ] Logs writing to console and file

**API Structure:**
```
packages/event-api/
├── src/
│   ├── server.js              # Main entry point
│   ├── routes/
│   │   ├── events.js          # Event ingestion routes
│   │   ├── health.js          # Health check
│   │   └── admin.js           # Admin routes
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── eventService.js    # Business logic
│   │   └── databaseService.js # DB operations
│   └── utils/
│       ├── logger.js
│       └── helpers.js
├── tests/
├── package.json
└── .env.example
```

---

#### **Day 25-26: Event Ingestion Logic**

**Tasks:**
1. Create `POST /events` endpoint
2. Create `POST /events/batch` endpoint
3. Implement event validation
4. Add IP address hashing for privacy
5. Add page type detection
6. Implement database insertion
7. Add event queuing for high load

**Deliverables:**
- [ ] Events endpoint accepting POST requests
- [ ] Validation rejecting invalid events
- [ ] Events writing to PostgreSQL
- [ ] Batch endpoint handling multiple events

**Event Validation Schema:**
```javascript
// validation/eventSchema.js
const Joi = require('joi');

const eventSchema = Joi.object({
  event_id: Joi.string().uuid().required(),
  event_name: Joi.string().max(50).required(),
  event_timestamp: Joi.date().iso().required(),
  session_id: Joi.string().max(100).required(),
  anonymous_id: Joi.string().max(100).required(),
  user_id: Joi.string().max(100).optional(),
  page_url: Joi.string().uri().required(),
  page_path: Joi.string().max(500).required(),
  // ... all other fields
});

module.exports = { eventSchema };
```

---

#### **Day 27-28: Database Service**

**Tasks:**
1. Create database connection pool
2. Implement `insertEvent()` function
3. Implement `insertEventBatch()` function
4. Add transaction support
5. Add retry logic for failures
6. Create database health check
7. Optimize queries with prepared statements

**Deliverables:**
- [ ] Database service module complete
- [ ] Connection pooling working
- [ ] Bulk insert performance optimized (<50ms for 100 events)
- [ ] Error handling with retries

**Database Service:**
```javascript
// services/databaseService.js
import pg from 'pg';
const { Pool } = pg;

class DatabaseService {
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async insertEvent(event) { /* ... */ }
  async insertEventBatch(events) { /* ... */ }
  async healthCheck() { /* ... */ }
}

export default new DatabaseService();
```

---

## **PHASE 3: INTEGRATIONS (Week 5-6)**

### **Objective**
Integrate with Shopify and Meta Ads platforms.

---

### **Week 5: Shopify Integration**

#### **Day 29-31: Shopify Product Sync**

**Tasks:**
1. Create Shopify API client
2. Implement product fetch from Shopify
3. Implement variant fetch
4. Create sync logic with upsert
5. Add error handling and retries
6. Set up cron job for periodic sync
7. Test with actual Shopify store

**Deliverables:**
- [ ] Products syncing from Shopify to PostgreSQL
- [ ] Variants syncing correctly
- [ ] Cron job running every hour
- [ ] Sync errors logged

**Shopify Sync Service:**
```javascript
// packages/shopify-sync/src/syncService.js
import fetch from 'node-fetch';

class ShopifySyncService {
  constructor() {
    this.domain = process.env.SHOPIFY_DOMAIN;
    this.token = process.env.SHOPIFY_ACCESS_TOKEN;
  }

  async fetchProducts() { /* ... */ }
  async syncProducts() { /* ... */ }
  async fetchOrders() { /* ... */ }
  async syncOrders() { /* ... */ }
}

export default new ShopifySyncService();
```

---

#### **Day 32-33: Shopify Order Sync**

**Tasks:**
1. Implement order fetch from Shopify
2. Parse order line items
3. Extract attribution data (UTM params from order)
4. Sync orders to PostgreSQL
5. Handle order updates and cancellations
6. Test order webhooks

**Deliverables:**
- [ ] Orders syncing to PostgreSQL
- [ ] Order attribution captured
- [ ] Webhooks processing order updates
- [ ] Historical orders imported

**Order Sync Logic:**
```javascript
// syncOrders.js
async function syncOrders() {
  const orders = await fetchShopifyOrders();
  
  for (const order of orders) {
    await db.query(`
      INSERT INTO orders (
        order_id, order_number, customer_id, customer_email,
        subtotal, tax_amount, shipping_amount, total_amount,
        utm_source, utm_medium, utm_campaign,
        order_created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (order_id) DO UPDATE SET
        order_status = EXCLUDED.order_status,
        financial_status = EXCLUDED.financial_status
    `, [/* values */]);
  }
}
```

---

#### **Day 34-35: Shopify Webhooks**

**Tasks:**
1. Create webhook endpoints for:
   - Order creation
   - Order updates
   - Product updates
   - Customer updates
2. Implement webhook signature verification
3. Add webhook processing queue
4. Test webhooks with Shopify sandbox
5. Set up webhook monitoring

**Deliverables:**
- [ ] Webhooks registered in Shopify
- [ ] Webhooks processing successfully
- [ ] Signature verification working
- [ ] Failed webhooks logged for retry

**Webhook Routes:**
```javascript
// routes/webhooks.js
router.post('/webhooks/orders/create', verifyShopifyWebhook, async (req, res) => {
  const order = req.body;
  await processOrderCreated(order);
  res.status(200).send('OK');
});

router.post('/webhooks/products/update', verifyShopifyWebhook, async (req, res) => {
  const product = req.body;
  await processProductUpdated(product);
  res.status(200).send('OK');
});
```

---

### **Week 6: Meta Ads Integration**

#### **Day 36-38: Meta Pixel Setup**

**Tasks:**
1. Add Meta Pixel code to React app HTML
2. Verify pixel firing in Meta Events Manager
3. Map event tracking to Meta standard events
4. Test all critical events (PageView, ViewContent, AddToCart, Purchase)
5. Set up custom conversions
6. Configure event parameters

**Deliverables:**
- [ ] Meta Pixel installed and firing
- [ ] All critical events verified in Events Manager
- [ ] Custom parameters passing correctly
- [ ] Test purchase events showing in dashboard

**Meta Pixel Integration:**
```javascript
// utils/metaPixel.js
export const sendToMetaPixel = (eventName, properties) => {
  if (!window.fbq) return;
  
  const metaEventMap = {
    page_view: 'PageView',
    product_view: 'ViewContent',
    add_to_cart: 'AddToCart',
    checkout_started: 'InitiateCheckout',
    purchase: 'Purchase',
  };
  
  const metaEvent = metaEventMap[eventName];
  if (metaEvent) {
    window.fbq('track', metaEvent, {
      content_ids: properties.product_id ? [properties.product_id] : [],
      content_type: 'product',
      value: properties.price || 0,
      currency: 'INR',
    });
  }
};
```

---

#### **Day 39-41: Meta Conversions API**

**Tasks:**
1. Set up Meta Conversions API credentials
2. Create server-side event sender
3. Implement event deduplication with event_id
4. Send purchase events from backend
5. Add user data hashing (email, phone)
6. Test conversions API with Meta's test tool
7. Monitor event match quality

**Deliverables:**
- [ ] Conversions API integrated
- [ ] Server-side purchase events sending
- [ ] Event deduplication working (no duplicates)
- [ ] Match quality > 7.0 in Meta dashboard

**Conversions API Service:**
```javascript
// services/metaConversionsAPI.js
import crypto from 'crypto';
import fetch from 'node-fetch';

class MetaConversionsAPI {
  constructor() {
    this.pixelId = process.env.META_PIXEL_ID;
    this.accessToken = process.env.META_ACCESS_TOKEN;
  }

  async sendEvent(eventName, userData, customData, eventId) {
    const url = `https://graph.facebook.com/v18.0/${this.pixelId}/events`;
    
    const hashedData = {
      em: userData.email ? this.hash(userData.email) : undefined,
      ph: userData.phone ? this.hash(userData.phone) : undefined,
      fn: userData.firstName ? this.hash(userData.firstName) : undefined,
    };

    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId, // For deduplication
        user_data: hashedData,
        custom_data: customData,
        event_source_url: userData.sourceUrl,
        action_source: 'website',
      }],
      access_token: this.accessToken,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return response.json();
  }

  hash(value) {
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
  }
}

export default new MetaConversionsAPI();
```

---

#### **Day 42: Meta Attribution Testing**

**Tasks:**
1. Run test purchases with UTM parameters
2. Verify attribution in Meta Ads Manager
3. Check conversion tracking in PostgreSQL
4. Test with different UTM sources (facebook, instagram)
5. Verify ROAS calculations
6. Document attribution flow

**Deliverables:**
- [ ] End-to-end attribution working
- [ ] Test conversions showing in Ads Manager
- [ ] Attribution data in PostgreSQL matches Meta
- [ ] Documentation complete

---

## **PHASE 4: INTELLIGENCE LAYER (Week 7-8)**

### **Objective**
Build MCP server for Claude AI integration and analytics queries.

---

### **Week 7: MCP Server Development**

#### **Day 43-45: MCP Server Setup**

**Tasks:**
1. Initialize MCP server project with TypeScript
2. Install MCP SDK dependencies
3. Set up database connection
4. Create server scaffolding
5. Implement tool registration
6. Test basic server startup

**Deliverables:**
- [ ] MCP server compiling successfully
- [ ] Server responding to stdio transport
- [ ] Database connection working
- [ ] Basic tool registered

**MCP Server Structure:**
```
packages/mcp-server/
├── src/
│   ├── index.ts               # Main server entry
│   ├── tools/
│   │   ├── queryEvents.ts
│   │   ├── conversionFunnel.ts
│   │   ├── productPerformance.ts
│   │   ├── customerSegments.ts
│   │   ├── sessionAnalysis.ts
│   │   └── attribution.ts
│   ├── db.ts                  # Database connection
│   └── types.ts               # TypeScript types
├── tests/
├── build/                     # Compiled JS output
├── package.json
└── tsconfig.json
```

---

#### **Day 46-48: Analytics Tools Implementation**

**Tasks:**
1. Implement `query_events` tool
2. Implement `get_conversion_funnel` tool
3. Implement `get_product_performance` tool
4. Implement `get_customer_segments` tool
5. Implement `get_session_analysis` tool
6. Implement `get_attribution_report` tool
7. Test each tool with sample queries

**Deliverables:**
- [ ] All 6 analytics tools implemented
- [ ] Each tool returns formatted JSON
- [ ] Query performance < 2 seconds
- [ ] Error handling working

**Tool Example:**
```typescript
// tools/conversionFunnel.ts
export async function conversionFunnelHandler(args: any) {
  const pool = getDbPool();
  const { start_date, end_date } = args;
  
  const query = `
    WITH funnel_data AS (
      SELECT 
        session_id,
        MAX(CASE WHEN event_name = 'product_view' THEN 1 ELSE 0 END) as viewed,
        MAX(CASE WHEN event_name = 'add_to_cart' THEN 1 ELSE 0 END) as added_cart,
        MAX(CASE WHEN event_name = 'checkout_started' THEN 1 ELSE 0 END) as checkout,
        MAX(CASE WHEN event_name = 'purchase' THEN 1 ELSE 0 END) as purchased
      FROM events
      WHERE event_timestamp >= $1::timestamp
        AND event_timestamp <= $2::timestamp
      GROUP BY session_id
    )
    SELECT 
      SUM(viewed) as product_views,
      SUM(added_cart) as add_to_carts,
      SUM(checkout) as checkouts,
      SUM(purchased) as purchases,
      ROUND(100.0 * SUM(added_cart) / NULLIF(SUM(viewed), 0), 2) as cart_rate,
      ROUND(100.0 * SUM(purchased) / NULLIF(SUM(viewed), 0), 2) as conversion_rate
    FROM funnel_data
  `;
  
  const result = await pool.query(query, [start_date, end_date]);
  
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result.rows[0], null, 2),
      },
    ],
  };
}
```

---

#### **Day 49: MCP Server Testing**

**Tasks:**
1. Build MCP server (`npm run build`)
2. Test server locally with stdio
3. Test each tool individually
4. Test error handling
5. Test with invalid inputs
6. Document tool usage

**Deliverables:**
- [ ] All tools tested and working
- [ ] Error messages clear and helpful
- [ ] Documentation for each tool
- [ ] README with setup instructions

---

### **Week 8: Claude Integration**

#### **Day 50-51: Claude Desktop Configuration**

**Tasks:**
1. Configure MCP server in Claude Desktop
2. Test connection to PostgreSQL
3. Verify tools are visible in Claude
4. Test each tool with natural language queries
5. Optimize query responses for readability
6. Create example queries documentation

**Deliverables:**
- [ ] MCP server connected to Claude Desktop
- [ ] All tools accessible from Claude
- [ ] Query responses formatted nicely
- [ ] Example queries working

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "narawear-analytics": {
      "command": "node",
      "args": ["/path/to/narawear-mcp-server/build/index.js"],
      "env": {
        "DB_HOST": "your-postgres-host",
        "DB_PORT": "5432",
        "DB_NAME": "narawear_analytics",
        "DB_USER": "postgres",
        "DB_PASSWORD": "your_password"
      }
    }
  }
}
```

---

#### **Day 52-53: Analytics Dashboards**

**Tasks:**
1. Create pre-built queries for common questions
2. Test complex multi-tool queries
3. Create saved Claude prompts for reports
4. Test real-time query performance
5. Optimize slow queries
6. Create analytics playbook

**Deliverables:**
- [ ] 20+ pre-built query examples
- [ ] Complex queries working (e.g., cohort analysis)
- [ ] All queries return in < 5 seconds
- [ ] Analytics playbook document

**Example Queries:**
```
"Show me the conversion funnel for last 7 days"
"Which 10 products have the highest add-to-cart rate this month?"
"What's our revenue breakdown by traffic source?"
"Show me customer segments and their average order value"
"What's the cart abandonment rate by device type?"
"Which marketing campaigns drove the most revenue?"
```

---

#### **Day 54-56: Advanced Analytics**

**Tasks:**
1. Create cohort analysis query
2. Create customer lifetime value calculation
3. Create product affinity analysis
4. Create session replay query (top converting sessions)
5. Create anomaly detection queries
6. Test with production-scale data

**Deliverables:**
- [ ] Advanced analytics tools working
- [ ] Cohort analysis showing retention
- [ ] LTV calculation accurate
- [ ] Product recommendations based on affinity

---

## **PHASE 5: TESTING & LAUNCH (Week 9-10)**

### **Objective**
Comprehensive testing, optimization, and production deployment.

---

### **Week 9: Testing**

#### **Day 57-59: Unit Testing**

**Tasks:**
1. Write unit tests for React components
2. Write unit tests for Event API routes
3. Write unit tests for database services
4. Write unit tests for MCP tools
5. Achieve 80%+ code coverage
6. Fix all failing tests

**Deliverables:**
- [ ] 100+ unit tests written
- [ ] 80%+ code coverage
- [ ] All tests passing
- [ ] CI pipeline green

**Test Coverage Goals:**
```
Event API:       90%+ coverage
MCP Server:      85%+ coverage
React Components: 75%+ coverage
Shopify Sync:    80%+ coverage
```

---

#### **Day 60-62: Integration Testing**

**Tasks:**
1. Test React → Event API flow
2. Test Event API → PostgreSQL flow
3. Test Shopify → PostgreSQL sync
4. Test Meta Pixel → Conversions API flow
5. Test PostgreSQL → MCP → Claude flow
6. Test end-to-end purchase flow

**Deliverables:**
- [ ] All integration tests passing
- [ ] End-to-end flows working
- [ ] No data loss in any flow
- [ ] Performance acceptable

**Integration Test Scenarios:**
```
Scenario 1: User Journey
- User visits site → page_view tracked
- Views product → product_view tracked
- Adds to cart → add_to_cart tracked
- Completes purchase → purchase tracked
- Order synced from Shopify
- All events in PostgreSQL
- Claude can query the journey

Scenario 2: Attribution
- User clicks Meta ad with UTM params
- UTM params captured in events
- Purchase attributed correctly
- Meta Conversions API receives event
- Attribution visible in Meta Ads Manager
```

---

#### **Day 63: Load Testing**

**Tasks:**
1. Set up load testing with Artillery or k6
2. Test Event API with 1000 req/sec
3. Test database write performance
4. Test MCP query performance under load
5. Identify bottlenecks
6. Optimize slow components

**Deliverables:**
- [ ] Load tests defined and running
- [ ] Event API handles 1000 req/sec
- [ ] Database writes < 50ms p95
- [ ] MCP queries < 3 seconds under load

**Load Test Configuration:**
```yaml
# artillery-load-test.yml
config:
  target: "https://your-analytics-api.railway.app"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 100
      name: "Sustained load"
    - duration: 60
      arrivalRate: 500
      name: "Spike"
scenarios:
  - flow:
      - post:
          url: "/events"
          json:
            event_id: "{{ $randomUUID }}"
            event_name: "page_view"
            # ... other fields
```

---

### **Week 10: Launch**

#### **Day 64-66: Staging Deployment**

**Tasks:**
1. Deploy Event API to Railway staging
2. Deploy PostgreSQL to Railway staging
3. Deploy Shopify Sync to Railway staging
4. Configure staging environment variables
5. Run smoke tests on staging
6. Test with staging Shopify store
7. Fix any deployment issues

**Deliverables:**
- [ ] All services deployed to staging
- [ ] Staging environment healthy
- [ ] End-to-end tests passing on staging
- [ ] No errors in logs

**Deployment Checklist:**
```
- [ ] Event API deployed and responding
- [ ] PostgreSQL accessible and tables created
- [ ] Environment variables configured
- [ ] CORS allows staging frontend
- [ ] Health checks passing
- [ ] Logs streaming to console
- [ ] Monitoring alerts configured
```

---

#### **Day 67-68: Production Deployment**

**Tasks:**
1. Create production environment on Railway
2. Deploy Event API to production
3. Provision production PostgreSQL with backups
4. Configure production environment variables
5. Deploy Shopify Sync to production
6. Update React app environment variables
7. Deploy React app with analytics enabled
8. Monitor for 24 hours

**Deliverables:**
- [ ] All services in production
- [ ] React app tracking events
- [ ] Events flowing to database
- [ ] Zero production errors
- [ ] Monitoring dashboard green

**Production Deployment Steps:**
```bash
# 1. Deploy Event API
cd packages/event-api
railway up

# 2. Create production database
railway run psql < database/migrations/*.sql

# 3. Deploy Shopify Sync
cd packages/shopify-sync
railway up

# 4. Update React environment
# In Digital Ocean dashboard:
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_ANALYTICS_API_URL=https://analytics.railway.app

# 5. Rebuild and deploy React app
cd NARA_UI
npm run build
# Deploy to Digital Ocean
```

---

#### **Day 69: Launch Monitoring**

**Tasks:**
1. Monitor event ingestion rates
2. Check database size and performance
3. Verify Shopify sync running
4. Test Meta Conversions API events
5. Run test purchases
6. Check for errors or anomalies
7. Create incident response plan

**Deliverables:**
- [ ] Monitoring dashboard created
- [ ] Alert thresholds configured
- [ ] No critical issues
- [ ] Team trained on monitoring
- [ ] Incident response plan documented

**Monitoring Checklist:**
```
Metrics to Monitor:
- [ ] Event ingestion rate (events/minute)
- [ ] API response time (p50, p95, p99)
- [ ] Database connections (current/max)
- [ ] Database disk usage
- [ ] Error rate (errors/minute)
- [ ] Shopify sync success rate
- [ ] Meta Conversions API success rate

Alerts to Configure:
- API error rate > 5%
- API response time p95 > 500ms
- Database disk > 80% full
- Event ingestion stopped
- Shopify sync failed
```

---

#### **Day 70: Documentation & Handoff**

**Tasks:**
1. Complete all README files
2. Document deployment procedures
3. Create operations runbook
4. Document troubleshooting guides
5. Create video walkthrough
6. Schedule training session
7. Celebrate launch! 🎉

**Deliverables:**
- [ ] Complete documentation set
- [ ] Runbook for operations
- [ ] Troubleshooting guide
- [ ] Video walkthrough recorded
- [ ] Team trained
- [ ] Project marked complete

---

## 4. MASTER TO-DO LIST

### **✅ INFRASTRUCTURE (Days 1-14)**

#### **Accounts & Setup**
- [ ] Create Railway account
- [ ] Create GitHub repository
- [ ] Set up Meta Business Manager
- [ ] Get Meta Pixel ID
- [ ] Create Shopify Private App
- [ ] Document all credentials

#### **Database**
- [ ] Provision PostgreSQL on Railway/Supabase
- [ ] Configure connection pooling
- [ ] Set up SSL certificates
- [ ] Configure automated backups
- [ ] Create events table
- [ ] Create sessions table
- [ ] Create orders table
- [ ] Create products table
- [ ] Create variants table
- [ ] Create customers table
- [ ] Add all indexes
- [ ] Test with sample data

#### **Development Environment**
- [ ] Install Node.js v20+
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Set up Git hooks with Husky
- [ ] Create Docker Compose for local DB
- [ ] Set up VS Code workspace
- [ ] Document setup in README

#### **Project Structure**
- [ ] Create event-api directory
- [ ] Create mcp-server directory
- [ ] Create shopify-sync directory
- [ ] Create shared-types package
- [ ] Initialize all package.json files
- [ ] Configure TypeScript

#### **Testing Setup**
- [ ] Install Jest
- [ ] Install Supertest
- [ ] Create test database
- [ ] Create test utilities
- [ ] Write example tests
- [ ] Set up GitHub Actions CI

---

### **✅ REACT EVENT TRACKING (Days 15-21)**

#### **Analytics Wrapper**
- [ ] Create AnalyticsWrapper.jsx
- [ ] Implement session management
- [ ] Implement anonymous ID tracking
- [ ] Add device detection
- [ ] Add browser detection
- [ ] Add UTM parameter extraction
- [ ] Create trackEvent() function
- [ ] Test component in isolation

#### **Event Hooks**
- [ ] Create usePageView() hook
- [ ] Create useProductView() hook
- [ ] Create useCartEvents() hook
- [ ] Create useCheckoutEvents() hook
- [ ] Test all hooks

#### **Integration**
- [ ] Add AnalyticsWrapper to App.js
- [ ] Add environment variables
- [ ] Test in local development
- [ ] Verify events queuing
- [ ] Test with analytics disabled
- [ ] Create integration docs

---

### **✅ EVENT COLLECTION API (Days 22-28)**

#### **API Server**
- [ ] Initialize Express.js app
- [ ] Set up CORS middleware
- [ ] Add request validation
- [ ] Add error handling
- [ ] Create health check endpoint
- [ ] Set up logging
- [ ] Add rate limiting

#### **Event Ingestion**
- [ ] Create POST /events endpoint
- [ ] Create POST /events/batch endpoint
- [ ] Implement event validation
- [ ] Add IP address hashing
- [ ] Add page type detection
- [ ] Implement database insertion
- [ ] Add event queuing

#### **Database Service**
- [ ] Create database pool
- [ ] Implement insertEvent()
- [ ] Implement insertEventBatch()
- [ ] Add transaction support
- [ ] Add retry logic
- [ ] Create health check
- [ ] Optimize queries

---

### **✅ SHOPIFY INTEGRATION (Days 29-35)**

#### **Product Sync**
- [ ] Create Shopify API client
- [ ] Implement product fetch
- [ ] Implement variant fetch
- [ ] Create sync logic with upsert
- [ ] Add error handling
- [ ] Set up cron job
- [ ] Test with Shopify store

#### **Order Sync**
- [ ] Implement order fetch
- [ ] Parse order line items
- [ ] Extract attribution data
- [ ] Sync orders to PostgreSQL
- [ ] Handle order updates
- [ ] Test order webhooks

#### **Webhooks**
- [ ] Create order creation webhook
- [ ] Create order update webhook
- [ ] Create product update webhook
- [ ] Implement signature verification
- [ ] Add webhook queue
- [ ] Test webhooks
- [ ] Set up monitoring

---

### **✅ META ADS INTEGRATION (Days 36-42)**

#### **Meta Pixel**
- [ ] Add Meta Pixel to React HTML
- [ ] Verify pixel firing
- [ ] Map events to Meta standard events
- [ ] Test PageView event
- [ ] Test ViewContent event
- [ ] Test AddToCart event
- [ ] Test Purchase event
- [ ] Set up custom conversions

#### **Conversions API**
- [ ] Get Conversions API credentials
- [ ] Create server-side event sender
- [ ] Implement event deduplication
- [ ] Send purchase events from backend
- [ ] Add user data hashing
- [ ] Test with Meta's tool
- [ ] Monitor match quality

#### **Attribution Testing**
- [ ] Run test purchases with UTM
- [ ] Verify attribution in Ads Manager
- [ ] Check PostgreSQL attribution data
- [ ] Test different UTM sources
- [ ] Verify ROAS calculations
- [ ] Document attribution flow

---

### **✅ MCP SERVER (Days 43-56)**

#### **Server Setup**
- [ ] Initialize MCP project
- [ ] Install MCP SDK
- [ ] Set up database connection
- [ ] Create server scaffolding
- [ ] Implement tool registration
- [ ] Test server startup

#### **Analytics Tools**
- [ ] Implement query_events tool
- [ ] Implement get_conversion_funnel tool
- [ ] Implement get_product_performance tool
- [ ] Implement get_customer_segments tool
- [ ] Implement get_session_analysis tool
- [ ] Implement get_attribution_report tool
- [ ] Test each tool

#### **Claude Integration**
- [ ] Configure MCP in Claude Desktop
- [ ] Test PostgreSQL connection
- [ ] Verify tools visible
- [ ] Test with natural language
- [ ] Optimize responses
- [ ] Create example queries

#### **Advanced Analytics**
- [ ] Create cohort analysis
- [ ] Create LTV calculation
- [ ] Create product affinity analysis
- [ ] Create session replay query
- [ ] Create anomaly detection
- [ ] Test with production data

---

### **✅ TESTING (Days 57-63)**

#### **Unit Tests**
- [ ] Write React component tests
- [ ] Write Event API tests
- [ ] Write database service tests
- [ ] Write MCP tool tests
- [ ] Achieve 80%+ coverage
- [ ] Fix all failing tests

#### **Integration Tests**
- [ ] Test React → Event API
- [ ] Test Event API → PostgreSQL
- [ ] Test Shopify → PostgreSQL
- [ ] Test Meta Pixel → Conversions API
- [ ] Test PostgreSQL → MCP → Claude
- [ ] Test end-to-end purchase

#### **Load Testing**
- [ ] Set up load testing tool
- [ ] Test Event API at scale
- [ ] Test database performance
- [ ] Test MCP under load
- [ ] Identify bottlenecks
- [ ] Optimize slow components

---

### **✅ DEPLOYMENT (Days 64-70)**

#### **Staging**
- [ ] Deploy Event API to staging
- [ ] Deploy PostgreSQL to staging
- [ ] Deploy Shopify Sync to staging
- [ ] Configure staging env vars
- [ ] Run smoke tests
- [ ] Fix deployment issues

#### **Production**
- [ ] Create production environment
- [ ] Deploy Event API
- [ ] Provision production PostgreSQL
- [ ] Configure production env vars
- [ ] Deploy Shopify Sync
- [ ] Update React env vars
- [ ] Deploy React app
- [ ] Monitor for 24 hours

#### **Monitoring**
- [ ] Monitor ingestion rates
- [ ] Check database performance
- [ ] Verify Shopify sync
- [ ] Test Meta Conversions API
- [ ] Run test purchases
- [ ] Check for errors
- [ ] Create incident plan

#### **Documentation**
- [ ] Complete all READMEs
- [ ] Document deployment
- [ ] Create operations runbook
- [ ] Create troubleshooting guide
- [ ] Record video walkthrough
- [ ] Schedule training
- [ ] Project complete! 🎉

---

## 5. RISK MANAGEMENT

### **Technical Risks**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Event data loss | Medium | High | Implement retry logic, add event queue |
| Database performance degradation | Medium | High | Index optimization, connection pooling |
| Shopify API rate limits | High | Medium | Implement exponential backoff, caching |
| Meta Conversions API errors | Medium | Medium | Fallback to Pixel only, error logging |
| MCP server crashes | Low | Medium | Add health checks, auto-restart |
| React app performance impact | Low | High | Async event sending, feature flag |

### **Business Risks**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Production downtime | Low | High | Blue-green deployment, rollback plan |
| Data privacy violations | Low | Critical | GDPR compliance, data anonymization |
| Cost overruns | Medium | Low | Set budget alerts, monitor usage |
| Team unavailability | Medium | Medium | Document everything, cross-train |

### **Mitigation Strategies**

1. **Feature Flags**
   - Analytics can be disabled instantly with env var
   - No code deployment needed to disable

2. **Rollback Plan**
   - Keep previous working version deployed
   - Database migrations are reversible
   - React app can be reverted in minutes

3. **Data Backup**
   - Automated daily PostgreSQL backups
   - 30-day retention period
   - Point-in-time recovery available

4. **Monitoring & Alerts**
   - Real-time error tracking
   - Performance monitoring
   - Automated alerts for critical issues

---

## 6. TESTING STRATEGY

### **Testing Pyramid**

```
          ╱╲
         ╱E2E╲         5% - End-to-End Tests
        ╱──────╲
       ╱        ╲
      ╱Integration╲    25% - Integration Tests
     ╱────────────╲
    ╱              ╲
   ╱     Unit       ╲  70% - Unit Tests
  ╱──────────────────╲
```

### **Unit Testing (70%)**

**React Components:**
- [ ] AnalyticsWrapper renders correctly
- [ ] Session ID persists across renders
- [ ] UTM params extracted correctly
- [ ] Device detection accurate
- [ ] trackEvent() sends correct data

**Event API:**
- [ ] POST /events validates input
- [ ] Invalid events rejected
- [ ] IP hashing working
- [ ] Database insertion successful
- [ ] Batch processing working

**MCP Server:**
- [ ] Each tool returns valid JSON
- [ ] SQL queries are correct
- [ ] Error handling works
- [ ] Database connection manages properly

### **Integration Testing (25%)**

**End-to-End Flows:**
- [ ] Event from React → API → PostgreSQL
- [ ] Shopify product → PostgreSQL
- [ ] Shopify order → PostgreSQL
- [ ] Meta Pixel → Conversions API
- [ ] PostgreSQL → MCP → Claude

### **E2E Testing (5%)**

**Critical User Journeys:**
- [ ] Anonymous user visits site → purchase → data in all systems
- [ ] Logged in user journey with full attribution
- [ ] Meta ad click → purchase → attribution visible

### **Test Environments**

1. **Local** - Developer machines with Docker
2. **Staging** - Railway staging environment
3. **Production** - Railway production environment

---

## 7. SUCCESS METRICS

### **Technical Metrics**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Event capture rate | 99.9% | Events sent vs events received |
| API response time (p95) | <100ms | Monitoring dashboard |
| Database write latency | <50ms | Query performance logs |
| MCP query time | <5 seconds | Tool execution time |
| System uptime | 99.9% | Uptime monitoring |
| Error rate | <0.1% | Error logs |

### **Business Metrics**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Conversion funnel visibility | 100% | All steps tracked |
| Attribution accuracy | >90% | Match with Shopify orders |
| Meta match quality | >7.0 | Meta Events Manager |
| Data freshness | <5 minutes | Event timestamp vs ingestion |
| Query insights provided | >50 | Claude MCP usage |

### **Tracking Dashboard**

Create a dashboard to monitor:
- Events per minute
- Top event types
- Geographic distribution
- Device breakdown
- Conversion funnel
- Revenue by traffic source
- System health (API, DB, Shopify sync)

---

## 8. TIMELINE & MILESTONES

### **Project Timeline (10 Weeks)**

```
Week 1-2:  ████████ Foundation
Week 3-4:  ████████ Core Analytics
Week 5-6:  ████████ Integrations
Week 7-8:  ████████ Intelligence Layer
Week 9-10: ████████ Testing & Launch
```

### **Key Milestones**

| Milestone | Target Date | Deliverable |
|-----------|-------------|-------------|
| M1: Foundation Complete | End of Week 2 | PostgreSQL + Dev Environment Ready |
| M2: Core Analytics Working | End of Week 4 | Events flowing React → API → DB |
| M3: Integrations Live | End of Week 6 | Shopify + Meta fully integrated |
| M4: MCP Server Ready | End of Week 8 | Claude can query analytics |
| M5: Production Launch | End of Week 10 | All systems live in production |

### **Sprint Schedule**

**Sprint 1 (Week 1-2):** Infrastructure & Database  
**Sprint 2 (Week 3-4):** React Tracking & Event API  
**Sprint 3 (Week 5-6):** Shopify & Meta Integration  
**Sprint 4 (Week 7-8):** MCP Server & Claude  
**Sprint 5 (Week 9-10):** Testing & Deployment  

---

## 9. TEAM ROLES & RESPONSIBILITIES

### **If Solo Developer**

You'll handle all phases sequentially. Estimated: **10 weeks full-time**

### **If Team of 2**

**Developer 1 (Backend Focus):**
- Event Collection API
- PostgreSQL setup and optimization
- Shopify integration
- MCP Server

**Developer 2 (Frontend Focus):**
- React AnalyticsWrapper
- Event tracking hooks
- Meta Pixel integration
- Testing

Estimated: **6-8 weeks**

---

## 10. QUICK START CHECKLIST

### **Week 1 - Get Started Today**

**Day 1:**
- [ ] Create Railway account
- [ ] Create GitHub repo
- [ ] Set up Meta Pixel
- [ ] Get Shopify API credentials

**Day 2:**
- [ ] Provision PostgreSQL
- [ ] Clone repo locally
- [ ] Install dependencies
- [ ] Create `.env` files

**Day 3:**
- [ ] Create database tables
- [ ] Test database connection
- [ ] Insert sample data

**Day 4-5:**
- [ ] Set up development environment
- [ ] Configure ESLint/Prettier
- [ ] Write first test

**Day 6-7:**
- [ ] Initialize all service directories
- [ ] Create basic Express server
- [ ] Test health endpoint

---

## 11. RESOURCES & REFERENCES

### **Documentation Links**

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Shopify API Reference](https://shopify.dev/docs/api/admin)
- [MCP SDK Documentation](https://github.com/anthropics/model-context-protocol)
- [Railway Documentation](https://docs.railway.app/)

### **Code Examples Repository**

All code examples from this plan are available in:
```
https://github.com/yourusername/narawear-analytics-examples
```

### **Support & Help**

- Technical issues: Create GitHub issue
- Database questions: PostgreSQL community forums
- Meta Ads: Meta Developer support
- Shopify: Shopify Partner support

---

## 12. POST-LAUNCH PLAN

### **Week 11-12: Optimization**

- [ ] Analyze performance metrics
- [ ] Optimize slow queries
- [ ] Reduce database size if needed
- [ ] Improve event collection efficiency
- [ ] Add missing events discovered in production

### **Week 13+: Ongoing Maintenance**

- [ ] Weekly database maintenance
- [ ] Monthly security updates
- [ ] Quarterly feature additions
- [ ] Bi-annual schema optimizations

### **Feature Roadmap**

**Q2 2026:**
- Real-time dashboards in React
- Email alerts for key metrics
- A/B testing framework

**Q3 2026:**
- Predictive analytics (ML models)
- Customer segmentation automation
- Automated report generation

**Q4 2026:**
- Mobile app event tracking
- Advanced cohort analysis
- Custom dashboard builder

---

## 13. COST BREAKDOWN

### **Development Cost**

| Resource | Rate | Hours | Total |
|----------|------|-------|-------|
| Senior Developer | $75/hr | 400 hrs | $30,000 |
| Junior Developer | $40/hr | 200 hrs | $8,000 |
| **Total Development** | | | **$38,000** |

*Or: Solo developer at $60/hr for 400 hours = $24,000*

### **Infrastructure Cost (Monthly)**

| Service | Provider | Cost |
|---------|----------|------|
| Event Collection API | Railway | $10 |
| PostgreSQL (100GB) | Railway | $25 |
| Shopify Sync Service | Railway | $5 |
| Meta Ads | Meta | Variable |
| Domain/SSL | Cloudflare | $0 |
| Monitoring | Free tier | $0 |
| **Total Monthly** | | **$40** |

### **Annual Cost Projection**

- **Year 1:** $38,000 (dev) + $480 (infrastructure) = **$38,480**
- **Year 2+:** $480/year (infrastructure only)

**ROI Calculation:**
- If analytics improves conversion rate by 0.5%
- On $1M annual revenue
- Additional revenue: $5,000/year
- **Payback period: 8 years** (or instant if development is internal)

---

## FINAL CHECKLIST - LAUNCH DAY

### **Pre-Launch (24 hours before)**

- [ ] All services deployed to production
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Monitoring alerts active
- [ ] Backup systems verified
- [ ] Rollback plan documented
- [ ] Team briefed on launch plan

### **Launch (Go-live)**

- [ ] Enable analytics in React app (env var)
- [ ] Deploy React app to production
- [ ] Verify first events arriving
- [ ] Check all systems green
- [ ] Monitor for 1 hour
- [ ] Send test purchase
- [ ] Verify end-to-end flow

### **Post-Launch (24 hours after)**

- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify Shopify sync
- [ ] Test Meta Conversions API
- [ ] Query analytics with Claude
- [ ] Document any issues
- [ ] Create post-launch report

---

**🎉 PROJECT COMPLETE! 🎉**

You now have a comprehensive, production-ready analytics system for NaraWear that:
- Tracks all customer interactions
- Integrates with Shopify and Meta Ads
- Stores data in PostgreSQL
- Provides AI-powered insights via Claude

**Next Steps:**
1. Start with Phase 1, Day 1
2. Follow the to-do list sequentially
3. Check off items as you complete them
4. Adjust timeline based on your team size
5. Launch and optimize!

---

**Document Version:** 1.0  
**Last Updated:** February 8, 2026  
**Project Status:** Ready to Start  
**Estimated Completion:** 10 weeks from start date
