'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { MALAWI_DESTINATIONS } from '@/types/employee/dsa';
import { useTheme } from '@/context/ThemeContext';

interface DestinationSelectorProps {
  value: string;
  onChange: (destination: string) => void;
  error?: string;
}

export const DestinationSelector = ({ value, onChange, error }: DestinationSelectorProps) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = MALAWI_DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredDestinations(MALAWI_DESTINATIONS);
      setShowSuggestions(true);
    }
  }, [searchTerm]);

  const handleSelect = (destination: string) => {
    setSearchTerm(destination);
    onChange(destination);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
        Destination <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for a city in Malawi..."
          className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
            error ? 'border-red-500' : 'border-[var(--border-color)]'
          }`}
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {error && <p className="error-text mt-1">{error}</p>}

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredDestinations.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border shadow-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          {filteredDestinations.map((destination) => (
            <button
              key={destination}
              type="button"
              onClick={() => handleSelect(destination)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--hover-bg)] transition-colors flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <MapPin size={14} className="text-[#84cc16]" />
              {destination}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};