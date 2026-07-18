import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/NavbarUpdated';
import FooterSectionUpdated from '../components/home/FooterSectionUpdated';
import QuizSteps from '../components/FitQuiz/QuizSteps';
import { fetchProductsBySize } from '../apis/getAllProducts';
import ProductCard from '../components/common/ProductCard';

const FitQuiz = () => {
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('fitQuiz_step');
    return saved ? JSON.parse(saved) : 1;
  });
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('fitQuiz_formData');
    return saved ? JSON.parse(saved) : {};
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(() => {
    const saved = sessionStorage.getItem('fitQuiz_result');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState(() => {
    const saved = sessionStorage.getItem('fitQuiz_recommendedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('fitQuiz_step', JSON.stringify(step));
    sessionStorage.setItem('fitQuiz_formData', JSON.stringify(formData));
    sessionStorage.setItem('fitQuiz_result', JSON.stringify(result));
    sessionStorage.setItem('fitQuiz_recommendedProducts', JSON.stringify(recommendedProducts));
  }, [step, formData, result, recommendedProducts]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const submitQuiz = async () => {
    setIsLoading(true);
    setError(null);

    // Actual NARA size chart context derived from SizeChart.jsx
    const sizeChartContext = `
      NARA Size Chart Context (Measurements in inches):

      WOMEN'S TOPS:
      - XS: Chest 34", Waist 28", Hip 38"
      - S: Chest 36", Waist 30", Hip 40"
      - M: Chest 38", Waist 32", Hip 42"
      - L: Chest 40", Waist 34", Hip 44"

      WOMEN'S BOTTOMS:
      - XS: Waist 26", Hip 36", Thigh 24", Side 42"
      - S: Waist 28", Hip 38", Thigh 25", Side 42"
      - M: Waist 30", Hip 40", Thigh 26", Side 42.5"
      - L: Waist 32", Hip 42", Thigh 27", Side 42.5"

      MEN'S TOPS:
      - S: Chest 39.5", Length 27", Shoulder 17", Sleeve 25"
      - M: Chest 41.75", Length 28", Shoulder 18", Sleeve 25.5"
      - L: Chest 45", Length 29", Shoulder 19", Sleeve 26"
      - XL: Chest 47.5", Length 30", Shoulder 20", Sleeve 26.88"
      - XXL: Chest 50.5", Length 30.63", Shoulder 21.5", Sleeve 27.13"
    `;

    const promptMessage = `
      You are an expert fashion stylist and tailor for NARA. 
      Analyze the following user fit quiz answers and size chart to determine their ideal size.
      
      Size Chart:
      ${sizeChartContext}

      User's Quiz Answers:
      ${JSON.stringify(formData, null, 2)}
      
      Instructions:
      1. Determine the best primary size.
      2. Determine the best size if they want a relaxed fit.
      3. Determine the best size if they want a fitted look.
      4. Write a short, friendly, personalized reasoning message explaining your choice based on their specific answers (e.g., mentioning their hip shape or top vs bottom size difference).
      5. Output ONLY valid JSON, absolutely no markdown formatting, backticks, or extra text.

      Required JSON Format:
      {
        "primary_size": "M",
        "fitted_size": "S",
        "relaxed_size": "M",
        "is_between_sizes": true,
        "reasoning_message": "String explaining the choice"
      }
    `;

    try {
      const response = await fetch('/api/anthropic/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptMessage }],
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      
      // Parse the JSON from Anthropic's response
      let parsedResult;
      try {
        const textResponse = data.content[0].text;
        // Strip out any markdown blocks if the AI ignored instructions
        const cleanJson = textResponse.replace(/```json\n?|\n?```/g, '').trim();
        parsedResult = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('Failed to parse AI response:', data.content[0].text);
        throw new Error('Failed to parse the recommendation');
      }

      setResult(parsedResult);
      setStep(8); // Move to result screen
      
      // Fetch products that match the recommended size
      setIsProductsLoading(true);
      try {
        const products = await fetchProductsBySize(parsedResult.primary_size);
        setRecommendedProducts(products);
      } catch (prodErr) {
        console.error("Failed to fetch recommended products", prodErr);
      } finally {
        setIsProductsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, we had trouble calculating your fit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-8">
        <h2 className="text-3xl font-bold">Your NARA fit: {result.primary_size} ✨</h2>
        
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {result.reasoning_message}
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4 max-w-md mx-auto text-left border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-center mb-4">Fit Preferences</h3>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">For a more relaxed fit:</span>
            <span className="font-bold">Try {result.relaxed_size}</span>
          </div>
          <div className="flex justify-between items-center pb-2">
            <span className="text-gray-600 dark:text-gray-400">For a more fitted look:</span>
            <span className="font-bold">Stick with {result.fitted_size}</span>
          </div>
          {result.is_between_sizes && (
            <div className="mt-4 p-3 bg-[#fdf8f4] dark:bg-[#332211] text-[#d68a59] dark:text-[#f3b58e] rounded-lg text-sm text-center font-medium">
              You are between sizes {result.fitted_size} & {result.relaxed_size}.
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => {
              setStep(1);
              setResult(null);
              setFormData({});
              setRecommendedProducts([]);
            }}
          >
            Retake Quiz
          </button>
          <button 
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/products')}
          >
            Shop Collection
          </button>
        </div>

        {/* Recommended Products Section */}
        <div className="pt-12 mt-12 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold mb-8 text-center font-antikor">Styles Available in Size {result.primary_size}</h3>
          
          {isProductsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-left">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} className="w-full sm:w-full lg:w-full" forceFullHeight={true} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-8">We couldn't find any products in this size at the moment, but check back soon!</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] dark:bg-black text-black dark:text-white font-antikor">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 flex items-center justify-center pt-32">
        <div className="w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase dark:!text-white">The NARA Fit Quiz</h1>
            <p className="text-gray-500 dark:!text-gray-300 mt-4 max-w-lg mx-auto">
              Find your perfect size in minutes based on your unique body shape and fit preferences.
            </p>
          </div>

          {error && (
            <div className="w-full max-w-4xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          {step < 8 ? (
            <QuizSteps
              step={step}
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              submitQuiz={submitQuiz}
              isLoading={isLoading}
            />
          ) : (
            renderResult()
          )}
        </div>
      </main>

      <FooterSectionUpdated />
    </div>
  );
};

export default FitQuiz;
