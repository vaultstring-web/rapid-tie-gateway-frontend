'use client';

import { Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  const { theme } = useTheme();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${isCompleted 
                      ? 'bg-[#84cc16] text-white' 
                      : isCurrent 
                        ? 'bg-[#84cc16] text-white ring-4 ring-[#84cc16]/20' 
                        : 'bg-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                >
                  {isCompleted ? <Check size={16} /> : step.id}
                </div>
                <div className="text-center mt-2 hidden sm:block">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-[#84cc16]' : 'text-[var(--text-secondary)]'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-[#84cc16]' : 'bg-[var(--border-color)]'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};