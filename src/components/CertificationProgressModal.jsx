import React from 'react';
import { Loader2 } from 'lucide-react';

const CertificationProgressModal = ({ isOpen, steps, currentStep, error }) => {
  if (!isOpen) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;
  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className={`p-8 rounded-t-3xl transition-all duration-300 ${
          error ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
        }`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
            {error ? (
              <>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Certification Failed
              </>
            ) : (
              <>
                <Loader2 className="animate-spin" size={28} />
                Certification in Progress
              </>
            )}
          </h2>
          {error ? (
            <p className="text-red-100 text-sm">{error}</p>
          ) : (
            <p className="text-blue-100 text-sm">
              {activeStep?.info || 'Processing your certification request...'}
            </p>
          )}
        </div>

        {/* Progress Content */}
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-500 ease-out ${
                  error ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-gray-900 font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Current Step Info */}
          {!error && activeStep && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="text-blue-900 font-bold text-lg mb-1">
                {activeStep.title}
              </h3>
              <p className="text-blue-700 text-sm">
                {activeStep.description}
              </p>
            </div>
          )}

          {/* Error Action Button */}
          {error && (
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold
                         transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Close and Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationProgressModal;
