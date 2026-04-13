/**
 * Utility to test Supabase connection
 * Use this to diagnose connection issues
 */

import { supabase } from '../supabase/supabaseClient';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const testSupabaseConnection =
  async (): Promise<ConnectionTestResult> => {
    if (__DEV__) {
      console.log('[Test] Starting Supabase connection test...');
      console.log(
        '[Test] Supabase URL:',
        (supabase as any).supabaseUrl ?? 'N/A',
      );
    }

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `Connection failed: ${error.message}`,
          details: {
            code: error.code,
            details: error.details,
            hint: error.hint,
            fullError: error,
          },
        };
      }

      return {
        success: true,
        message: 'Successfully connected to Supabase!',
        details: { data },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Exception occurred: ${err?.message || 'Unknown error'}`,
        details: {
          error: err,
          stack: err?.stack,
        },
      };
    }
  };

export const testSupabaseAuth = async (): Promise<ConnectionTestResult> => {
  if (__DEV__) {
    console.log('[Test] Testing Supabase auth...');
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return {
        success: false,
        message: `Auth check failed: ${error.message}`,
        details: { error },
      };
    }

    return {
      success: true,
      message: user ? `User authenticated: ${user.email}` : 'No user session',
      details: { user: user ? { id: user.id, email: user.email } : null },
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Auth exception: ${err?.message || 'Unknown error'}`,
      details: { error: err },
    };
  }
};

export const runFullConnectionTest = async (): Promise<void> => {
  if (!__DEV__) return; // Only run in development

  console.log('=== Supabase Connection Test ===\n');

  // Test 1: Basic Connection
  console.log('1. Testing basic connection...');
  const connectionTest = await testSupabaseConnection();
  console.log(connectionTest.success ? '✅' : '❌', connectionTest.message);
  if (connectionTest.details) {
    console.log('Details:', JSON.stringify(connectionTest.details, null, 2));
  }

  console.log('\n2. Testing authentication...');
  const authTest = await testSupabaseAuth();
  console.log(authTest.success ? '✅' : '❌', authTest.message);
  if (authTest.details) {
    console.log('Details:', JSON.stringify(authTest.details, null, 2));
  }

  console.log('\n=== Test Complete ===');
};
