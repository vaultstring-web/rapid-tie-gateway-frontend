'use client';

import { useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCategory } from '@/types/events/eventRecommendation';
import { useTheme } from '@/context/ThemeContext';

interface CategoryCarouselProps {
  category: RecommendationCategory;
  onSaveToggle: (eventId: string, saved: boolean) => void;
  onNotInterested: (eventId: string) => void;
}

export const CategoryCarousel = ({
  category,
  onSaveToggle,
  onNotInterested,
}: CategoryCarouselProps) => {
  const { theme } = useTheme();
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      similar: '🔄',
      trending: '📈',
      nearby: '📍',
      popular: '⭐',
      recommended: '🎯',
    };
    return icons[iconName] || '🎯';
  };

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(category.icon)}</span>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {category.name}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {category.description}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      {category.events.length > 0 ? (
        <Slider ref={sliderRef} {...settings}>
          {category.events.map((event) => (
            <div key={event.id} className="px-2">
              <RecommendationCard
                event={event}
                onSaveToggle={onSaveToggle}
                onNotInterested={onNotInterested}
                showMatchBadge={true}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            borderWidth: 1,
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No recommendations available in this category yet
          </p>
        </div>
      )}
    </div>
  );
};