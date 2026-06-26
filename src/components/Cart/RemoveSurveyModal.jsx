import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const options = [
  "Not sure about my size/fit.",
  "Doubtful about the pricing",
  "Just changed my mind"
];

const RemoveSurveyModal = ({ isOpen, onClose, onConfirm, productTitle }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedOption("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    await onConfirm(selectedOption);
    setIsSubmitting(false);
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    await onConfirm(null); // Pass null reason for skipped surveys
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 m-auto w-[90%] max-w-md h-fit z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6"
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold font-antikor uppercase text-center dark:text-white">
                Before you go...
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                Could you tell us why you're removing <span className="font-semibold text-black dark:text-white">{productTitle}</span> from your cart?
              </p>

              <div className="flex flex-col gap-3">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left px-4 py-3 border rounded-lg transition-all ${
                      selectedOption === option
                        ? "border-[#1F4A40] bg-[#1F4A40]/10 dark:border-green-500 dark:bg-green-500/20 text-[#1F4A40] dark:text-green-400 font-bold"
                        : "border-gray-200 dark:border-gray-700 hover:border-[#1F4A40] hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-1/3 py-3 font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption || isSubmitting}
                  className={`w-2/3 py-3 rounded-lg font-bold uppercase transition-all ${
                    selectedOption && !isSubmitting
                      ? "bg-[#1F4A40] text-white hover:bg-[#2a6357]"
                      : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Removing..." : "Remove Item"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RemoveSurveyModal;
