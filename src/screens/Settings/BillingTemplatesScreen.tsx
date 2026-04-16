import React, { useState, useEffect, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { LayoutTemplate, AlignLeft, AlignCenter, Type, Maximize2, Image as ImageIcon, QrCode } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import DetailHeader from '../../components/DetailHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { billConfigService, BillConfigInput } from '../../supabase/billConfigService';
import { useOrganization } from '../../contexts/OrganizationContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BillConfigScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const queryClient = useQueryClient();
  const { organizationId } = useOrganization();

  // Fetch config
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['billConfig', organizationId],
    queryFn: () => billConfigService.getConfig(organizationId || ''),
    enabled: !!organizationId,
  });

  // Local state for form
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxDetails, setShowTaxDetails] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [paperSize, setPaperSize] = useState('80mm');
  const [printQrCode, setPrintQrCode] = useState(true);
  const [qrCodeData, setQrCodeData] = useState('');

  // Sync local state when data is loaded
  useEffect(() => {
    if (config) {
      setHeaderText(config.header_text || '');
      setFooterText(config.footer_text || '');
      setShowLogo(config.show_logo ?? true);
      setShowTaxDetails(config.show_tax_details ?? true);
      setFontSize(config.font_size || 'medium');
      setPaperSize(config.paper_size || '80mm');
      setPrintQrCode(config.print_qr_code ?? true);
      setQrCodeData(config.qr_code_data || '');
    }
  }, [config]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (input: BillConfigInput) => billConfigService.saveConfig(organizationId || '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billConfig', organizationId] });
      Alert.alert('Success', 'Billing settings saved successfully.');
    },
    onError: (err: any) => {
      Alert.alert('Error', err.message || 'Failed to save settings.');
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      header_text: headerText,
      footer_text: footerText,
      show_logo: showLogo,
      show_tax_details: showTaxDetails,
      font_size: fontSize,
      paper_size: paperSize,
      print_qr_code: printQrCode,
      qr_code_data: qrCodeData,
    });
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <DetailHeader title="Bill Configuration" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={tokens.primary} size="large" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <DetailHeader title="Bill Configuration" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlignLeft size={18} color={tokens.primary} />
            <Text style={styles.sectionTitle}>Content Settings</Text>
          </View>
          <Input
            label="Header Text (e.g. Terms & Conditions)"
            value={headerText}
            onChangeText={setHeaderText}
            multiline
            numberOfLines={2}
            placeholder="Header text on top of bill..."
            containerStyle={styles.inputField}
          />
          <Input
            label="Footer Text"
            value={footerText}
            onChangeText={setFooterText}
            multiline
            numberOfLines={2}
            placeholder="Thank you for visiting!"
            containerStyle={styles.inputField}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Type size={18} color={tokens.primary} />
            <Text style={styles.sectionTitle}>Print Preferences</Text>
          </View>
          
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Show Business Logo</Text>
              <Text style={styles.switchSub}>Include logo at the top</Text>
            </View>
            <Switch
              value={showLogo}
              onValueChange={setShowLogo}
              trackColor={{ true: tokens.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Show Tax Details</Text>
              <Text style={styles.switchSub}>Include GST summary</Text>
            </View>
            <Switch
              value={showTaxDetails}
              onValueChange={setShowTaxDetails}
              trackColor={{ true: tokens.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Print QR Code</Text>
              <Text style={styles.switchSub}>Show UPI/Order QR at bottom</Text>
            </View>
            <Switch
              value={printQrCode}
              onValueChange={setPrintQrCode}
              trackColor={{ true: tokens.primary }}
            />
          </View>

          {printQrCode && (
            <Input
              label="QR Code Data (UPI ID or Link)"
              value={qrCodeData}
              onChangeText={setQrCodeData}
              placeholder="e.g. billzest@upi"
              containerStyle={styles.inputField}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Maximize2 size={18} color={tokens.primary} />
            <Text style={styles.sectionTitle}>Format Settings</Text>
          </View>
          
          <Text style={styles.label}>Paper Size</Text>
          <View style={styles.optionsRow}>
            {['58mm', '80mm', 'A5', 'A4'].map(size => (
              <Pressable
                key={size}
                style={[styles.optionPill, paperSize === size && styles.optionPillActive]}
                onPress={() => setPaperSize(size)}
              >
                <Text style={[styles.optionText, paperSize === size && styles.optionTextActive]}>{size}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, {marginTop: 16}]}>Font Size</Text>
          <View style={styles.optionsRow}>
            {['small', 'medium', 'large'].map(size => (
              <Pressable
                key={size}
                style={[styles.optionPill, fontSize === size && styles.optionPillActive]}
                onPress={() => setFontSize(size)}
              >
                <Text style={[styles.optionText, fontSize === size && styles.optionTextActive]}>{size.charAt(0).toUpperCase() + size.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label={saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
            fullWidth
            onPress={handleSave}
            disabled={saveMutation.isPending}
            loading={saveMutation.isPending}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20, paddingBottom: 100 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: tokens.mutedForeground },
    section: {
      backgroundColor: tokens.surface_container_lowest,
      borderRadius: tokens.radiusLg,
      padding: tokens.spacingLg,
      marginBottom: 20,
      shadowColor: tokens.shadowColor,
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacingLg,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: tokens.foreground,
      marginLeft: 8,
    },
    inputField: {
      marginBottom: 12,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      marginBottom: 8,
    },
    switchLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.foreground,
    },
    switchTextContainer: {
      flex: 1,
    },
    switchSub: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginTop: 2,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.mutedForeground,
      marginBottom: 8,
    },
    optionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: tokens.surface_container_low,
    },
    optionPillActive: {
      backgroundColor: tokens.primary,
    },
    optionText: {
      fontSize: 14,
      color: tokens.foreground,
      fontWeight: '500',
    },
    optionTextActive: {
      color: tokens.primaryForeground,
    },
    actions: {
      marginTop: 10,
    },
  });

export default BillConfigScreen;
