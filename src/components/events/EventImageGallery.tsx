'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { EventImage } from '@/types/events/eventDetails';
import { useTheme } from '@/context/ThemeContext';

interface EventImageGalleryProps {
  images: EventImage[];
  eventName: string;
}

export const EventImageGallery = ({ images, eventName }: EventImageGalleryProps) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<EventImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const primaryImage = images.find(img => img.isPrimary) || images[0];

  const openLightbox = (image: EventImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      {/* Main Image */}
      <div className="relative rounded-xl overflow-hidden aspect-video cursor-pointer group" onClick={() => openLightbox(primaryImage, 0)}>
        <Image
          src={primaryImage?.url || '/images/event-placeholder.jpg'}
          alt={eventName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {images.length} photos
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.slice(0, 4).map((image, idx) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image, idx)}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src={image.url}
                alt={`${eventName} - ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          {images.length > 4 && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                +{images.length - 4}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X size={24} className="text-white" />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
          
          <div className="relative w-full max-w-5xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption || eventName}
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};