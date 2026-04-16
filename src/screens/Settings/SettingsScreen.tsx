import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import ScreenWrapper from '../../components/ScreenWrapper';
import {
  User,
  Building2,
  FileText,
  Globe,
  Barcode,
  Zap,
  LogOut,
  ArrowLeft,
  LayoutTemplate,
} from 'lucide-react-native';
import { useSupabase } from '../../contexts/SupabaseContext';
import { supabase } from '../../supabase/supabaseClient';
import { logger } from '../../utils/logger';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import type { AppNavigationParamList } from '../../navigation/types';
import {
  SettingsSectionCard,
  SettingsRow,
  PreferenceSwitchRow,
  SegmentedThemeSelector,
  AccountCard,
} from '../../components/settings/SettingsComponents';

const SettingsScreen: React.FC = () => {
  const { tokens, themeMode, setThemeMode } = useThemeTokens();
  const navigation = useNavigation<NavigationProp<AppNavigationParamList>>();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const { user } = useSupabase();
  const [signingOut, setSigningOut] = React.useState(false);
  const { simplifiedPOSEnabled, setSimplifiedPOSEnabled } = useAppSettingsStore();

  const performLogout = async (scope?: 'local' | 'global') => {
    // Global removes server session; local clears device session only.
    return supabase.auth.signOut(scope ? { scope } : undefined);
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);

      let { error } = await performLogout('global');

      if (error) {
        logger.warn('[Settings] Global sign-out failed, retrying local', error);
        // Fallback to local-only sign-out so UI can still exit to login.
        const localResult = await performLogout('local');
        error = localResult.error;
      }

      if (error) {
        Alert.alert('Logout failed', error.message || 'Could not sign out.');
      } else {
        Alert.alert('Signed out', 'You have been logged out.');
      }
      // RootNavigator listens to Supabase session; no manual navigation reset needed.
    } catch (err) {
      logger.error('[Settings] Logout failed', err);
      Alert.alert('Logout failed', 'Unexpected error. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  const confirmLogout = () => {
    // Protect against accidental logouts
    if (signingOut) return;
    Alert.alert('Log out?', 'You will need to sign in again to continue.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <ScreenWrapper>
      {/* ── Single sticky header ─────────────────────────────────────── */}
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.toolbarBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color={tokens.foreground} />
        </Pressable>
        <View style={styles.toolbarCenter}>
          <Text style={styles.toolbarTitle}>Settings</Text>
          <Text style={styles.toolbarSub}>Manage account & business</Text>
        </View>
        <View style={styles.toolbarSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Account ──────────────────────────────────────────────────── */}
        <SettingsSectionCard title="Account">
          <AccountCard email={user?.email} userId={user?.id} />
          <SettingsRow
            icon={<User size={17} color={tokens.primary} />}
            iconTint={tokens.primaryAlpha10}
            label="Profile & Password"
            subtitle="Account security & login credentials"
            onPress={() => navigation.navigate('BusinessInfo')}
            isLast
            accessibilityLabel="Profile and password"
          />
        </SettingsSectionCard>

        {/* ── Business Profile ─────────────────────────────────────────── */}
        <SettingsSectionCard title="Business Profile">
          <SettingsRow
            icon={<Building2 size={17} color={tokens.primary} />}
            iconTint={tokens.primaryAlpha10}
            label="Business Details"
            subtitle="Store name, GSTIN, address"
            onPress={() => navigation.navigate('BusinessInfo')}
            accessibilityLabel="Business details"
          />
          <SettingsRow
            icon={<Globe size={17} color={tokens.info} />}
            iconTint={tokens.infoAlpha15}
            label="Online Store"
            subtitle="Catalog & storefront settings"
            onPress={() => navigation.navigate('OnlineStoreConfig')}
            accessibilityLabel="Online store"
          />
          <SettingsRow
            icon={<FileText size={17} color={tokens.warning} />}
            iconTint={tokens.warningAlpha15}
            label="Billing Settings"
            subtitle="Tax rates & invoice numbering"
            onPress={() => navigation.navigate('BillingTemplates')}
            accessibilityLabel="Billing settings"
          />
          <SettingsRow
            icon={<LayoutTemplate size={17} color={tokens.primary} />}
            iconTint={tokens.primaryAlpha10}
            label="Advanced Billing"
            subtitle="Templates & POS rules"
            onPress={() => navigation.navigate('BillingScreen')}
            isLast
            accessibilityLabel="Advanced billing"
          />
        </SettingsSectionCard>

        {/* ── Utilities ────────────────────────────────────────────────── */}
        <SettingsSectionCard title="Utilities">
          <SettingsRow
            icon={<Barcode size={17} color={tokens.mutedForeground} />}
            iconTint={tokens.surface_container_low}
            label="Barcode Generator"
            subtitle="Create product barcodes"
            onPress={() =>
              navigation.navigate('ProductsTab', { screen: 'BarcodeGenerator' })
            }
            isLast
            accessibilityLabel="Barcode generator"
          />
        </SettingsSectionCard>

        {/* ── App Preferences ──────────────────────────────────────────── */}
        <SettingsSectionCard title="App Preferences">
          <PreferenceSwitchRow
            icon={
              <Zap
                size={17}
                color={simplifiedPOSEnabled ? tokens.primary : tokens.mutedForeground}
              />
            }
            label="Simplified POS"
            subtitle="Faster billing for small catalogs"
            value={simplifiedPOSEnabled}
            onValueChange={setSimplifiedPOSEnabled}
            accessibilityLabel="Enable simplified POS"
          />
          <View style={styles.themeRow}>
            <Text style={styles.themeRowLabel}>App Theme</Text>
            <SegmentedThemeSelector
              value={themeMode}
              onChange={setThemeMode}
            />
          </View>
        </SettingsSectionCard>

        {/* ── Danger zone ──────────────────────────────────────────────── */}
        <View style={styles.dangerCard}>
          <Pressable
            onPress={confirmLogout}
            disabled={signingOut}
            accessibilityLabel="Log out"
            accessibilityRole="button"
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={({ pressed }) => [
              styles.logoutRow,
              pressed && styles.logoutRowPressed,
            ]}
          >
            <View style={styles.logoutIcon}>
              <LogOut size={17} color={tokens.destructive} />
            </View>
            <Text style={styles.logoutLabel}>
              {signingOut ? 'Signing out…' : 'Log Out'}
            </Text>
          </Pressable>
        </View>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BillZest · Version 1.0.0</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerDot}>·</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    // ── Toolbar ──────────────────────────────────────────────────────────
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 60,
      paddingHorizontal: 16,
      backgroundColor: tokens.background,
    },
    toolbarBack: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 19,
    },
    toolbarCenter: {
      flex: 1,
      alignItems: 'center',
    },
    toolbarTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
    },
    toolbarSub: {
      fontSize: 11,
      color: tokens.mutedForeground,
      marginTop: 1,
    },
    toolbarSpacer: {
      width: 38,
    },

    // ── ScrollView ───────────────────────────────────────────────────────
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 48,
    },

    // ── Theme row inside preferences card ────────────────────────────────
    themeRow: {
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 14,
    },
    themeRowLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 10,
    },

    // ── Danger / Logout card ─────────────────────────────────────────────
    dangerCard: {
      backgroundColor: tokens.destructiveAlpha10,
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
    },
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 16,
    },
    logoutRowPressed: {
      backgroundColor: tokens.destructiveAlpha20,
    },
    logoutIcon: {
      width: 38,
      height: 38,
      borderRadius: 11,
      backgroundColor: tokens.destructiveAlpha15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 13,
    },
    logoutLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: tokens.destructive,
    },

    // ── Footer ───────────────────────────────────────────────────────────
    footer: {
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
    },
    footerText: {
      fontSize: 11,
      color: tokens.mutedForeground,
    },
    footerLinks: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: 6,
    },
    footerLink: {
      fontSize: 11,
      color: tokens.mutedForeground,
    },
    footerDot: {
      fontSize: 11,
      color: tokens.mutedForeground,
    },
  });

export default SettingsScreen;
