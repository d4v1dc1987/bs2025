import React from 'react';
import { BasicInfo } from './form/BasicInfo';
import { BusinessDetails } from './form/BusinessDetails';
import { CompanyInfo } from './form/CompanyInfo';
import { ResultsSection } from './form/ResultsSection';
import type { BusinessProfile } from "./types";

interface BusinessFormProps {
  formData: BusinessProfile;
  handleInputChange: (field: keyof BusinessProfile, value: string | null) => void;
}

export const BusinessForm = ({ formData, handleInputChange }: BusinessFormProps) => {
  return (
    <div className="space-y-8">
      <BasicInfo formData={formData} handleInputChange={handleInputChange} />
      <BusinessDetails formData={formData} handleInputChange={handleInputChange} />
      <CompanyInfo formData={formData} handleInputChange={handleInputChange} />
      <ResultsSection formData={formData} handleInputChange={handleInputChange} />
    </div>
  );
};