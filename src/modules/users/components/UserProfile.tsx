import React from 'react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  onUpdate: (data: Partial<UserProfileType>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ profile, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {profile.avatar && (
          <img 
            src={profile.avatar} 
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input 
            type="tel"
            value={profile.phoneNumber || ''}
            onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input 
            type="text"
            value={profile.address || ''}
            onChange={(e) => onUpdate({ address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
      </div>
      
      {/* Add more profile fields */}
    </div>
  );
}; 