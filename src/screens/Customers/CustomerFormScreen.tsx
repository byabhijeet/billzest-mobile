import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import FormActionBar from '../../components/ui/FormActionBar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import {
  ChevronLeft,
  MoreVertical,
  CheckCircle2,
  X,
  Wallet,
  MapPin,
  Info,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useClientMutations } from '../../logic/partyLogic';
import { partiesService } from '../../supabase/partiesService';
import { useOrganization } from '../../contexts/OrganizationContext';
import { Party } from '../../types/domain';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomersStackParamList } from '../../navigation/types';
import TonalInput from '../../components/ui/TonalInput';

type PartyFormState = {
  businessName: string;
  phone: string;
  email: string;
  gstin: string;
  openingBalance: string;
  balanceType: 'RECEIVABLE' | 'PAYABLE';
  creditLimit: string;
  isCreditEnabled: boolean;
  address: string;
  type: 'customer' | 'vendor';
};

type CustomerFormRoute = RouteProp<CustomersStackParamList, 'CustomerForm'>;

const CustomerFormScreen = () => {
  const { tokens } = useThemeTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation<NativeStackNavigationProp<CustomersStackParamList>>();
  const route = useRoute<CustomerFormRoute>();
  const { createClient, updateClient } = useClientMutations();
  const { organizationId } = useOrganization();
  const customerId = route.params?.customerId;
  const isEditMode = !!customerId;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(isEditMode);
  const [formState, setFormState] = useState<PartyFormState>({
    businessName: '',
    phone: '',
    email: '',
    gstin: '',
    openingBalance: '',
    balanceType: 'RECEIVABLE',
    creditLimit: '',
    isCreditEnabled: false,
    address: '',
    type: 'customer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const loadCustomer = async () => {
      if (!customerId) {
        setIsLoadingCustomer(false);
        return;
      }

      try {
        const customer = await partiesService.getPartyById(customerId);
        if (!isMounted) return;

        if (!customer) {
          Alert.alert('Not found', 'Party record could not be loaded.');
          navigation.goBack();
          return;
        }

        const balance = customer.balance ?? 0;
        setFormState({
          businessName: customer.name ?? '',
          phone: customer.mobile ?? customer.phone ?? '',
          email: customer.email ?? '',
          gstin: customer.gst_number ?? '',
          openingBalance: Math.abs(balance).toString(),
          balanceType: balance >= 0 ? 'RECEIVABLE' : 'PAYABLE',
          creditLimit: (customer.credit_limit ?? '').toString(),
          isCreditEnabled: customer.credit_limit_enabled ?? false,
          address: customer.address ?? '',
          type: customer.type === 'vendor' ? 'vendor' : 'customer',
        });
      } catch (error) {
        if (!isMounted) return;
        Alert.alert('Load failed', 'Unable to load party details.');
        navigation.goBack();
      } finally {
        if (isMounted) setIsLoadingCustomer(false);
      }
    };

    loadCustomer();
    return () => { isMounted = false; };
  }, [customerId, navigation]);

  const handleChange = (field: keyof PartyFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.businessName.trim()) newErrors.businessName = 'Name is required';
    if (!formState.phone.trim()) newErrors.phone = 'Phone is required';
    else if (formState.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }

    // GSTIN validation: 15 characters, alphanumeric format [0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]
    if (formState.gstin.trim()) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
      if (!gstinRegex.test(formState.gstin.trim().toUpperCase())) {
        newErrors.gstin = 'Enter a valid 15-character GSTIN';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSubmitting || isLoadingCustomer) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    const phoneNormalized = formState.phone.replace(/\D/g, '').trim();

    try {
      if (!isEditMode) {
        const existing = await partiesService.findPartyByPhone(organizationId!, phoneNormalized);
        if (existing) {
          Alert.alert('Duplicate Party', 'A party with this phone already exists.');
          setIsSubmitting(false);
          return;
        }
      }

      const payload: Partial<Party> = {
        name: formState.businessName.trim(),
        mobile: phoneNormalized,
        phone: phoneNormalized,
        email: formState.email.trim() || null,
        gst_number: formState.gstin.trim() || null,
        credit_limit: parseFloat(formState.creditLimit) || 0,
        credit_limit_enabled: formState.isCreditEnabled,
        address: formState.address.trim() || null,
        type: formState.type,
      };

      // Opening balance is immutable once record is created
      if (!isEditMode) {
        const balanceValue = parseFloat(formState.openingBalance) || 0;
        payload.balance = formState.balanceType === 'RECEIVABLE' ? balanceValue : -balanceValue;
      }

      if (isEditMode && customerId) {
        await updateClient.mutateAsync({ id: customerId, updates: payload });
      } else {
        await createClient.mutateAsync({ ...payload, organization_id: organizationId! } as any);
      }

      navigation.goBack();
    } catch (err: any) {
      if (err.code === 'conflict' && err.details?.existingId) {
        Alert.alert(
          'Party Already Exists',
          err.message,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'View Existing', 
              onPress: () => {
                navigation.replace('CustomerDetail', { customerId: err.details.existingId });
              } 
            }
          ]
        );
      } else {
        Alert.alert('Save failed', err?.message || 'Unable to save party.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft color={tokens.foreground} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Party' : 'Add Party'}</Text>
        <Pressable
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <MoreVertical color={tokens.foreground} size={20} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>BASIC INFO</Text>
                <Info size={14} color={tokens.mutedForeground} style={{ marginLeft: 8 }} />
              </View>
            </View>

            <TonalInput
              label="Party Name *"
              placeholder="Enter party name"
              value={formState.businessName}
              onChangeText={val => handleChange('businessName', val)}
              error={errors.businessName}
            />

            <TonalInput
              label="Phone *"
              placeholder="Mobile number"
              prefix="+91"
              keyboardType="number-pad"
              maxLength={10}
              value={formState.phone}
              onChangeText={val => handleChange('phone', val)}
              error={errors.phone}
            />

            <View style={styles.row}>
              <TonalInput
                label="Email"
                placeholder="Optional"
                keyboardType="email-address"
                value={formState.email}
                onChangeText={val => handleChange('email', val)}
                containerStyle={{ flex: 1 }}
              />
              <TonalInput
                label="GSTIN"
                placeholder="22AAAAA0000A1Z5"
                autoCapitalize="characters"
                maxLength={15}
                value={formState.gstin}
                onChangeText={val => handleChange('gstin', val.toUpperCase())}
                error={errors.gstin}
                containerStyle={{ flex: 1 }}
              />
            </View>
          </View>

          {/* Financial Setup Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>FINANCIAL SETUP</Text>
                <Wallet size={14} color={tokens.primary} style={{ marginLeft: 8 }} />
              </View>
            </View>

            <View style={styles.balanceContainer}>
              <Text style={styles.inputLabel}>
                Opening Balance {isEditMode && <Text style={{ color: tokens.mutedForeground }}>(Locked)</Text>}
              </Text>
              <View style={styles.balanceInputRow}>
                <TonalInput
                  label=""
                  placeholder="₹ 0.00"
                  keyboardType="numeric"
                  value={formState.openingBalance}
                  onChangeText={val => handleChange('openingBalance', val)}
                  editable={!isEditMode}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                  inputStyle={isEditMode ? { ...styles.hugeInput, opacity: 0.6 } : styles.hugeInput}
                />
                <View style={styles.toggleGroup}>
                  <Pressable
                    style={[
                      styles.toggleBtn,
                      formState.balanceType === 'RECEIVABLE' && styles.toggleBtnActive,
                      isEditMode && { opacity: 0.6 },
                    ]}
                    onPress={() => !isEditMode && handleChange('balanceType', 'RECEIVABLE')}
                    disabled={isEditMode}
                    accessibilityRole="button"
                    accessibilityLabel="You'll get"
                    accessibilityState={{ selected: formState.balanceType === 'RECEIVABLE', disabled: isEditMode }}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        formState.balanceType === 'RECEIVABLE' && styles.toggleBtnTextActive,
                      ]}
                    >
                      YOU&apos;LL GET
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.toggleBtn,
                      formState.balanceType === 'PAYABLE' && [styles.toggleBtnActive, { backgroundColor: tokens.destructive }],
                      isEditMode && { opacity: 0.6 },
                    ]}
                    onPress={() => !isEditMode && handleChange('balanceType', 'PAYABLE')}
                    disabled={isEditMode}
                    accessibilityRole="button"
                    accessibilityLabel="You'll give"
                    accessibilityState={{ selected: formState.balanceType === 'PAYABLE', disabled: isEditMode }}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        formState.balanceType === 'PAYABLE' && styles.toggleBtnTextActive,
                      ]}
                    >
                      YOU&apos;LL GIVE
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Enable Credit Limit</Text>
                <Text style={styles.switchSublabel}>Control exposure for this party</Text>
              </View>
              <Switch
                value={formState.isCreditEnabled}
                onValueChange={val => handleChange('isCreditEnabled', val)}
                trackColor={{ false: tokens.muted, true: tokens.primary }}
              />
            </View>

            {formState.isCreditEnabled && (
              <TonalInput
                label="Credit Limit Amount"
                placeholder="Set limit"
                keyboardType="numeric"
                value={formState.creditLimit}
                onChangeText={val => handleChange('creditLimit', val)}
              />
            )}
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>LOCATION & LOGISTICS</Text>
                <MapPin size={14} color={tokens.primary} style={{ marginLeft: 8 }} />
              </View>
            </View>

            <TonalInput
              label="Billing Address"
              placeholder="Street name, building, area..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              inputStyle={{ minHeight: 80 }}
              value={formState.address}
              onChangeText={val => handleChange('address', val)}
            />
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>

        <FormActionBar
          variant="dual"
          secondaryLabel="Discard"
          secondaryIcon={<X size={16} color={tokens.mutedForeground} />}
          onSecondary={() => navigation.goBack()}
          primaryLabel={isEditMode ? 'Update Party' : 'Save Party'}
          primaryIcon={<CheckCircle2 size={16} color={tokens.primaryForeground} />}
          onPrimary={handleSave}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: tokens.background,
    },
    headerBtn: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: tokens.foreground,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    section: {
      backgroundColor: tokens.surface_container_lowest,
      borderRadius: 24,
      padding: 16,
      marginBottom: 12,
      shadowColor: tokens.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 12,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: '800',
      color: tokens.secondary,
      letterSpacing: 1.5,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    inputLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: tokens.mutedForeground,
      marginBottom: 4,
      marginLeft: 4,
    },
    balanceContainer: {
      marginBottom: 14,
    },
    balanceInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: tokens.muted,
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      gap: 8,
    },
    hugeInput: {
      fontSize: 20,
      fontWeight: '800',
      paddingVertical: 8,
    },
    toggleGroup: {
      flexDirection: 'row',
      backgroundColor: tokens.background,
      borderRadius: 14,
      padding: 4,
    },
    toggleBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },
    toggleBtnActive: {
      backgroundColor: tokens.primary,
      shadowColor: tokens.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    toggleBtnText: {
      fontSize: 9,
      fontWeight: '800',
      color: tokens.mutedForeground,
    },
    toggleBtnTextActive: {
      color: tokens.primaryForeground,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 4,
      marginBottom: 4,
    },
    switchLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: tokens.foreground,
    },
    switchSublabel: {
      fontSize: 10,
      fontWeight: '500',
      color: tokens.mutedForeground,
      marginTop: 2,
    },
  });

export default CustomerFormScreen;
