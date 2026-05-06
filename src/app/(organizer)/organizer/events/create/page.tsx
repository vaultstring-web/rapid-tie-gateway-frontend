'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { StepIndicator } from '@/components/organizer/create-event/StepIndicator';
import { BasicInfoStep } from '@/components/organizer/create-event/BasicInfoStep';
import { DateTimeLocationStep } from '@/components/organizer/create-event/DateTimeLocationStep';
import { TicketsStep } from '@/components/organizer/create-event/TicketsStep';
import { MediaStep } from '@/components/organizer/create-event/MediaStep';
import { ReviewStep } from '@/components/organizer/create-event/ReviewStep';
import { CreateEventFormData } from '@/types/organizer/createEvent';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Event name, category, description' },
  { id: 2, title: 'Date & Location', description: 'When and where' },
  { id: 3, title: 'Tickets', description: 'Ticket tiers and pricing' },
  { id: 4, title: 'Media', description: 'Images and branding' },
  { id: 5, title: 'Review', description: 'Confirm and publish' },
];

const initialFormData: CreateEventFormData = {
  name: '',
  description: '',
  shortDescription: '',
  category: '',
  type: 'public',
  startDate: '',
  endDate: '',
  timezone: 'Africa/Blantyre',
  venue: '',
  city: '',
  address: '',
  isVirtual: false,
  virtualLink: '',
  ticketTiers: [],
  coverImage: undefined,
  galleryImages: [],
  capacity: 0,
  tags: [],
  organizerId: '',
};

export default function CreateEventPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateEventFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (data: Partial<CreateEventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear errors for updated fields
    if (data.name) delete errors.name;
    if (data.category) delete errors.category;
    if (data.startDate) delete errors.startDate;
    if (data.endDate) delete errors.endDate;
    if (data.venue) delete errors.venue;
    if (data.city) delete errors.city;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Event name is required';
      if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    if (step === 2) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (!formData.isVirtual && !formData.venue.trim()) newErrors.venue = 'Venue is required';
      if (!formData.isVirtual && !formData.city) newErrors.city = 'City is required';
    }
    
    if (step === 3 && formData.ticketTiers.length === 0) {
      toast.error('Please add at least one ticket tier');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Event created successfully!');
      router.push('/organizer/events');
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
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
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create New Event</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Fill in the details below to create your event
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6">
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} onChange={updateFormData} errors={errors} />
          )}
          {currentStep === 2 && (
            <DateTimeLocationStep formData={formData} onChange={updateFormData} errors={errors} />
          )}
          {currentStep === 3 && (
            <TicketsStep ticketTiers={formData.ticketTiers} onChange={(tiers) => updateFormData({ ticketTiers: tiers })} errors={errors} />
          )}
          {currentStep === 4 && (
            <MediaStep formData={formData} onChange={updateFormData} />
          )}
          {currentStep === 5 && (
            <ReviewStep formData={formData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Create Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}