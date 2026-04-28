'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  error?: string;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
}: DateRangePickerProps) => {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isSelected = (date: Date) => {
    if (!startDate && !endDate) return false;
    if (startDate && date.toDateString() === startDate.toDateString()) return true;
    if (endDate && date.toDateString() === endDate.toDateString()) return true;
    if (startDate && endDate && date > startDate && date < endDate) return 'in-range';
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart || !startDate) {
      onStartDateChange(date);
      setSelectingStart(false);
    } else {
      if (date < startDate) {
        onStartDateChange(date);
        onEndDateChange(startDate);
      } else {
        onEndDateChange(date);
      }
      setSelectingStart(true);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div>
      <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
        Travel Dates <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4 mb-2">
        <div className="flex-1">
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={startDate ? startDate.toLocaleDateString() : ''}
              placeholder="Start Date"
              readOnly
              className="w-full pl-10 pr-3 py-2 rounded-lg border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onClick={() => setSelectingStart(true)}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={endDate ? endDate.toLocaleDateString() : ''}
              placeholder="End Date"
              readOnly
              className="w-full pl-10 pr-3 py-2 rounded-lg border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              onClick={() => setSelectingStart(false)}
            />
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="mt-2 p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex justify-between items-center mb-3">
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 rounded-lg hover:bg-[var(--hover-bg)]"
          >
            <ChevronLeft size={18} className="text-[var(--text-secondary)]" />
          </button>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 rounded-lg hover:bg-[var(--hover-bg)]"
          >
            <ChevronRight size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-[var(--text-secondary)] py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-9" />;
            }
            
            const selected = isSelected(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateClick(date)}
                className={`
                  h-9 rounded-lg text-sm font-medium transition-all
                  ${selected === 'in-range' ? 'bg-[#84cc16]/20 text-[#84cc16]' : ''}
                  ${selected === true ? 'bg-[#84cc16] text-white' : 'hover:bg-[var(--hover-bg)]'}
                  ${isToday && !selected ? 'border border-[#84cc16]' : ''}
                `}
                style={{ color: selected === true ? 'white' : 'var(--text-primary)' }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex gap-4 mt-2 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#84cc16]" />
          <span>Start/End</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#84cc16]/30" />
          <span>In Range</span>
        </div>
      </div>
      
      {error && <p className="error-text mt-2">{error}</p>}
    </div>
  );
};