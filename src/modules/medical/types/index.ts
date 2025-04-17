export interface License {
  id: string;
  userId: string;
  state: string;
  licenseNumber: string;
  expirationDate: Date;
  status: 'active' | 'expired' | 'pending';
}

export interface Specialty {
  id: string;
  name: string;
  category: string;
}

export interface Practice {
  id: string;
  userId: string;
  name: string;
  type: string;
  location: string;
  specialties: string[];
} 