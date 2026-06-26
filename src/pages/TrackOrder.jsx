import React, { useState } from "react";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import FooterSection from "../components/home/FooterSectionUpdated";
import TrackingTimeline from "../components/Tracking/TrackingTimeline";
import { toast } from "sonner";
import { FaSearch } from "react-icons/fa";
import Spinner from "../components/utils/Spinner";
import { useSearchParams } from "react-router-dom";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialRefId = searchParams.get("ref_id");
  const initialWaybill = searchParams.get("waybill");

  const [trackingId, setTrackingId] = useState(initialRefId || initialWaybill || "");
  const [inputType, setInputType] = useState(initialRefId ? "ref_id" : "waybill"); // "waybill" or "ref_id"
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  const fetchTrackingData = async (id, type) => {
    setIsLoading(true);
    setTrackingData(null);

    try {
      const url = `http://localhost:3001/api/tracking?${type}=${encodeURIComponent(id)}`;
      const apiUrl = process.env.NODE_ENV === "production" ? `/api/tracking?${type}=${encodeURIComponent(id)}` : url;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tracking information.");
      }

      if (data.Error) {
        throw new Error(data.Error);
      }

      setTrackingData(data);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Tracking failed. Please check your ID and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialRefId) {
      fetchTrackingData(initialRefId, "ref_id");
    } else if (initialWaybill) {
      fetchTrackingData(initialWaybill, "waybill");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID or Order ID.");
      return;
    }
    fetchTrackingData(trackingId.trim(), inputType);
  };

  return (
    <div className="flex flex-col min-h-screen font-antikor bg-[#F7F7F7] dark:bg-black dark:text-white">
      <NavbarRelative />
      
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black uppercase mb-4">Track Your Order</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your tracking number (AWB) or Order ID below to get real-time updates on your package.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <form onSubmit={handleTrack} className="flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="inputType" 
                    value="waybill"
                    checked={inputType === "waybill"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="w-4 h-4 text-[#1F4A40]"
                  />
                  <span>Tracking ID (AWB)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="inputType" 
                    value="ref_id"
                    checked={inputType === "ref_id"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="w-4 h-4 text-[#1F4A40]"
                  />
                  <span>Order ID</span>
                </label>
              </div>

              <div className="relative flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={inputType === "waybill" ? "e.g., 123456789012" : "e.g., ORDER_123"}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F4A40] dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#1F4A40] hover:bg-[#2a6357] text-white px-8 py-3 rounded-lg font-bold uppercase transition-colors disabled:opacity-70 whitespace-nowrap min-w-[140px] flex items-center justify-center"
                >
                  {isLoading ? <Spinner width="24px" height="24px" /> : "Track"}
                </button>
              </div>
            </form>
          </div>

          {trackingData && (
            <div className="mt-8">
              <TrackingTimeline trackingData={trackingData} />
            </div>
          )}
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
