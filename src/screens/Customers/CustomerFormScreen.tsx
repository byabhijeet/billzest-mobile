import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import {
  ChevronLeft,
  Building2,
  User,
  Phone,
  Wallet,
  Tag,
  Check,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import DetailHeader from '../../components/DetailHeader';
import { useClientMutations } from '../../logic/partyLogic';
import { partiesService } from '../../supabase/partiesService';
import { useOrganization } from '../../contexts/OrganizationContext';
import { Party } from '../../types/domain';
import { CommonActions } from '@react-navigation/native';

type PartyFormState = {
  businessName: string;
  contactPerson: string;
  phone: string;
  type: 'customer' | 'vendor'; // Added type toggle logic
};

type CustomerFormRoute = RouteProp<
  { CustomerForm: { intent?: 'sale' | 'purchase' } },
  'CustomerForm'
>;

const CustomerFormScreen = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation<any>();
  const route = useRoute<CustomerFormRoute>();
  const { createClient } = useClientMutations();
  const { organizationId } = useOrganization();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<PartyFormState>({
    businessName: '',
    contactPerson: '',
    phone: '',
    type: route.params?.intent === 'purchase' ? 'vendor' : 'customer',
  });

  const handleChange = (field: keyof PartyFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): {
    isValid: boolean;
    errors: Record<string, string>;
  } => {
    const errors: Record<string, string> = {};

    // Business name validation
    if (!formState.businessName.trim()) {
      errors.businessName = 'Business name is required';
    } else if (formState.businessName.trim().length < 2) {
      errors.businessName = 'Business name must be at least 2 characters';
    }

    // Phone validation
    const phoneDigits = formState.phone.replace(/\D/g, '');
    if (!formState.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      errors.phone = 'Please enter a valid Indian mobile number';
    }

    // Contact person validation (optional but if provided, should be valid)
    if (
      formState.contactPerson.trim() &&
      formState.contactPerson.trim().length < 2
    ) {
      errors.contactPerson =
        'Contact person name must be at least 2 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleSave = async () => {
    if (isSubmitting || createClient.isPending) return;

    const validation = validateForm();
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      Alert.alert('Validation Error', firstError);
      return;
    }

    setIsSubmitting(true);
    const phoneNormalized = formState.phone.replace(/\D/g, '').trim();

    try {
      // Check for duplicate in parties
      const existing = await partiesService.findPartyByPhone(
        organizationId!,
        phoneNormalized,
      );
      if (existing) {
        Alert.alert(
          'Duplicate party',
          'A party with this phone already exists.',
        );
        return;
      }

      // Insert into parties
      const payload: Omit<
        Party,
        'id' | 'created_at' | 'updated_at' | 'user_id' | 'balance'
      > = {
        organization_id: organizationId!,
        type: formState.type,
        name: formState.businessName.trim(),
        party_type: formState.type,
        mobile: phoneNormalized,
        phone: phoneNormalized, // Keeping explicit phone field for compatibility
        email: null,
        address: null,
        notes: null,
      };

      await createClient.mutateAsync(payload as any); // Using mutateAsync from hook

      Alert.alert('Success', 'Party created successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to save party.';
      Alert.alert('Save failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerTitle = `New ${
    formState.type === 'customer' ? 'Customer' : 'Supplier'
  }`;

  return (
    <ScreenWrapper>
      <DetailHeader
        title={headerTitle}
        actions={[
          {
            icon: <Check size={18} color={tokens.foreground} />,
            onPress: handleSave,
            accessibilityLabel: 'Save',
          },
        ]}
      />
      <View style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
        >
          <ScrollView style={styles.content}>
          {/* Party Type Toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleBtn,
                formState.type === 'customer' && styles.toggleBtnActive,
              ]}
              onPress={() =>
                setFormState(prev => ({ ...prev, type: 'customer' }))
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  formState.type === 'customer' && styles.toggleTextActive,
                ]}
              >
                Customer
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleBtn,
                formState.type === 'vendor' && styles.toggleBtnActive,
              ]}
              onPress={() =>
                setFormState(prev => ({ ...prev, type: 'vendor' }))
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  formState.type === 'vendor' && styles.toggleTextActive,
                ]}
              >
                Vendor / Supplier
              </Text>
            </Pressable>
          </View>

          {/* Form Fields - Matches AddSaleScreen card style */}
          <View style={styles.sectionCard}>
            <View style={styles.inputRow}>
              <Building2 color={tokens.primary} size={18} />
              <View style={styles.copyBlock}>
                <Text style={styles.inputLabel}>Business / Store Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formState.businessName}
                  onChangeText={value => handleChange('businessName', value)}
                  placeholder="e.g. Rahul Traders"
                  placeholderTextColor={tokens.mutedForeground}
                />
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <User color={tokens.primary} size={18} />
              <View style={styles.copyBlock}>
                <Text style={styles.inputLabel}>Contact Person (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={formState.contactPerson}
                  onChangeText={value => handleChange('contactPerson', value)}
                  placeholder="e.g. Rahul Kumar"
                  placeholderTextColor={tokens.mutedForeground}
                />
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.inputRow}>
              <Phone color={tokens.primary} size={18} />
              <View style={styles.copyBlock}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={formState.phone}
                  onChangeText={value => handleChange('phone', value)}
                  placeholder="00000 00000"
                  placeholderTextColor={tokens.mutedForeground}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldCard}>
              <Wallet color={tokens.primary} size={18} />
              <Text style={styles.fieldLabel}>Opening Balance</Text>
              <TextInput
                style={styles.fieldValueInput}
                placeholder="₹0"
                placeholderTextColor={tokens.mutedForeground}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.fieldCard}>
              <Tag color={tokens.primary} size={18} />
              <Text style={styles.fieldLabel}>Group</Text>
              <Text style={styles.fieldValue}>
                {formState.type === 'customer' ? 'Retail' : 'Wholesale'}
              </Text>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Preferences</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.prefLabel}>Send payment reminders</Text>
              <Check size={18} color={tokens.primary} />
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: tokens.card,
      padding: 4,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    toggleBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 8,
    },
    toggleBtnActive: {
      backgroundColor: tokens.background,
      // elevation: 1
      borderWidth: 1,
      borderColor: tokens.border,
    },
    toggleText: {
      color: tokens.mutedForeground,
      fontWeight: '600',
    },
    toggleTextActive: {
      color: tokens.foreground,
      fontWeight: '700',
    },
    sectionCard: {
      backgroundColor: tokens.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    copyBlock: {
      flex: 1,
      marginLeft: 12,
    },
    inputLabel: {
      fontSize: 12,
      color: tokens.mutedForeground,
      marginBottom: 4,
    },
    textInput: {
      fontSize: 15,
      fontWeight: '600',
      color: tokens.foreground,
      padding: 0,
    },
    divider: {
      height: 1,
      backgroundColor: tokens.border,
    },
    fieldRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    fieldCard: {
      flex: 1,
      marginRight: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      padding: 12,
    },
    fieldLabel: {
      color: tokens.mutedForeground,
      marginTop: 8,
      fontSize: 12,
    },
    fieldValue: {
      color: tokens.foreground,
      fontWeight: '700',
      marginTop: 6,
      fontSize: 16,
    },
    fieldValueInput: {
      color: tokens.foreground,
      fontWeight: '700',
      marginTop: 2,
      fontSize: 16,
      padding: 0,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.mutedForeground,
      marginBottom: 12,
      marginTop: 4,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    prefLabel: {
      color: tokens.foreground,
      fontSize: 15,
    },
  });

export default CustomerFormScreen;
