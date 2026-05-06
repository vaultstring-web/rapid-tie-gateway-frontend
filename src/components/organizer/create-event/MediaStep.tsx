'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { CreateEventFormData } from '@/types/organizer/createEvent';
import { useTheme } from '@/context/ThemeContext';

interface MediaStepProps {
  formData: CreateEventFormData;
  onChange: (data: Partial<CreateEventFormData>) => void;
}

export const MediaStep = ({ formData, onChange }: MediaStepProps) => {
  const { theme } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      onChange({ coverImage: file });
    }
  };

  const handleGalleryUpload = (files: FileList) => {
    const newImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    onChange({ galleryImages: [...formData.galleryImages, ...newImages] });
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...formData.galleryImages];
    newImages.splice(index, 1);
    onChange({ galleryImages: newImages });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleGalleryUpload(files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Cover Image</label>
        <div
          className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            formData.coverImage ? 'border-[#84cc16] bg-[#84cc16]/5' : 'border-[var(--border-color)] hover:border-[#84cc16]'
          }`}
          onClick={() => coverInputRef.current?.click()}
        >
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
          />
          
          {formData.coverImage ? (
            <div className="relative">
              <img
                src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : formData.coverImage}
                alt="Cover"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ coverImage: undefined });
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="py-8">
              <Upload size={32} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
              <p className="text-sm text-[var(--text-secondary)]">Click to upload cover image</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Recommended: 1200x675px, JPG or PNG</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Gallery Images</label>
        <div
          className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            dragActive ? 'border-[#84cc16] bg-[#84cc16]/5' : 'border-[var(--border-color)] hover:border-[#84cc16]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => galleryInputRef.current?.click()}
        >
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
          />
          
          {formData.galleryImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {formData.galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={img instanceof File ? URL.createObjectURL(img) : img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGalleryImage(idx);
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div
                className="aspect-square rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:border-[#84cc16] transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  galleryInputRef.current?.click();
                }}
              >
                <Upload size={20} className="text-[var(--text-secondary)] opacity-50" />
              </div>
            </div>
          ) : (
            <div className="py-8">
              <ImageIcon size={32} className="mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
              <p className="text-sm text-[var(--text-secondary)]">Drag & drop images here or click to upload</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Add up to 10 images to showcase your event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};