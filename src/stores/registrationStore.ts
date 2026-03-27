import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RegistrationData, AccountType, BusinessDetails } from '@/types/registration';

interface RegistrationStore {
  currentStep: number;
  accountType: AccountType | null;
  businessDetails: BusinessDetails;
  contactInfo: RegistrationData['contactInfo'];
  verificationCode: string;
  errors: {
    step1?: string;
    step2?: Partial<Record<keyof BusinessDetails, string>>;
    step3?: Partial<Record<keyof RegistrationData['contactInfo'], string>>;
    step4?: string;
  };
  setCurrentStep: (step: number) => void;
  setAccountType: (type: AccountType) => void;
  setBusinessDetails: (details: Partial<BusinessDetails>) => void;
  setContactInfo: (info: Partial<RegistrationData['contactInfo']>) => void;
  setVerificationCode: (code: string) => void;
  setErrors: (step: number, errors: any) => void;
  clearErrors: (step: number) => void;
  resetRegistration: () => void;
  getRegistrationData: () => RegistrationData;
  isStepComplete: (step: number) => boolean;
}

const initialBusinessDetails: BusinessDetails = {
  businessName: '',
  registrationNumber: '',
  taxId: '',
  businessType: '',
  website: '',
  address: '',
  city: '',
  country: 'Malawi',
  postalCode: '',
};

const initialContactInfo: RegistrationData['contactInfo'] = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      accountType: null,
      businessDetails: initialBusinessDetails,
      contactInfo: initialContactInfo,
      verificationCode: '',
      errors: {},

      setCurrentStep: (step) => set({ currentStep: step }),
      setAccountType: (type) => set({ accountType: type }),
      setBusinessDetails: (details) =>
        set((state) => ({ businessDetails: { ...state.businessDetails, ...details } })),
      setContactInfo: (info) =>
        set((state) => ({ contactInfo: { ...state.contactInfo, ...info } })),
      setVerificationCode: (code) => set({ verificationCode: code }),
      setErrors: (step, errors) =>
        set((state) => {
          const key = `step${step}` as keyof typeof state.errors;
          return { errors: { ...state.errors, [key]: errors } };
        }),
      clearErrors: (step) =>
        set((state) => {
          const nextErrors = { ...state.errors };
          const key = `step${step}` as keyof typeof state.errors;
          delete nextErrors[key];
          return { errors: nextErrors };
        }),
      resetRegistration: () =>
        set({
          currentStep: 1,
          accountType: null,
          businessDetails: initialBusinessDetails,
          contactInfo: initialContactInfo,
          verificationCode: '',
          errors: {},
        }),
      getRegistrationData: () => ({
        accountType: get().accountType!,
        businessDetails: get().businessDetails,
        contactInfo: get().contactInfo,
        verificationCode: get().verificationCode,
      }),
      isStepComplete: (step) => {
        const state = get();
        switch (step) {
          case 1:
            return state.accountType !== null;
          case 2:
            return (
              state.businessDetails.businessName !== '' &&
              state.businessDetails.address !== '' &&
              state.businessDetails.city !== ''
            );
          case 3:
            return (
              state.contactInfo.firstName !== '' &&
              state.contactInfo.lastName !== '' &&
              state.contactInfo.email !== '' &&
              state.contactInfo.phone !== '' &&
              state.contactInfo.password !== '' &&
              state.contactInfo.confirmPassword !== ''
            );
          case 4:
            return state.verificationCode.length === 6;
          default:
            return false;
        }
      },
    }),
    {
      name: 'rapid-tie-registration',
      partialize: (state) => ({
        accountType: state.accountType,
        businessDetails: state.businessDetails,
        contactInfo: state.contactInfo,
      }),
    }
  )
);
