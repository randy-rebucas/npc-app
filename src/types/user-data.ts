export type IIdentity = {
  userId: string;
  details: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
};

export type ICustomData = {
  preferences: {
    language: string;
    color: string;
  };
};

export type IAuthenticationInfo = {
  id: string;
  username: string | null;
  primaryEmail: string | null;
  primaryPhone: string | null;
  name: string;
  avatar: string;
  customData: ICustomData;
  identities: {
    [key: string]: IIdentity;
  };
  lastSignInAt: number;
  applicationId: string;
};

export type IUserProfile = Partial<{
  familyName: string;
  givenName: string;
  middleName: string;
  nickname: string;
  preferredUsername: string;
  profile: string;
  website: string;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  locale: string;
  address: Partial<{
    formatted: string;
    streetAddress: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  }>;
}>;
