import React from "react";
import { FaCheckCircle, FaTruck, FaBox, FaHome } from "react-icons/fa";

const TrackingTimeline = ({ trackingData }) => {
  if (!trackingData || !trackingData.ShipmentData || trackingData.ShipmentData.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No tracking information available for this shipment yet.</p>
      </div>
    );
  }

  const shipment = trackingData.ShipmentData[0].Shipment;
  const scans = shipment.Scans || [];

  // Sort scans chronologically (oldest first)
  const sortedScans = [...scans].sort((a, b) => {
    return new Date(a.ScanDetail.ScanDateTime) - new Date(b.ScanDetail.ScanDateTime);
  });

  const ignoredKeywords = [
    "added to bag",
    "connected to",
    "vehicle",
    "origin center",
    "received at",
    "recieved at",
    "weight captured"
  ];

  const filteredScans = sortedScans.filter((scanItem) => {
    const text = (scanItem.ScanDetail.Instructions || scanItem.ScanDetail.Scan || "").toLowerCase();
    return !ignoredKeywords.some(keyword => text.includes(keyword));
  });

  const getFriendlyStatus = (status) => {
    if (!status) return "Status Update";
    const s = status.toLowerCase();
    
    if (s.includes("manifested")) return "Order Confirmed";
    if (s.includes("pickup scheduled")) return "Ready to Ship";
    if (s.includes("picked up")) return "Shipped";
    if (s.includes("out for delivery")) return "Out for Delivery";
    if (s.includes("delivered to consignee") || s.includes("delivered")) return "Delivered";
    if (s.includes("call placed to consignee")) return "Delivery Attempted (Call Placed)";
    
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getIconForStatus = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("delivered")) return <FaHome className="text-green-500" />;
    if (s.includes("out for delivery")) return <FaTruck className="text-blue-500" />;
    if (s.includes("picked") || s.includes("manifest")) return <FaBox className="text-gray-500" />;
    return <FaCheckCircle className="text-gray-400" />;
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 w-full max-w-3xl mx-auto mt-8">
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-antikor uppercase tracking-wide text-black">Shipment Status</h2>
          <p className="text-sm text-gray-500 mt-1">
            AWB: <span className="font-mono font-medium text-black">{shipment.AWB}</span>
          </p>
        </div>
        <div className="bg-[#F7F7F7] dark:bg-black px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800">
          <span className="text-sm font-bold uppercase text-[#1F4A40] dark:text-green-400">
            {shipment.Status?.Status || "Processing"}
          </span>
        </div>
      </div>

      <div className="relative pl-4 md:pl-8">
        {/* Vertical line connecting timeline items */}
        <div className="absolute left-[27px] md:left-[43px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-800"></div>

        <div className="flex flex-col gap-8">
          {filteredScans.map((scanItem, index) => {
            const scan = scanItem.ScanDetail;
            const isLast = index === filteredScans.length - 1;
            const date = scan.ScanDateTime ? new Date(scan.ScanDateTime) : new Date();

            return (
              <div key={index} className="relative flex items-start gap-4 md:gap-6 z-10">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                    {getIconForStatus(scan.Scan || scan.Instructions)}
                  </div>
                </div>

                <div className="flex flex-col flex-grow pt-1.5 pb-1">
                  <h3 className={`text-base font-semibold ${isLast ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {getFriendlyStatus(scan.Instructions || scan.Scan)}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {scan.ScanDateTime && (
                      <span>
                        {date.toLocaleDateString("en-US", {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {" at "}
                        {date.toLocaleTimeString("en-US", {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                    {scan.ScannedLocation && (
                      <>
                        <span className="hidden sm:inline">&bull;</span>
                        <span>{scan.ScannedLocation}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackingTimeline;
