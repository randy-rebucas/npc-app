'use client';

import { createContext, useContext, useEffect, useState } from "react";

type ApplicationSettings = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  appVersion: string;
};

type ApplicationSettingsContextType = {
  settings: ApplicationSettings;
  isLoading: boolean;
};

const ApplicationSettingsContext = createContext<ApplicationSettingsContextType | undefined>(undefined);

export function ApplicationSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ApplicationSettings>({
    siteName: "",
    siteDescription: "",
    siteUrl: "",
    siteLogo: "",
    siteFavicon: "",
    appVersion: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ApplicationSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </ApplicationSettingsContext.Provider>
  );
}

export function useApplicationSettings() {
  const context = useContext(ApplicationSettingsContext);
  if (context === undefined) {
    throw new Error("useApplicationSettings must be used within an ApplicationSettingsProvider");
  }
  return context;
} 