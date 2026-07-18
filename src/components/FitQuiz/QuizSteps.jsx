import React from 'react';

const QuizSteps = ({ step, formData, updateFormData, nextStep, prevStep, submitQuiz, isLoading }) => {
  const handleRadioChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      updateFormData({ [field]: current.filter(item => item !== value) });
    } else {
      updateFormData({ [field]: [...current, value] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">What's your height?</h2>
            <div className="flex justify-center space-x-4">
              <input
                type="text"
                placeholder="e.g. 5'5 or 165cm"
                className="w-full max-w-sm px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                value={formData.height || ''}
                onChange={(e) => updateFormData({ height: e.target.value })}
              />
            </div>
            <div className="flex justify-center pt-4">
              <button
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                onClick={nextStep}
                disabled={!formData.height}
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">What size do you most commonly wear in tops?</h2>
            <div className="flex flex-col items-center space-y-3">
              {['XS', 'S', 'M', 'L', 'It really depends'].map((size) => (
                <button
                  key={size}
                  className={`w-full max-w-sm py-3 px-6 rounded-lg border-2 transition-colors ${
                    formData.topSize === size ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => {
                    handleRadioChange('topSize', size);
                    setTimeout(nextStep, 300);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">What size do you most commonly wear in bottoms?</h2>
            <div className="flex flex-col items-center space-y-3">
              {['XS', 'S', 'M', 'L', 'It really depends'].map((size) => (
                <button
                  key={size}
                  className={`w-full max-w-sm py-3 px-6 rounded-lg border-2 transition-colors ${
                    formData.bottomSize === size ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => {
                    handleRadioChange('bottomSize', size);
                    setTimeout(nextStep, 300);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
            </div>
          </div>
        );

      case 4:
        const bustOptions = [
          { label: 'Smaller', desc: 'Smaller: Less fullness in the bust area.', image: '/fit_quiz/bust/smaller.jpg' },
          { label: 'Average', desc: 'Average: Balanced fullness in the bust area.', image: '/fit_quiz/bust/average.jpg' },
          { label: 'Fuller', desc: 'Fuller: More fullness in the bust area.', image: '/fit_quiz/bust/fuller.jpg' }
        ];
        
        const waistOptions = [
          { label: 'Flatter', desc: 'Flatter: Flatter waist with less belly projection.', image: '/fit_quiz/waist_belly/flatter.jpg' },
          { label: 'Average', desc: 'Average: Moderate waist with slight curve.', image: '/fit_quiz/waist_belly/average.jpg' },
          { label: 'Fuller', desc: 'Fuller: More belly projection with a softer waist.', image: '/fit_quiz/waist_belly/fuller.jpg' }
        ];
        
        const hipOptions = [
          { label: 'Flatter', desc: 'Flatter: Straighter hip line with less curve.', image: '/fit_quiz/hip/flatter.jpg' },
          { label: 'Average', desc: 'Average: Moderate curve at the hips.', image: '/fit_quiz/hip/average.jpg' },
          { label: 'Rounder', desc: 'Rounder: Wider hips with more prominent curve.', image: '/fit_quiz/hip/rounder.jpg' }
        ];

        return (
          <div className="space-y-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Which of these look most like your Body Type?</h2>
            
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">My Bust Shape is</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                {bustOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`flex-1 max-w-[280px] rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      formData.bustShape === option.desc ? 'border-black dark:border-white ring-2 ring-black dark:ring-white shadow-xl scale-[1.02] dark:shadow-white/10' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02] hover:shadow-lg'
                    }`}
                    onClick={() => handleRadioChange('bustShape', option.desc)}
                  >
                    <img src={option.image} alt={option.label} className="w-full h-auto object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">My Waist / Belly Shape is</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                {waistOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`flex-1 max-w-[280px] rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      formData.waistShape === option.desc ? 'border-black dark:border-white ring-2 ring-black dark:ring-white shadow-xl scale-[1.02] dark:shadow-white/10' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02] hover:shadow-lg'
                    }`}
                    onClick={() => handleRadioChange('waistShape', option.desc)}
                  >
                    <img src={option.image} alt={option.label} className="w-full h-auto object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">My Hip Shape is</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                {hipOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`flex-1 max-w-[280px] rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                      formData.hipShape === option.desc ? 'border-black dark:border-white ring-2 ring-black dark:ring-white shadow-xl scale-[1.02] dark:shadow-white/10' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02] hover:shadow-lg'
                    }`}
                    onClick={() => handleRadioChange('hipShape', option.desc)}
                  >
                    <img src={option.image} alt={option.label} className="w-full h-auto object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between max-w-sm mx-auto pt-8">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
              <button
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                onClick={nextStep}
                disabled={!formData.bustShape || !formData.waistShape || !formData.hipShape}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 5:
        const fitOptions = [
          'Tops fit well, but bottoms feel tight',
          'Bottoms fit well, but tops feel tight',
          'Waist fits, but hips feel tight',
          'Hips fit, but waist feels loose',
          'I usually fit one standard size pretty well',
          'It completely depends on the outfit'
        ];
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">How do clothes usually fit you?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">Select all that apply</p>
            <div className="flex flex-col items-center space-y-3">
              {fitOptions.map((option) => (
                <button
                  key={option}
                  className={`w-full max-w-md py-3 px-6 rounded-lg border-2 text-left transition-colors ${
                    (formData.fitIssues || []).includes(option) ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => handleMultiSelect('fitIssues', option)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                      (formData.fitIssues || []).includes(option) ? 'border-white dark:border-black bg-black dark:bg-white' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {(formData.fitIssues || []).includes(option) && <span className="text-white dark:text-black text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between max-w-sm mx-auto pt-4">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
              <button
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                onClick={nextStep}
                disabled={!(formData.fitIssues && formData.fitIssues.length > 0)}
              >
                Next
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">How do you like your clothes to fit?</h2>
            <div className="flex justify-center gap-4">
              {['Fitted', 'Just right', 'Relaxed'].map((pref) => (
                <button
                  key={pref}
                  className={`flex-1 max-w-[150px] py-4 px-2 rounded-lg border-2 font-medium transition-colors ${
                    formData.fitPreference === pref ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onClick={() => {
                    handleRadioChange('fitPreference', pref);
                    setTimeout(nextStep, 300);
                  }}
                >
                  {pref}
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Do you know your body measurements?</h2>
            <div className="flex flex-col items-center space-y-4">
              <button
                className={`w-full max-w-sm py-3 px-6 rounded-lg border-2 transition-colors ${
                  formData.knowsMeasurements === true ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => handleRadioChange('knowsMeasurements', true)}
              >
                YES, I DO
              </button>
              
              {formData.knowsMeasurements && (
                <div className="w-full max-w-sm space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Bust</label>
                    <div className="flex items-center">
                      <input type="number" className="w-24 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-l focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" value={formData.bustInches || ''} onChange={e => handleRadioChange('bustInches', e.target.value)} />
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r text-gray-600 dark:text-gray-300">in</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Waist</label>
                    <div className="flex items-center">
                      <input type="number" className="w-24 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-l focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" value={formData.waistInches || ''} onChange={e => handleRadioChange('waistInches', e.target.value)} />
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r text-gray-600 dark:text-gray-300">in</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Hips</label>
                    <div className="flex items-center">
                      <input type="number" className="w-24 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-l focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white" value={formData.hipsInches || ''} onChange={e => handleRadioChange('hipsInches', e.target.value)} />
                      <span className="bg-gray-200 dark:bg-gray-700 px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r text-gray-600 dark:text-gray-300">in</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                className={`w-full max-w-sm py-3 px-6 rounded-lg border-2 transition-colors ${
                  formData.knowsMeasurements === false ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => handleRadioChange('knowsMeasurements', false)}
              >
                NOPE, FIND MY FIT
              </button>
            </div>
            
            <div className="flex justify-between max-w-sm mx-auto pt-4">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline" onClick={prevStep}>Back</button>
              <button
                className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                onClick={submitQuiz}
                disabled={isLoading || formData.knowsMeasurements === undefined || (formData.knowsMeasurements && (!formData.bustInches || !formData.waistInches || !formData.hipsInches))}
              >
                {isLoading ? 'Calculating...' : 'See Results'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-black dark:text-white transition-colors duration-300">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 font-medium px-1">
          <span>Step {step} of 7</span>
          <span>{Math.round((step / 7) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-black dark:bg-white h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="min-h-[400px] flex flex-col justify-center">
        {renderStep()}
      </div>
    </div>
  );
};

export default QuizSteps;
