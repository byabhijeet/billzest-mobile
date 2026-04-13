import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettingsState {
  /** When true, the sidebar shows "Simplified POS" entry point */
  simplifiedPOSEnabled: boolean;
  setSimplifiedPOSEnabled: (enabled: boolean) => void;
}

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      simplifiedPOSEnabled: false,
      setSimplifiedPOSEnabled: (enabled) =>
        set({ simplifiedPOSEnabled: enabled }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
