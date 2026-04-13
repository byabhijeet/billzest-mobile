import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
} from 'react-native';
import {
  Shield,
  Smartphone,
  Monitor,
  MapPin,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import Button from '../../components/ui/Button';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';

const SESSION_DEVICES = [
  {
    id: 'pixel',
    name: 'Pixel 7 Pro',
    location: 'Bengaluru, India',
    lastActive: 'Active now',
    icon: <Smartphone size={18} />,
  },
  {
    id: 'macbook',
    name: 'MacBook Air',
    location: 'Bengaluru, India',
    lastActive: 'Yesterday 09:12 PM',
    icon: <Monitor size={18} />,
  },
];

const SecurityScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const [isPasscodeEnabled, setPasscodeEnabled] = React.useState(true);
  const [isBiometricEnabled, setBiometricEnabled] = React.useState(false);

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Shield color={tokens.primary} size={22} />
          </View>
          <Text style={styles.title}>Security & Access</Text>
          <Text style={styles.subtitle}>
            Protect your data across devices and staff accounts.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Device security</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.rowLabel}>App passcode</Text>
              <Text style={styles.rowCaption}>
                Ask for 4-digit code at every launch.
              </Text>
            </View>
            <Switch
              value={isPasscodeEnabled}
              onValueChange={setPasscodeEnabled}
              thumbColor={isPasscodeEnabled ? tokens.primary : '#f4f3f4'}
              trackColor={{ false: tokens.border, true: tokens.primary }}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleCopy}>
              <Text style={styles.rowLabel}>Biometric unlock</Text>
              <Text style={styles.rowCaption}>
                Allow Face ID / fingerprint.
              </Text>
            </View>
            <Switch
              value={isBiometricEnabled}
              onValueChange={setBiometricEnabled}
              thumbColor={isBiometricEnabled ? tokens.primary : '#f4f3f4'}
              trackColor={{ false: tokens.border, true: tokens.primary }}
            />
          </View>
          <Button
            label="Reset passcode"
            variant="secondary"
            fullWidth
            style={styles.cardCta}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Active sessions</Text>
          {SESSION_DEVICES.map(device => (
            <View key={device.id} style={styles.sessionRow}>
              <View style={styles.sessionIcon}>{device.icon}</View>
              <View style={styles.sessionCopy}>
                <Text style={styles.rowLabel}>{device.name}</Text>
                <Text style={styles.rowCaption}>{device.lastActive}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={tokens.mutedForeground} />
                  <Text style={styles.locationText}>{device.location}</Text>
                </View>
              </View>
              <Pressable style={styles.sessionAction}>
                <LogOut color={tokens.destructive} size={16} />
                <Text style={styles.sessionActionLabel}>Sign out</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Staff permissions</Text>
          <Pressable style={styles.permissionRow}>
            <View>
              <Text style={styles.rowLabel}>Manage staff roles</Text>
              <Text style={styles.rowCaption}>
                Limit who can edit products, prices, or credit.
              </Text>
            </View>
            <ChevronRight color={tokens.mutedForeground} size={18} />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 80 },
    header: { marginBottom: 12 },
    iconBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tokens.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    title: { fontSize: 24, fontWeight: '700', color: tokens.foreground },
    subtitle: { color: tokens.mutedForeground, marginTop: 6 },
    card: {
      backgroundColor: tokens.card,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
      marginBottom: 12,
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    toggleCopy: { flex: 1, marginRight: 12 },
    rowLabel: { color: tokens.foreground, fontWeight: '600' },
    rowCaption: { color: tokens.mutedForeground, marginTop: 4 },
    cardCta: { marginTop: 16 },
    sessionRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
      paddingVertical: 12,
      alignItems: 'center',
    },
    sessionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: tokens.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    sessionCopy: { flex: 1 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    locationText: { color: tokens.mutedForeground, marginLeft: 4 },
    sessionAction: { alignItems: 'center' },
    sessionActionLabel: {
      color: tokens.destructive,
      fontSize: 12,
      marginTop: 4,
    },
    permissionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default SecurityScreen;
