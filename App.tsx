import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { SupabaseProvider } from './src/contexts/SupabaseContext';
import { OrganizationProvider } from './src/contexts/OrganizationContext';

const queryClient = new QueryClient();

function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <OrganizationProvider>
            <ThemeProvider>
              <StatusBar barStyle="light-content" />
              <RootNavigator />
            </ThemeProvider>
          </OrganizationProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
