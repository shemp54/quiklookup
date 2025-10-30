import { MapPin, Building2, Radio, CheckCircle2, XCircle } from 'lucide-react';
import { LookupResult } from '../services/numverifyApi';

interface LookupResultsProps {
  result: LookupResult;
  onNewSearch: () => void;
}

export const LookupResults = ({ result, onNewSearch }: LookupResultsProps) => {
  return (
    <div className="w-full space-y-4 animate-fadeIn">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {result.localFormat}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{result.internationalFormat}</p>
          </div>
          <div className="flex-shrink-0">
            {result.valid ? (
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            ) : (
              <XCircle className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 space-y-3">
          <ResultRow
            icon={<MapPin className="w-5 h-5 text-blue-400" />}
            label="Location"
            value={result.location}
          />
          <ResultRow
            icon={<Building2 className="w-5 h-5 text-blue-400" />}
            label="Carrier"
            value={result.carrier}
          />
          <ResultRow
            icon={<Radio className="w-5 h-5 text-blue-400" />}
            label="Line Type"
            value={formatLineType(result.lineType)}
          />
        </div>

        <div className="border-t border-gray-800 pt-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoCard label="Country" value={result.countryName} />
            <InfoCard label="Country Code" value={result.countryCode} />
          </div>
        </div>
      </div>

      <button
        onClick={onNewSearch}
        className="w-full py-4 px-6 bg-gray-800 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all border border-gray-700"
      >
        New Search
      </button>
    </div>
  );
};

interface ResultRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ResultRow = ({ icon, label, value }: ResultRowProps) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-base font-medium text-gray-100 truncate">{value}</p>
    </div>
  </div>
);

interface InfoCardProps {
  label: string;
  value: string;
}

const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-100 mt-1">{value}</p>
  </div>
);

const formatLineType = (lineType: string): string => {
  if (!lineType || lineType === 'Unknown') return 'Unknown';
  return lineType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
