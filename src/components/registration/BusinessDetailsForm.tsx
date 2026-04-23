'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  IdentificationIcon,
} from '@heroicons/react/24/outline';
import { BusinessDetails, BusinessTypeOption } from '@/types/registration';

interface BusinessDetailsFormProps {
  data: BusinessDetails;
  accountType: 'MERCHANT' | 'ORGANIZER' | 'EMPLOYEE';
  onChange: (data: Partial<BusinessDetails>) => void;
  errors: Partial<Record<keyof BusinessDetails, string>>;
}

const businessTypes: BusinessTypeOption[] = [
  {
    value: 'sole_proprietorship',
    label: 'Sole Proprietorship',
    description: 'Business owned by one person',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'Business owned by two or more people',
  },
  {
    value: 'limited_liability',
    label: 'Limited Liability Company (LLC)',
    description: 'Private limited company',
  },
  { value: 'corporation', label: 'Corporation', description: 'Public limited company' },
  {
    value: 'non_profit',
    label: 'Non-Profit Organization',
    description: 'Charitable or non-profit entity',
  },
  {
    value: 'government',
    label: 'Government Agency',
    description: 'Government ministry or department',
  },
  { value: 'other', label: 'Other', description: 'Other type of organization' },
];

const malawiCities = [
  'Lilongwe',
  'Blantyre',
  'Mzuzu',
  'Zomba',
  'Mangochi',
  'Karonga',
  'Salima',
  'Nkhotakota',
  'Kasungu',
  'Dedza',
];

export const BusinessDetailsForm = ({
  data,
  accountType,
  onChange,
  errors,
}: BusinessDetailsFormProps) => {
  const [showBusinessType, setShowBusinessType] = useState(false);
  const [showRegistrationNumber, setShowRegistrationNumber] = useState(false);

  useEffect(() => {
    if (accountType === 'MERCHANT' || accountType === 'ORGANIZER') {
      setShowBusinessType(true);
      setShowRegistrationNumber(true);
    } else {
      setShowBusinessType(false);
      setShowRegistrationNumber(false);
    }
  }, [accountType]);

  const getFormTitle = () => {
    switch (accountType) {
      case 'MERCHANT':
        return 'Business Information';
      case 'ORGANIZER':
        return 'Organization Information';
      case 'EMPLOYEE':
        return 'Organization Details';
      default:
        return 'Business Information';
    }
  };

  const getFormSubtitle = () => {
    switch (accountType) {
      case 'MERCHANT':
        return 'Tell us about your business';
      case 'ORGANIZER':
        return 'Tell us about your organization';
      case 'EMPLOYEE':
        return 'Provide your organization details for DSA processing';
      default:
        return 'Tell us about your business';
    }
  };

  const getBusinessNameLabel = () => {
    switch (accountType) {
      case 'MERCHANT':
        return 'Business Name';
      case 'ORGANIZER':
      case 'EMPLOYEE':
        return 'Organization Name';
      default:
        return 'Business Name';
    }
  };

  const getBusinessNamePlaceholder = () => {
    switch (accountType) {
      case 'MERCHANT':
        return 'e.g., ABC Enterprises';
      case 'ORGANIZER':
        return 'e.g., Malawi Events Company';
      case 'EMPLOYEE':
        return 'e.g., Ministry of Finance';
      default:
        return 'Enter your business name';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-neutral-900 mb-2">{getFormTitle()}</h2>
        <p className="text-body text-neutral-600">{getFormSubtitle()}</p>
      </div>

      <div className="space-y-5 mt-6">
        <div>
          <label className="label label-required">{getBusinessNameLabel()}</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <BuildingOfficeIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={data.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
              className={`input pl-10 ${errors.businessName ? 'input-error' : ''}`}
              placeholder={getBusinessNamePlaceholder()}
              id="field-businessName"
            />
          </div>
          {errors.businessName && <p className="error-text mt-1">{errors.businessName}</p>}
        </div>

        {showBusinessType && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="label label-required">Business Type</label>
              <select
                value={data.businessType || ''}
                onChange={(e) => onChange({ businessType: e.target.value })}
                className={`input appearance-none ${errors.businessType ? 'input-error' : ''}`}
                id="field-businessType"
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {data.businessType && (
                <p className="text-caption text-neutral-500 mt-1">
                  {businessTypes.find((t) => t.value === data.businessType)?.description}
                </p>
              )}
              {errors.businessType && <p className="error-text mt-1">{errors.businessType}</p>}
            </motion.div>
          </AnimatePresence>
        )}

        {showRegistrationNumber && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <label className="label">
                Registration Number{' '}
                <span className="text-caption text-neutral-400 ml-1">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <IdentificationIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={data.registrationNumber || ''}
                  onChange={(e) => onChange({ registrationNumber: e.target.value })}
                  className={`input pl-10 ${errors.registrationNumber ? 'input-error' : ''}`}
                  placeholder="e.g., 2024/12345 or REG-123456"
                  id="field-registrationNumber"
                />
              </div>
              <p className="text-caption text-neutral-500 mt-1">
                Your company registration number from the Registrar of Companies
              </p>
              {errors.registrationNumber && (
                <p className="error-text mt-1">{errors.registrationNumber}</p>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div>
          <label className="label">
            Tax ID / TIN <span className="text-caption text-neutral-400 ml-1">(optional)</span>
          </label>
          <input
            type="text"
            value={data.taxId || ''}
            onChange={(e) => onChange({ taxId: e.target.value })}
            className="input"
            placeholder="e.g., 123456789"
            id="field-taxId"
          />
          <p className="text-caption text-neutral-500 mt-1">
            Your Malawi Taxpayer Identification Number (TIN)
          </p>
        </div>

        {showBusinessType && (
          <div>
            <label className="label">
              Website <span className="text-caption text-neutral-400 ml-1">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <GlobeAltIcon className="w-5 h-5" />
              </div>
              <input
                type="url"
                value={data.website || ''}
                onChange={(e) => onChange({ website: e.target.value })}
                className="input pl-10"
                placeholder="https://yourbusiness.com"
                id="field-website"
              />
            </div>
          </div>
        )}

        <div>
          <label className="label label-required">Street Address</label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-neutral-400">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <textarea
              value={data.address}
              onChange={(e) => onChange({ address: e.target.value })}
              className={`input pl-10 min-h-[80px] resize-y ${errors.address ? 'input-error' : ''}`}
              placeholder="Enter your physical address"
              rows={3}
              id="field-address"
            />
          </div>
          {errors.address && <p className="error-text mt-1">{errors.address}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label label-required">City</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              list="malawi-cities"
              className={`input ${errors.city ? 'input-error' : ''}`}
              placeholder="e.g., Lilongwe"
              id="field-city"
            />
            <datalist id="malawi-cities">
              {malawiCities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            {errors.city && <p className="error-text mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="label label-required">Country</label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              className={`input ${errors.country ? 'input-error' : ''}`}
              placeholder="Malawi"
              disabled
              id="field-country"
            />
            <p className="text-caption text-neutral-500 mt-1">Currently serving Malawi only</p>
            {errors.country && <p className="error-text mt-1">{errors.country}</p>}
          </div>
        </div>

        <div>
          <label className="label">
            Postal Code <span className="text-caption text-neutral-400 ml-1">(optional)</span>
          </label>
          <input
            type="text"
            value={data.postalCode || ''}
            onChange={(e) => onChange({ postalCode: e.target.value })}
            className="input"
            placeholder="e.g., 12345"
            id="field-postalCode"
          />
        </div>
      </div>

      <div className="bg-primary-green-50 rounded-lg p-4 mt-4">
        <p className="text-body-sm text-primary-green-800">
          <strong>Why we need this information:</strong> This helps us verify your business and
          ensure compliance with Malawian regulations. Your information is secure and will only be
          used for account verification.
        </p>
      </div>
    </div>
  );
};
