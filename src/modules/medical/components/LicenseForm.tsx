import React from 'react';
import { License } from '../types';

interface LicenseFormProps {
  onSubmit: (data: Omit<License, 'id'>) => void;
  initialData?: Partial<License>;
}

export const LicenseForm: React.FC<LicenseFormProps> = ({ onSubmit, initialData }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">State</label>
        <input 
          type="text"
          defaultValue={initialData?.state}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">License Number</label>
        <input 
          type="text"
          defaultValue={initialData?.licenseNumber}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
      {/* Add more form fields */}
      <button 
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Submit License
      </button>
    </form>
  );
}; 