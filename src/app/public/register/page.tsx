'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { AccountTypeSelection } from '@/components/registration/AccountTypeSelection';
import { BusinessDetailsForm } from '@/components/registration/BusinessDetailsForm';
import { ContactInfoForm } from '@/components/registration/ContactInfoForm';
import { VerificationCodeInput } from '@/components/registration/VerificationCodeInput';
import apiClient from '@/lib/api/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import {
  accountTypeSchema,
  businessDetailsSchema,
  contactInfoSchema,
} from '@/lib/validation/registration';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

export default function RegistrationPage() {
  const {
    currentStep,
    accountType,
    businessDetails,
    contactInfo,
    setCurrentStep,
    setAccountType,
    setBusinessDetails,
    setContactInfo,
    setVerificationCode,
    errors,
    clearErrors,
    isStepComplete,
    resetRegistration,
  } = useRegistrationStore();

  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [step2Errors, setStep2Errors] = useState<
    Partial<Record<keyof typeof businessDetails, string>>
  >({});
  const [step3Errors, setStep3Errors] = useState<Partial<Record<keyof typeof contactInfo, string>>>(
    {}
  );
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      try {
        accountTypeSchema.parse({ accountType });
        setStep1Error(null);
        clearErrors(1);
        setCurrentStep(2);
      } catch (error: any) {
        setStep1Error(error?.errors?.[0]?.message || 'Please select an account type');
      }
    } else if (currentStep === 2) {
      try {
        businessDetailsSchema.parse(businessDetails);
        setStep2Errors({});
        setCurrentStep(3);
      } catch (error: any) {
        const formatted: Partial<Record<keyof typeof businessDetails, string>> = {};
        error.errors?.forEach((err: any) => {
          const key = err.path[0] as keyof typeof businessDetails;
          formatted[key] = err.message;
        });
        setStep2Errors(formatted);
        const firstErrorField = Object.keys(formatted)[0];
        if (firstErrorField) {
          const element = document.getElementById(`field-${firstErrorField}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else if (currentStep === 3) {
      try {
        contactInfoSchema.parse(contactInfo);
        setStep3Errors({});

        setLoading(true);
        const registrationData = {
          accountType: accountType!,
          businessDetails,
          contactInfo,
        };

        const response = await apiClient.post('/auth/register', registrationData);
        if (response.data.success) {
          toast.success('Account created! Please verify your email.');
          setCurrentStep(4);
        } else {
          throw new Error(response.data.message || 'Registration failed');
        }
      } catch (error: any) {
        if (error?.response?.data?.errors) {
          const formatted: Partial<Record<keyof typeof contactInfo, string>> = {};
          error.response.data.errors.forEach((err: any) => {
            if (err.field) formatted[err.field] = err.message;
          });
          setStep3Errors(formatted);
        } else {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              'Registration failed. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setVerificationError(null);

    try {
      const response = await apiClient.post('/auth/verify-email', {
        email: contactInfo.email,
        code,
      });

      if (response.data.success) {
        setVerificationCode(code);
        setRegistrationComplete(true);
        toast.success('Email verified! Redirecting to login...');

        setTimeout(() => {
          router.push('/login');
          resetRegistration();
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (error: any) {
      setVerificationError(
        error?.response?.data?.message || error?.message || 'Invalid verification code'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/resend-verification', {
        email: contactInfo.email,
      });
      if (response.data.success) {
        toast.success('Verification code resent!');
      } else {
        throw new Error(response.data.message || 'Failed to resend code');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to resend verification code'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Type', description: 'Choose your account type' },
    { number: 2, title: 'Business Details', description: 'Tell us about your business' },
    { number: 3, title: 'Contact Info', description: 'Your personal details' },
    { number: 4, title: 'Verification', description: 'Verify your email' },
  ];

  if (registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-neutral-0">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-h2 font-bold text-neutral-900 mb-4">Registration Complete!</h2>
          <p className="text-body text-neutral-600 mb-6">
            Your email has been verified. You can now sign in to your account.
          </p>
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-caption text-neutral-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-primary-blue-50 to-neutral-0 py-8">
      <div className="container-custom">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Image src="/vault.png" alt="Rapid Tie" width={100} height={100} className="" />
            </div>
            <div className="text-left">
              <span className="text-h6 font-bold text-neutral-900">Rapid Tie</span>
              <span className="text-caption text-neutral-600 block -mt-1">by VaultString</span>
            </div>
          </Link>
          <h1 className="text-h2 font-bold text-neutral-900">Create Your Account</h1>
          <p className="text-body text-neutral-600 mt-2">Join the Rapid Tie payment ecosystem</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-primary-green-500 text-white shadow-lg'
                        : 'bg-neutral-200 text-neutral-500'
                    } ${currentStep === step.number ? 'ring-4 ring-primary-green-200' : ''}`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center mt-2 hidden md:block">
                    <p className="text-caption font-medium text-neutral-700">{step.title}</p>
                    <p className="text-caption text-neutral-500">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary-green-500' : 'bg-neutral-200'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 md:hidden">
            <p className="text-body-sm font-medium text-primary-green-600">
              Step {currentStep} of 4: {steps[currentStep - 1].title}
            </p>
            <p className="text-caption text-neutral-500">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-6 md:p-8 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && (
                  <AccountTypeSelection
                    selectedType={accountType}
                    onSelect={(value) => {
                      setAccountType(value);
                      setStep1Error(null);
                    }}
                    error={step1Error ?? (errors.step1 as string | undefined)}
                  />
                )}

                {currentStep === 2 && accountType && (
                  <BusinessDetailsForm
                    data={businessDetails}
                    accountType={accountType}
                    onChange={(partial) => setBusinessDetails(partial)}
                    errors={step2Errors}
                  />
                )}

                {currentStep === 3 && (
                  <ContactInfoForm
                    data={contactInfo}
                    onChange={(partial) => setContactInfo(partial)}
                    errors={step3Errors}
                  />
                )}

                {currentStep === 4 && (
                  <VerificationCodeInput
                    email={contactInfo.email}
                    onVerify={handleVerify}
                    onResend={handleResendCode}
                    loading={loading}
                    error={verificationError || undefined}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" onClick={handlePreviousStep} disabled={currentStep === 1}>
                <ArrowLeftIcon className="w-4 h-4 mr-1" /> Previous
              </Button>
              <div className="flex items-center gap-3">
                <p className="text-caption text-neutral-500 mt-1">
                  {isStepComplete(currentStep) ? 'Step complete' : 'Step incomplete'}
                </p>
                <Button onClick={handleNextStep}>
                  {currentStep < 4 ? 'Next' : 'Finish'} <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
