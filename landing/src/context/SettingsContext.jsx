import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({
  temperature: 0.7,
  setTemperature: () => {},
  demoMode: false,
  setDemoMode: () => {},
});

export function SettingsProvider({ children }) {
  const [temperature, setTemperature] = useState(() => {
    try {
      const saved = localStorage.getItem('pc_temperature');
      return saved !== null ? parseFloat(saved) : 0.7;
    } catch {
      return 0.7;
    }
  });

  const [demoMode, setDemoMode] = useState(() => {
    try {
      const saved = localStorage.getItem('pc_demo_mode');
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pc_temperature', String(temperature));
    } catch {
      // Ignore
    }
  }, [temperature]);

  useEffect(() => {
    try {
      localStorage.setItem('pc_demo_mode', String(demoMode));
    } catch {
      // Ignore
    }
  }, [demoMode]);

  return (
    <SettingsContext.Provider value={{ temperature, setTemperature, demoMode, setDemoMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
