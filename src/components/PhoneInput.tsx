import { useState } from 'react';
import { Phone } from 'lucide-react';
import { formatPhoneNumber, isValidPhoneNumber } from '../utils/phoneFormatter';

interface PhoneInputProps {
  onLookup: (phoneNumber: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const PhoneInput = ({ onLookup, isLoading, disabled = false }: PhoneInputProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setValue(formatted);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!isValidPhoneNumber(value)) {
      setError('Please enter a valid 10-digit US phone number');
      return;
    }

    onLookup(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          disabled={disabled || isLoading}
          className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error
              ? 'border-red-500/50 bg-red-950/20 text-white placeholder:text-gray-500'
              : 'border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-500'
          } ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          maxLength={14}
          inputMode="tel"
          autoComplete="tel"
          autoFocus
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium px-1">{error}</p>
      )}

      <button
        type="submit"
        disabled={disabled || isLoading || !value.trim()}
        className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 text-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Looking up...
          </span>
        ) : (
          'Lookup Number'
        )}
      </button>
    </form>
  );
};
