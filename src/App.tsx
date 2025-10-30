import { useState } from 'react';
import { Search, AlertCircle, Crown } from 'lucide-react';
import { PhoneInput } from './components/PhoneInput';
import { LookupResults } from './components/LookupResults';
import { UpgradePrompt } from './components/UpgradePrompt';
import { PremiumModal } from './components/PremiumModal';
import { lookupPhoneNumber, LookupResult } from './services/numverifyApi';
import { canPerformLookup, incrementLookupCount, getRemainingLookups } from './services/lookupTracker';
import { cleanPhoneNumber } from './utils/phoneFormatter';

type ViewState = 'input' | 'results' | 'limit-reached';

function App() {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingLookups, setRemainingLookups] = useState(getRemainingLookups());
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleLookup = async (phoneNumber: string) => {
    if (!canPerformLookup()) {
      setViewState('limit-reached');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanNumber = cleanPhoneNumber(phoneNumber);
      const lookupResult = await lookupPhoneNumber(cleanNumber);

      incrementLookupCount();
      setRemainingLookups(getRemainingLookups());
      setResult(lookupResult);
      setViewState('results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to lookup phone number';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setViewState('input');
    setResult(null);
    setError(null);
    setRemainingLookups(getRemainingLookups());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
        style={{ backgroundImage: "url('/the one.png')" }}
      />
      <div className="min-h-screen flex flex-col relative z-10">
        <header className="bg-gray-900/50 backdrop-blur-sm shadow-sm border-b border-gray-800">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">QuickLookup</h1>
                  <p className="text-xs text-gray-400">Phone Number Lookup</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPremiumModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-600/30"
                >
                  <Crown className="w-4 h-4" />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>
                {viewState !== 'limit-reached' && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Lookups remaining</p>
                    <p className="text-lg font-bold text-blue-400">{remainingLookups}/3</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-start justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            {viewState === 'input' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">
                    Lookup Any Number
                  </h2>
                  <p className="text-gray-400">
                    Get carrier info, location, and line type instantly
                  </p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl p-6">
                  <PhoneInput
                    onLookup={handleLookup}
                    isLoading={isLoading}
                    disabled={false}
                  />

                  {error && (
                    <div className="mt-4 p-4 bg-red-950/30 border border-red-900/50 rounded-xl flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-300">Lookup Failed</p>
                        <p className="text-sm text-red-400 mt-1">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative border border-white/20 rounded-xl p-4 overflow-hidden bg-white/10 backdrop-blur-sm">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{
                      backgroundImage: "url('/blue.jpg')",
                      filter: "contrast(1.2) brightness(1.1)"
                    }}
                  />
                  <p className="text-base text-blue-400 text-center relative z-10">
                    <span className="font-semibold">{remainingLookups} free lookups</span> remaining today
                  </p>
                </div>
              </div>
            )}

            {viewState === 'results' && result && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">Lookup Results</h2>
                </div>
                <LookupResults result={result} onNewSearch={handleNewSearch} />

                <div className="relative border border-white/20 rounded-xl p-4 overflow-hidden bg-white/10 backdrop-blur-sm">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25"
                    style={{
                      backgroundImage: "url('/blue.jpg')",
                      filter: "contrast(1.2) brightness(1.1)"
                    }}
                  />
                  <p className="text-base text-blue-400 text-center relative z-10">
                    <span className="font-semibold">{remainingLookups} free lookups</span> remaining today
                  </p>
                </div>
              </div>
            )}

            {viewState === 'limit-reached' && (
              <UpgradePrompt onUpgradeClick={() => setIsPremiumModalOpen(true)} />
            )}
          </div>
        </main>

        <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 py-4">
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-center text-sm text-gray-400">
              Powered by NumVerify API
            </p>
          </div>
        </footer>
      </div>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
}

export default App;
