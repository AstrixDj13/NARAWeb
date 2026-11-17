import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart, FaWhatsapp } from "react-icons/fa";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import FooterSection from "../components/home/FooterSectionUpdated";
import ActionButtons from "../components/productsDetail/ActionButtons";
import SizeChart from "../components/productsDetail/SizeChart";
import ReviewSection from "../components/productsDetail/ReviewSection";
import GalleryV2 from "../components/productV2/GalleryV2";
import { getProductById, getProductByHandle } from "../apis/Products";
import { fetchCollectionProducts } from "../apis/getAllProducts";
import { useEventTracker, useProductScrollTracker } from "../hooks/EventTracker";
import { useWishlist } from "../context/WishlistContext";
import { setCurrentVariant, setOutOfStock, setSizeConfirmed, setSizeRequired } from "../store";

const formatINR = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const htmlToText = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.innerText || div.textContent || "").replace(/ /g, " ").trim();
};
const isInStock = (edge) => parseInt(edge?.node?.quantityAvailable, 10) > 0;
const optionsOf = (edge) => Object.fromEntries((edge?.node?.selectedOptions || []).map((o) => [o.name, o.value]));

// Shopify "worth" metafield, e.g. "Why is this worth ₹1499" followed by one point per line
// (older ones use "Rs.2699" and "- " bullets). Returns the price for the heading and the points.
const parseWorth = (text = "") => {
  const m = text.match(/^\s*why[^\n]*?(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*\??/i);
  const rest = m ? text.slice(m[0].length) : text;
  let points = rest.split(/\r?\n/).map((l) => l.replace(/^\s*[-•*–]\s*/, "").trim()).filter(Boolean);
  // Everything on one line: fall back to sentences
  if (points.length === 1) points = points[0].split(/(?<=\.)\s+(?=[A-Z])/).map((l) => l.trim()).filter(Boolean);
  return { price: m ? m[1].replace(/,/g, "") : null, points };
};
const SKIP_OPTIONS = new Set(["model", "Title"]);

/**
 * New product page (editorial layout).
 * Reuses the existing cart / Magic Checkout buttons (ActionButtons), size guide, reviews and tracking.
 * Default product page (the previous page is still reachable at ?v=1).
 */
export default function ProductPageV2() {
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracker();
  const { wishlist, toggleWishlist } = useWishlist();

  const currentVariant = useSelector((s) => s.activeProduct.currentVariant);
  const outOfStock = useSelector((s) => s.activeProduct.outOfStock);
  const sizeConfirmed = useSelector((s) => s.activeProduct.sizeConfirmed);
  const sizePromptAt = useSelector((s) => s.activeProduct.sizePromptAt);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [moreFromEdit, setMoreFromEdit] = useState([]);
  const [openPanel, setOpenPanel] = useState("description");
  const [sizeError, setSizeError] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pinResult, setPinResult] = useState(null);

  // ---------- load product ----------
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const load = params.handle ? getProductByHandle(params.handle) : getProductById(params.id);
    load
      .then((p) => !cancelled && setProduct(p))
      .catch((e) => console.error("Product load failed:", e))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [params.handle, params.id]);

  const variants = product?.variants?.edges || [];
  const inStockVariants = useMemo(() => variants.filter(isInStock), [product]);
  const options = useMemo(
    () => (product?.options || []).filter((o) => !SKIP_OPTIONS.has(o.name) && o.values?.length),
    [product]
  );
  const sizeOption = options.find((o) => o.name === "Size");

  // ---------- initial variant: first in stock, but no size pre-selected ----------
  useEffect(() => {
    if (!product) return;
    const first = inStockVariants[0] || variants[0];
    dispatch(setOutOfStock(inStockVariants.length === 0));
    dispatch(setCurrentVariant(first || null));
    const needsSize = !!sizeOption && sizeOption.values.length > 1;
    dispatch(setSizeRequired(needsSize));
    dispatch(setSizeConfirmed(!needsSize));
    setSelected(first ? optionsOf(first) : {});
  }, [product]);

  // ---------- same-collection products ----------
  useEffect(() => {
    if (!product?.concernedCollectionId) return;
    fetchCollectionProducts(product.concernedCollectionId, 12)
      .then((list) => setMoreFromEdit(list.filter((p) => p.id !== product.id).slice(0, 8)))
      .catch(() => setMoreFromEdit([]));
  }, [product?.id]);

  // ---------- tracking (same events as the current page) ----------
  useEffect(() => {
    if (!product?.id) return;
    const firstVariant = variants[0]?.node;
    const price = parseFloat(firstVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount || 0);
    trackEvent("ViewContent", {
      product_id: product.id,
      content_ids: [product.id],
      variant_id: firstVariant?.id,
      product_name: product.title,
      value: price,
      price,
      currency: "INR",
      collection: product.concernedCollectionId,
      in_stock: inStockVariants.length > 0,
      page_version: "v2",
    });
  }, [product?.id]);
  useProductScrollTracker(product?.id ? product : null);

  // Size prompt from ActionButtons (tapped Add to Bag / Buy Now without a size)
  useEffect(() => {
    if (!sizePromptAt || sizeConfirmed) return;
    setSizeError(true);
    const t = setTimeout(() => setSizeError(false), 2500);
    return () => clearTimeout(t);
  }, [sizePromptAt, sizeConfirmed]);
  useEffect(() => { if (sizeConfirmed) setSizeError(false); }, [sizeConfirmed]);

  // ---------- option selection ----------
  const isValueAvailable = (name, value) => {
    if (name === "Size") {
      return inStockVariants.some((v) => {
        const o = optionsOf(v);
        return o.Size === value && Object.entries(selected).every(([k, x]) => k === "Size" || SKIP_OPTIONS.has(k) || o[k] === x);
      });
    }
    return inStockVariants.some((v) => optionsOf(v)[name] === value);
  };

  const choose = (name, value) => {
    const wanted = { ...selected, [name]: value };
    let match = inStockVariants.find((v) => {
      const o = optionsOf(v);
      return Object.entries(wanted).every(([k, x]) => SKIP_OPTIONS.has(k) || o[k] === x);
    });
    // e.g. picked a colour whose current size is sold out: keep the colour, move to any in-stock size
    if (!match) match = inStockVariants.find((v) => optionsOf(v)[name] === value);
    if (!match) return;
    setSelected(optionsOf(match));
    dispatch(setCurrentVariant(match));
    if (name === "Size") dispatch(setSizeConfirmed(true));
    else if (sizeOption && optionsOf(match).Size !== selected.Size) dispatch(setSizeConfirmed(false));
  };

  // ---------- derived content ----------
  const images = useMemo(() => (product?.images?.edges || []).map((e) => e.node.src), [product]);
  const variantImageIndex = useMemo(() => {
    const src = currentVariant?.node?.image?.src;
    return src ? images.indexOf(src) : -1;
  }, [currentVariant, images]);

  const plainDescription = useMemo(() => htmlToText(product?.descriptionHtml), [product]);
  const pitch = useMemo(() => {
    const firstLine = plainDescription.split(/\n+/).map((l) => l.trim()).find(Boolean) || "";
    const sentence = firstLine.match(/^.*?[.!?](\s|$)/)?.[0] || firstLine;
    return sentence.length > 160 ? sentence.slice(0, 157).trim() + "…" : sentence.trim();
  }, [plainDescription]);
  const modelLine = useMemo(() => plainDescription.match(/[A-Z][a-z]+ is wearing[^\n]*/)?.[0]?.trim() || "", [plainDescription]);
  const editName = useMemo(() => {
    const col = product?.collections?.edges?.find((e) => e.node.id === product?.concernedCollectionId)?.node?.title;
    return col && !/all|sale|bestseller|gst|ugc/i.test(col) ? col : "";
  }, [product]);

  const price = parseFloat(currentVariant?.node?.price?.amount || product?.priceRange?.minVariantPrice?.amount || 0);
  const isWishlisted = product?.id ? wishlist.includes(product.id) : false;

  const checkPincode = async () => {
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setPinResult({ ok: false, msg: "Enter a valid 6-digit pincode" });
      return;
    }
    setPinResult({ loading: true });
    try {
      const res = await fetch(`/api/delhivery/pincode?pincode=${pincode}`);
      const data = await res.json();
      if (data.success && data.is_serviceable) {
        const d = new Date();
        d.setDate(d.getDate() + (data.expected_delivery || 4));
        setPinResult({ ok: true, msg: `Delivers to ${data.city || "your area"} by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}` });
      } else {
        setPinResult({ ok: false, msg: "Sorry, we don't deliver to this pincode yet" });
      }
    } catch {
      setPinResult({ ok: false, msg: "Couldn't check right now. Please try again." });
    }
  };

  // ---------- render ----------
  if (loading || !product) {
    return (
      <div className="bg-white dark:bg-black min-h-screen">
        <NavbarRelative />
      {/* The navbar is fixed; push content below it */}
      <div className="h-[62px] md:h-[91px] xl:h-[107px]" aria-hidden="true" />
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 max-w-[1400px] mx-auto">
          <div className="lg:col-span-7 aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          <div className="lg:col-span-5 p-4 space-y-3">
            <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
            <div className="h-6 w-3/4 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
            <div className="h-5 w-1/3 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const Panel = ({ id, title, children }) => (
    <div className="border-b border-black/10 dark:border-white/15">
      <button
        type="button"
        onClick={() => setOpenPanel(openPanel === id ? null : id)}
        className="w-full flex items-center justify-between py-4 text-xs font-semibold uppercase tracking-[0.18em]"
        aria-expanded={openPanel === id}
      >
        {title}
        <span className="text-lg leading-none font-light">{openPanel === id ? "−" : "+"}</span>
      </button>
      {openPanel === id && <div className="pb-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-outfit">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white">
      <Helmet>
        <title>{`${product.title} | NaraWear`}</title>
        <meta name="description" content={product.description || pitch || "Shop premium women's fashion from NaraWear."} />
        <meta property="og:title" content={`${product.title} | NaraWear`} />
        <meta property="og:image" content={images[0] || "https://narawear.com/NaraLogo.png"} />
        <meta property="og:url" content={`https://narawear.com${location.pathname}`} />
        {/* The preview version must not be indexed separately from the live page */}
        <link rel="canonical" href={`https://narawear.com${location.pathname}`} />
      </Helmet>

      <NavbarRelative />
      {/* The navbar is fixed; push content below it */}
      <div className="h-[62px] md:h-[91px] xl:h-[107px]" aria-hidden="true" />

      <div className="lg:grid lg:grid-cols-12 lg:gap-10 max-w-[1400px] mx-auto lg:px-6 lg:pt-4">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <GalleryV2 images={images} title={product.title} activeIndex={variantImageIndex} />
        </div>

        {/* Info panel (sticky beside the photos on desktop) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[115px] xl:top-[131px] px-4 lg:px-0 pt-5 lg:pt-2 pb-8 flex flex-col">
            {editName && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-2">{editName}</p>
            )}

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-lg lg:text-2xl font-semibold uppercase tracking-[0.06em] leading-snug">{product.title}</h1>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="shrink-0 mt-0.5 p-1"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? <FaHeart className="text-red-500" size={20} /> : <FaRegHeart size={20} />}
              </button>
            </div>

            <div className="mt-2 flex items-baseline gap-3 font-outfit">
              {outOfStock ? (
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-red-600">Sold out</span>
              ) : (
                <>
                  <span className="text-lg font-semibold">{formatINR(price)}</span>
                  {/* Strike-through price kept as on the current page (price + ₹200) */}
                  <span className="text-sm text-neutral-500 line-through">{formatINR(price + 200)}</span>
                </>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 mt-1">Inclusive of all taxes</p>

            {/* Options */}
            {options.map((opt) =>
              opt.name === "Size" ? (
                <div
                  key="Size"
                  id="size-selector"
                  className={`mt-6 scroll-mt-40 transition-all ${sizeError ? "outline outline-2 outline-red-500 outline-offset-8" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Size{sizeConfirmed && selected.Size ? <span className="font-normal normal-case tracking-normal">: {selected.Size}</span> : ""}
                    </p>
                    <SizeChart productId={product.id} product={product} />
                  </div>
                  {sizeError && <p className="text-xs text-red-600 font-semibold mb-2">Please select a size</p>}
                  <div
                    className="grid border-l border-t border-black/80 dark:border-white/60"
                    style={{ gridTemplateColumns: `repeat(${Math.min(opt.values.length, 5)}, minmax(0, 1fr))` }}
                  >
                    {opt.values.map((v) => {
                      const available = isValueAvailable("Size", v);
                      const active = sizeConfirmed && selected.Size === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          disabled={!available}
                          onClick={() => choose("Size", v)}
                          className={`h-12 border-r border-b border-black/80 dark:border-white/60 text-sm font-outfit transition-colors ${
                            active ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          } disabled:text-neutral-300 disabled:line-through disabled:cursor-not-allowed`}
                          aria-pressed={active}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                  <Link to="/fit-quiz" className="inline-block mt-2 text-[11px] underline underline-offset-4 text-neutral-600 dark:text-neutral-400 font-outfit">
                    Not sure of your size? Take the 30-second fit quiz
                  </Link>
                </div>
              ) : (
                <div key={opt.name} className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                    {opt.name}: <span className="font-normal normal-case tracking-normal">{selected[opt.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((v) => {
                      const swatch = product.colorsArray?.find((c) => c.name === v);
                      const available = isValueAvailable(opt.name, v);
                      const active = selected[opt.name] === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          disabled={!available}
                          onClick={() => choose(opt.name, v)}
                          title={v}
                          className={`h-10 min-w-10 px-3 border text-xs font-outfit flex items-center gap-2 ${
                            active ? "border-black dark:border-white" : "border-black/20 dark:border-white/30"
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                          aria-pressed={active}
                        >
                          {swatch?.value && <span className="w-4 h-4 rounded-full border border-black/10" style={{ background: swatch.value }} />}
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {modelLine && <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400 font-outfit">{modelLine}</p>}

            {/* Add to Bag / Buy Now: inline on desktop, fixed bar on phones */}
            <div className="mt-6">
              <ActionButtons productId={product.id} productTitle={product.title} editorial />
            </div>

            {pitch && <p className="mt-6 text-sm leading-relaxed font-outfit text-neutral-800 dark:text-neutral-200">{pitch}</p>}

            {/* Delivery check */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2">Check delivery</p>
              <div className="flex border border-black/20 dark:border-white/30">
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPinResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && checkPincode()}
                  placeholder="Enter pincode"
                  className="flex-1 px-3 h-11 bg-transparent outline-none text-sm font-outfit"
                  aria-label="Pincode"
                />
                <button type="button" onClick={checkPincode} className="px-4 text-xs font-semibold uppercase tracking-[0.18em]">
                  {pinResult?.loading ? "…" : "Check"}
                </button>
              </div>
              {pinResult?.msg && (
                <p className={`mt-2 text-xs font-outfit ${pinResult.ok ? "text-[#1E7B74]" : "text-red-600"}`}>{pinResult.msg}</p>
              )}
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-outfit">
                Free shipping · Dispatched in 24–48 hrs · Easy 10-day exchange
              </p>
            </div>

            {/* Details */}
            <div className="mt-6 border-t border-black/10 dark:border-white/15">
              <Panel id="description" title="Description">
                <div className="[&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </Panel>
              {product.worth && (
                (() => {
                  const w = parseWorth(product.worth);
                  return (
                    <Panel id="worth" title={w.price ? `Why it's worth ${formatINR(w.price)}` : "Why it's worth it"}>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {w.points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </Panel>
                  );
                })()
              )}
              <Panel id="shipping" title="Shipping & exchange">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Free shipping across India</li>
                  <li>Orders are dispatched within 24–48 hours and usually arrive in 4–5 business days</li>
                  <li>Exchange for a different size or a product of equal value within 10 days of delivery</li>
                  <li>Returns within 10 days carry a ₹99 reverse-pickup fee</li>
                  <li>Returns and Refunds are not applicable on offer products</li>
                  <li>Items must be unused, unwashed and have all tags attached</li>
                </ul>
                <Link to="/return_policies" className="inline-block mt-3 underline">Read the full policy</Link>
              </Panel>
              <a
                href={`https://wa.me/919326472754?text=${encodeURIComponent(`Hi NARA, I have a question about ${product.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-[0.18em]"
              >
                <FaWhatsapp className="text-base text-[#25D366]" /> Ask a stylist on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* More from this edit */}
      {moreFromEdit.length > 0 && (
        <section className="mt-10 lg:mt-16 max-w-[1400px] mx-auto">
          <h2 className="px-4 lg:px-6 text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {editName ? `More from ${editName}` : "You may also like"}
          </h2>
          <div className="flex gap-3 overflow-x-auto px-4 lg:px-6 scroll-px-4 lg:scroll-px-6 pb-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {moreFromEdit.map((p) => (
              <div key={p.id} className="snap-start shrink-0 w-[62%] sm:w-[40%] lg:w-[23%]">
                <Link to={`/products/${p.handle}`} className="block group">
                  <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    {p.images?.nodes?.[0]?.url && (
                      <img
                        src={`${p.images.nodes[0].url}${p.images.nodes[0].url.includes("?") ? "&" : "?"}width=600`}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] leading-snug line-clamp-1">{p.title}</p>
                  <p className="text-xs font-outfit text-neutral-600 dark:text-neutral-400">
                    {p.isOutOfStock ? "Sold out" : formatINR(p.variants?.nodes?.[0]?.price?.amount)}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews: only when this product has some */}
      <div id="reviews" className="max-w-[1400px] mx-auto">
        <ReviewSection productId={product.id} hideWhenEmpty />
      </div>

      <div className="mt-12">
        <FooterSection />
      </div>
      {/* Room for the fixed mobile buy bar */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}
