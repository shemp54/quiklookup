import { Crown, Clock } from 'lucide-react';
import { getTimeUntilMidnight } from '../services/lookupTracker';
import { useState, useEffect } from 'react';

interface UpgradePromptProps {
  onUpgradeClick: () => void;
}

export const UpgradePrompt = ({ onUpgradeClick }: UpgradePromptProps) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilMidnight());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white text-center border border-blue-500">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 rounded-full p-4">
            <Crown className="w-12 h-12" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Daily Limit Reached</h2>
        <p className="text-blue-100 mb-6">
          You've used all 3 free lookups for today
        </p>

        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Resets in {timeRemaining}</span>
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          className="w-full py-4 px-6 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all shadow-lg"
        >
          Upgrade to Premium
        </button>

        <p className="text-xs text-blue-100 mt-4">
          Get unlimited lookups and advanced features
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="font-semibold text-white mb-4">Premium Features</h3>
        <ul className="space-y-3">
          <FeatureItem text="Unlimited daily lookups" />
          <FeatureItem text="Advanced carrier information" />
          <FeatureItem text="Spam risk detection" />
          <FeatureItem text="Lookup history & saved numbers" />
          <FeatureItem text="Priority support" />
        </ul>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  text: string;
}

const FeatureItem = ({ text }: FeatureItemProps) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 mt-0.5">
      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
      </div>
    </div>
    <span className="text-gray-300">{text}</span>
  </li>
);
