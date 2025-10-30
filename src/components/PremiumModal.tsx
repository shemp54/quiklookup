import { useState } from 'react';
import { X, CheckCircle2, Mail, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'upgrade' | 'email-capture' | 'success';

export const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  const [viewState, setViewState] = useState<ViewState>('upgrade');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGetEarlyAccess = () => {
    setViewState('email-capture');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    const existingEmails = JSON.parse(localStorage.getItem('premiumWaitlist') || '[]');
    existingEmails.push({
      email,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('premiumWaitlist', JSON.stringify(existingEmails));

    setViewState('success');
    setEmail('');
    setError('');
  };

  const handleClose = () => {
    setViewState('upgrade');
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {viewState === 'upgrade' && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Daily Limit Reached
            </h2>

            <p className="text-gray-400 text-center mb-8">
              You've used your 3 free lookups today. Upgrade to Premium for unlimited lookups, caller name identification, and spam detection.
            </p>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
                Premium Features
              </h3>
              <ul className="space-y-3">
                <FeatureItem text="Unlimited daily lookups" />
                <FeatureItem text="Caller name identification" />
                <FeatureItem text="Spam score detection" />
                <FeatureItem text="Lookup history" />
              </ul>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-baseline">
                <span className="text-4xl font-bold text-white">$2.99</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
            </div>

            <button
              onClick={handleGetEarlyAccess}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg shadow-blue-600/30 text-lg"
            >
              Get Early Access
            </button>
          </div>
        )}

        {viewState === 'email-capture' && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500/20 rounded-full p-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Premium Launching Soon!
            </h2>

            <p className="text-gray-400 text-center mb-8">
              Enter your email to get notified and receive a special launch discount.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    error
                      ? 'border-red-500/50 bg-red-950/20 text-white placeholder:text-gray-500'
                      : 'border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500'
                  }`}
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm font-medium px-1 mt-2">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all shadow-lg shadow-blue-600/30 text-lg"
              >
                Notify Me
              </button>

              <button
                type="button"
                onClick={() => setViewState('upgrade')}
                className="w-full py-3 px-6 text-gray-400 font-medium rounded-xl hover:text-white hover:bg-gray-800 transition-all"
              >
                Back
              </button>
            </form>
          </div>
        )}

        {viewState === 'success' && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 rounded-full p-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3">
              Thanks!
            </h2>

            <p className="text-gray-400 text-center mb-8">
              We'll email you when Premium launches with your exclusive discount.
            </p>

            <button
              onClick={handleClose}
              className="w-full py-4 px-6 bg-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all border border-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface FeatureItemProps {
  text: string;
}

const FeatureItem = ({ text }: FeatureItemProps) => (
  <li className="flex items-center space-x-3">
    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
    <span className="text-gray-300">{text}</span>
  </li>
);
