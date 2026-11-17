import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheck, FaMapMarkerAlt, FaWhatsapp, FaBoxOpen, FaReceipt } from "react-icons/fa";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import FooterSection from "../components/home/FooterSectionUpdated";
import { LAST_ORDER_KEY } from "../utils/magicCheckout";

const SUPPORT_WHATSAPP = "919326472754";
const MAX_RETRIES = 6; // Shopify order creation can lag a few seconds behind the payment

const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const PAYMENT_LABELS = { upi: "UPI", card: "Card", netbanking: "Net Banking", wallet: "Wallet", emi: "EMI", cod: "Cash on Delivery", paylater: "Pay Later" };

const readSnapshot = (orderId) => {
  try {
    const snap = JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY) || "null");
    return snap && (!orderId || snap.razorpayOrderId === orderId) ? snap : null;
  } catch {
    return null;
  }
};

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");

  const snapshot = useMemo(() => readSnapshot(orderId), [orderId]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Order Confirmed | NARA";
  }, []);

  useEffect(() => {
    if (!orderId || !paymentId) {
      setLoading(false);
      setError("missing");
      return;
    }
    let cancelled = false;
    let timer;

    const load = async (attempt = 0) => {
      try {
        const res = await fetch(
          `/api/magic-checkout/order-summary?order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !data.success) throw new Error(data?.error || "lookup failed");
        setOrder(data);
        setError("");
        // Keep polling briefly until Razorpay has created the Shopify order
        if (!data.shopifyConfirmed && attempt < MAX_RETRIES) {
          timer = setTimeout(() => load(attempt + 1), 3000);
          return;
        }
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        if (attempt < 2) {
          timer = setTimeout(() => load(attempt + 1), 2000);
          return;
        }
        setError("lookup");
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, paymentId]);

  // Prefer the confirmed Shopify line items; fall back to what was in the cart at payment time
  const items = order?.items?.length ? order.items : snapshot?.items || [];
  const amountPaid = order?.amountPaid ?? snapshot?.amount;
  const firstName = (order?.customer?.name || "").trim().split(" ")[0];
  const pending = !loading && order && !order.shopifyConfirmed;
  const orderLabel = order?.orderNumber || null;
  const supportText = encodeURIComponent(
    `Hi NARA, I just placed an order${orderLabel ? ` ${orderLabel}` : ""} (payment ID ${paymentId || "-"}).`
  );

  if (error === "missing" && !snapshot) {
    return (
      <Shell>
        <div className="text-center py-16">
          <h1 className="text-2xl md:text-3xl font-extrabold font-antikor uppercase mb-3">No order to show</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We couldn't find an order reference in this link.</p>
          <Link to="/orders" className="inline-block bg-[#1E7B74] text-white px-6 py-3 rounded-xl font-semibold">
            View my orders
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#1E7B74] text-white flex items-center justify-center mb-5 shadow-lg">
          <FaCheck className="text-2xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-antikor uppercase mb-3">
          Thank you{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          {orderLabel ? (
            <>Your order <span className="font-semibold text-gray-900 dark:text-white">{orderLabel}</span> has been placed.</>
          ) : (
            <>Your payment was successful and your order has been placed.</>
          )}
        </p>
        {order?.customer?.email && (
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-2 break-all">
            Order updates will be sent to {order.customer.email}
          </p>
        )}
      </div>

      {loading && !order && (
        <p className="text-center text-sm text-gray-500 mb-6 animate-pulse">Fetching your order details…</p>
      )}

      {pending && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200">
          Your payment is received. We're still confirming the order in our system; this usually takes a minute. Please
          keep your payment ID <span className="font-mono">{paymentId}</span> handy. If you don't receive an
          update, message us on WhatsApp.
        </div>
      )}

      {error === "lookup" && (
        <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-gray-600 dark:text-gray-300">
          Your payment went through, but we couldn't load all the order details right now. Payment ID:{" "}
          <span className="font-mono">{paymentId}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Items */}
        <section className="lg:col-span-7 bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
          <h2 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-4">
            <FaBoxOpen className="text-[#1E7B74]" /> Items ordered
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">{loading ? "Loading…" : "Item details unavailable."}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item, i) => (
                <li key={`${item.title}-${i}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base leading-snug">{item.title}</p>
                    {item.variantTitle && <p className="text-xs text-gray-500 mt-1">Size / Variant: {item.variantTitle}</p>}
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm whitespace-nowrap">
                    {formatINR(item.total ?? (item.unitPrice || 0) * (item.quantity || 1))}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {/* Price summary */}
          {order && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              {order.discount > 0 && (
                <Row
                  label={`Discount${order.promotions?.length ? ` (${order.promotions.map((p) => p.code).filter(Boolean).join(", ")})` : ""}`}
                  value={`− ${formatINR(order.discount)}`}
                  accent
                />
              )}
              <Row label="Shipping" value={order.shippingFee > 0 ? formatINR(order.shippingFee) : "FREE"} />
              {order.codFee > 0 && <Row label="COD fee" value={formatINR(order.codFee)} />}
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 font-bold text-base">
                <span>Amount paid</span>
                <span>{formatINR(amountPaid)}</span>
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
            </div>
          )}
          {!order && amountPaid != null && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold">
              <span>Amount paid</span>
              <span>{formatINR(amountPaid)}</span>
            </div>
          )}
        </section>

        <div className="lg:col-span-5 space-y-6">
          {/* Order details */}
          <section className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-4">
              <FaReceipt className="text-[#1E7B74]" /> Order details
            </h2>
            <div className="space-y-2 text-sm">
              {orderLabel && <Row label="Order number" value={orderLabel} />}
              <Row label="Placed on" value={formatDate(order?.placedAt || snapshot?.placedAt)} />
              {order?.paymentMethod && (
                <Row label="Payment" value={PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod} />
              )}
              <Row label="Payment ID" value={<span className="font-mono text-xs">{paymentId}</span>} />
              {order?.customer?.contact && <Row label="Phone" value={order.customer.contact} />}
            </div>
          </section>

          {/* Delivery address */}
          {order?.shippingAddress && (
            <section className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 md:p-6">
              <h2 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider mb-4">
                <FaMapMarkerAlt className="text-[#1E7B74]" /> Delivering to
              </h2>
              <address className="not-italic text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {order.shippingAddress.name && <span className="font-semibold block">{order.shippingAddress.name}</span>}
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                <br />
                {[order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(", ")}
                {order.shippingAddress.zipcode && ` - ${order.shippingAddress.zipcode}`}
                <br />
                {order.shippingAddress.country}
              </address>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/products"
              className="text-center bg-[#1E7B74] hover:bg-[#17625c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Continue shopping
            </Link>
            <Link
              to="/track"
              className="text-center border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Track your order
            </Link>
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${supportText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#1E7B74] py-2"
            >
              <FaWhatsapp className="text-lg text-[#25D366]" /> Questions about your order? Chat with us
            </a>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="bg-[#FAF9F5] dark:bg-black text-[#1a1a1a] dark:text-[#f3f3f3] min-h-screen flex flex-col font-sans">
      <NavbarRelative />
      <main className="flex-grow max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-16 w-full">{children}</main>
      <FooterSection />
    </div>
  );
}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`text-right font-medium ${accent ? "text-[#1E7B74]" : ""}`}>{value}</span>
    </div>
  );
}
