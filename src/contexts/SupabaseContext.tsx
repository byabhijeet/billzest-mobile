import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabaseClient';
import { logger } from '../utils/logger';
import { AppState, AppStateStatus } from 'react-native';

interface SupabaseContextSchema {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSessionExpired: boolean;
  refreshSession: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextSchema | undefined>(
  undefined,
);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  // Check if session is expired or about to expire
  const checkSessionExpiry = (currentSession: Session | null) => {
    if (!currentSession) {
      setIsSessionExpired(true);
      return;
    }

    const expiresAt = currentSession.expires_at;
    if (!expiresAt) {
      setIsSessionExpired(false);
      return;
    }

    // Check if session expires in less than 5 minutes
    const expiresIn = expiresAt * 1000 - Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    setIsSessionExpired(expiresIn < fiveMinutes);
  };

  // Refresh session manually
  const refreshSession = async () => {
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        logger.error('Failed to refresh session', error);
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('invalid_grant')) {
          // Session is truly expired, clear it
          setSession(null);
          setUser(null);
          setIsSessionExpired(true);
        }
      } else {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        checkSessionExpiry(newSession);
      }
    } catch (error) {
      logger.error('Error refreshing session', error);
      setIsSessionExpired(true);
    }
  };

  useEffect(() => {
    // Check for initial session
    const checkUser = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session', error);
          setIsSessionExpired(true);
        } else {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          checkSessionExpiry(initialSession);
        }
      } catch (error) {
        logger.error('Error checking session', error);
        setIsSessionExpired(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      logger.log('[Auth] State changed:', event);
      
      setSession(session);
      setUser(session?.user ?? null);
      checkSessionExpiry(session);
      setIsLoading(false);

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED' && session) {
        logger.log('[Auth] Token refreshed successfully');
        setIsSessionExpired(false);
      }

      // Handle session expiry
      if (event === 'SIGNED_OUT' || !session) {
        setIsSessionExpired(true);
      }
    });

    // Handle app state changes for session refresh
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to foreground, check and refresh session if needed
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
          if (currentSession) {
            const expiresAt = currentSession.expires_at;
            if (expiresAt) {
              const expiresIn = expiresAt * 1000 - Date.now();
              const fiveMinutes = 5 * 60 * 1000;
              if (expiresIn < fiveMinutes) {
                refreshSession();
              }
            }
          }
        });
      }
      appState.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <SupabaseContext.Provider 
      value={{ 
        user, 
        session, 
        isLoading, 
        isSessionExpired,
        refreshSession,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
