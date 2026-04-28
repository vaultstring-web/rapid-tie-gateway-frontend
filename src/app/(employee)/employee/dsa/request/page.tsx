'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Briefcase, Calendar, MapPin } from 'lucide-react';
import { DestinationSelector } from '@/components/employee/dsa/DestinationSelector';
import { DateRangePicker } from '@/components/employee/dsa/DateRangePicker';
import { EventsDuringStay } from '@/components/employee/dsa/EventsDuringStay';
import { CalculationPreview } from '@/components/employee/dsa/CalculationPreview';
import { dsaService } from '@/services/employee/dsa.service';
import { DSA_PURPOSES, MatchingEvent } from '@/types/employee/dsa';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockEvents = (): MatchingEvent[] => {
  return [
    {
      id: 'event-1',
      name: 'Malawi Fintech Expo 2026',
      description: 'The largest fintech conference in Malawi featuring industry leaders.',
      startDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      venue: 'BICC',
      city: 'Lilongwe',
      category: 'conference',
      imageUrl: '',
      relevanceScore: 92,
    },
    {
      id: 'event-2',
      name: 'Tech Innovation Workshop',
      description: 'Hands-on workshop on emerging technologies.',
      startDate: new Date(Date.now() + 9 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
      venue: 'Innovation Hub',
      city: 'Lilongwe',
      category: 'workshop',
      imageUrl: '',
      relevanceScore: 78,
    },
  ];
};

export default function NewDSARequestPage() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelAuthRef, setTravelAuthRef] = useState('');
  const [notes, setNotes] = useState('');
  
  const [duration, setDuration] = useState(0);
  const [perDiemRate, setPerDiemRate] = useState(0);
  const [accommodationRate, setAccommodationRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [matchingEvents, setMatchingEvents] = useState<MatchingEvent[]>([]);
  
  const [loading, setLoading] = useState({ rates: false, events: false, submit: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useMockData, setUseMockData] = useState(true);

  // Calculate duration and fetch rates when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setDuration(days);
      calculateRates();
    }
  }, [startDate, endDate, destination]);

  // Fetch matching events when destination and dates change
  useEffect(() => {
    if (destination && startDate && endDate) {
      fetchMatchingEvents();
    }
  }, [destination, startDate, endDate]);

  const calculateRates = async () => {
    if (!destination) return;
    
    setLoading(prev => ({ ...prev, rates: true }));
    try {
      if (useMockData) {
        // Mock rates based on destination
        const mockRates: Record<string, { perDiem: number; accommodation: number }> = {
          Lilongwe: { perDiem: 45000, accommodation: 60000 },
          Blantyre: { perDiem: 40000, accommodation: 55000 },
          Mzuzu: { perDiem: 38000, accommodation: 50000 },
          Zomba: { perDiem: 35000, accommodation: 45000 },
        };
        const rates = mockRates[destination] || { perDiem: 35000, accommodation: 45000 };
        setPerDiemRate(rates.perDiem);
        setAccommodationRate(rates.accommodation);
        setTotalAmount((rates.perDiem + rates.accommodation) * duration);
      } else {
        const grade = await dsaService.getEmployeeGrade();
        const rates = await dsaService.getRates(destination, grade);
        setPerDiemRate(rates.perDiem);
        setAccommodationRate(rates.accommodation);
        setTotalAmount((rates.perDiem + rates.accommodation) * duration);
      }
    } catch (error) {
      console.error('Failed to calculate rates:', error);
    } finally {
      setLoading(prev => ({ ...prev, rates: false }));
    }
  };

  const fetchMatchingEvents = async () => {
    if (!destination || !startDate || !endDate) return;
    
    setLoading(prev => ({ ...prev, events: true }));
    try {
      if (useMockData) {
        const mockEvents = getMockEvents();
        setMatchingEvents(mockEvents);
      } else {
        const events = await dsaService.getMatchingEvents(destination, startDate.toISOString(), endDate.toISOString());
        setMatchingEvents(events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(prev => ({ ...prev, events: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!destination) newErrors.destination = 'Destination is required';
    if (!purpose) newErrors.purpose = 'Purpose is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('DSA request submitted successfully (demo)');
        router.push('/employee/dsa/requests');
      } else {
        await dsaService.createRequest({
          destination,
          purpose,
          startDate: startDate!.toISOString(),
          endDate: endDate!.toISOString(),
          travelAuthRef: travelAuthRef || undefined,
          notes: notes || undefined,
        });
        toast.success('DSA request submitted successfully');
        router.push('/employee/dsa/requests');
      }
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const purposeConfig = DSA_PURPOSES.find(p => p.value === purpose);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">New DSA Request</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Submit a new Daily Subsistence Allowance request
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Demo Mode - Using sample rates and events. Connect to backend for live data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Destination */}
              <DestinationSelector
                value={destination}
                onChange={setDestination}
                error={errors.destination}
              />

              {/* Purpose Dropdown */}
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                  Purpose of Travel <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none ${
                      errors.purpose ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">Select purpose</option>
                    {DSA_PURPOSES.map(p => (
                      <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                    ))}
                  </select>
                </div>
                {errors.purpose && <p className="error-text mt-1">{errors.purpose}</p>}
                {purposeConfig && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Selected: {purposeConfig.icon} {purposeConfig.label}
                  </p>
                )}
              </div>

              {/* Date Range Picker */}
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                error={errors.startDate || errors.endDate}
              />

              {/* Travel Authorization Reference (Optional) */}
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                  Travel Authorization Reference
                  <span className="text-xs text-[var(--text-secondary)] ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={travelAuthRef}
                  onChange={(e) => setTravelAuthRef(e.target.value)}
                  placeholder="e.g., TA-2024-001"
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Additional Notes (Optional) */}
              <div>
                <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
                  Additional Notes
                  <span className="text-xs text-[var(--text-secondary)] ml-1">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any additional information about your travel..."
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading.submit}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#84cc16] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading.submit ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Submit DSA Request
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calculation Preview */}
            <CalculationPreview
              destination={destination}
              startDate={startDate}
              endDate={endDate}
              duration={duration}
              perDiemRate={perDiemRate}
              accommodationRate={accommodationRate}
              totalAmount={totalAmount}
              loading={loading.rates}
            />

            {/* Events During Stay */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
                <Calendar size={18} className="text-[#84cc16]" />
                Events During Your Stay
              </h3>
              <EventsDuringStay events={matchingEvents} loading={loading.events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}