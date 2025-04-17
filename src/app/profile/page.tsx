'use client';

import { useEffect, useState } from 'react';
import { UserProfile } from '@/modules/users/components/UserProfile';
import { UserActions } from '@/modules/users/actions';
import { LicenseForm } from '@/modules/medical/components/LicenseForm';
import { MedicalActions } from '@/modules/medical/actions';
import { UserProfile as UserProfileType } from '@/modules/users/types';
import { License } from '@/modules/medical/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await UserActions.getCurrentUser();
      if (user) {
        const userLicenses = await MedicalActions.getLicenses(user.id);
        setLicenses(userLicenses);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (data: Partial<UserProfileType>) => {
    if (profile) {
      const updated = await UserActions.updateUserProfile(profile.id, data);
      setProfile(updated);
    }
  };

  const handleLicenseSubmit = async (data: Omit<License, 'id'>) => {
    if (profile) {
      const newLicense = await MedicalActions.addLicense(profile.id, data);
      setLicenses([...licenses, newLicense]);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <UserProfile 
            profile={profile} 
            onUpdate={handleProfileUpdate} 
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Licenses</h2>
          <div className="space-y-4">
            {licenses.map(license => (
              <div key={license.id} className="p-4 border rounded">
                <p>State: {license.state}</p>
                <p>License Number: {license.licenseNumber}</p>
                <p>Status: {license.status}</p>
              </div>
            ))}
            <LicenseForm onSubmit={handleLicenseSubmit} />
          </div>
        </section>
      </div>
    </div>
  );
} 