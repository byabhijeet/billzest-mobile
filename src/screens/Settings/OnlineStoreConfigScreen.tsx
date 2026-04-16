import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import DetailHeader from '../../components/DetailHeader';
import Button from '../../components/ui/Button';
import { ThemeTokens } from '../../theme/tokens';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { Store, Globe, Palette } from 'lucide-react-native';

const OnlineStoreConfigScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [storeEnabled, setStoreEnabled] = useState(false);
  const [storeUrl, setStoreUrl] = useState('mystore.billzest.com');
  const [themeColor, setThemeColor] = useState('#4F46E5');
  const [whatsappOrders, setWhatsappOrders] = useState(true);
  const [deliveryRadius, setDeliveryRadius] = useState('5');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      Alert.alert('Success', 'Online store configuration saved successfully.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <DetailHeader title="Online Store Setup" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <View style={styles.headerBox}>
          <Store size={32} color={tokens.primary} />
          <Text style={styles.headerTitle}>Digital Storefront</Text>
          <Text style={styles.headerSub}>Let your customers order online directly from their phones.</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Enable Online Store</Text>
              <Text style={styles.helpText}>Make your catalog visible online.</Text>
            </View>
            <Switch value={storeEnabled} onValueChange={setStoreEnabled} />
          </View>
        </View>

        {storeEnabled && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Store Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Store Link / Subdomain</Text>
              <View style={styles.inputWrapper}>
                <Globe color={tokens.mutedForeground} size={18} />
                <TextInput
                  style={styles.input}
                  value={storeUrl}
                  onChangeText={setStoreUrl}
                  placeholder="mystore.billzest.com"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={styles.helpText}>Share this link with your customers to get orders.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Theme Color</Text>
              <View style={styles.inputWrapper}>
                <Palette color={tokens.mutedForeground} size={18} />
                <TextInput
                  style={styles.input}
                  value={themeColor}
                  onChangeText={setThemeColor}
                  placeholder="#HexCode"
                />
              </View>
            </View>

            <View style={[styles.row, { paddingVertical: 12 }]}>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Receive Orders on WhatsApp</Text>
                <Text style={styles.helpText}>Customers can check out via WhatsApp message.</Text>
              </View>
              <Switch value={whatsappOrders} onValueChange={setWhatsappOrders} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Radius (km)</Text>
              <TextInput
                style={[styles.inputWrapper, styles.input, { paddingHorizontal: 12, marginLeft: 0 }]}
                value={deliveryRadius}
                onChangeText={setDeliveryRadius}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>
          </View>
        )}

      </ScrollView>
      <View style={styles.footer}>
         <Button label="Save Changes" onPress={handleSave} loading={isLoading} fullWidth />
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (tokens: ThemeTokens) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: tokens.primaryAlpha10,
    borderRadius: tokens.radiusLg,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.foreground,
    marginTop: 12,
  },
  headerSub: {
    fontSize: 14,
    color: tokens.mutedForeground,
    textAlign: 'center',
    marginTop: 6,
  },
  card: {
    backgroundColor: tokens.surface_container_lowest,
    borderRadius: tokens.radiusLg,
    padding: tokens.spacingLg,
    marginBottom: 16,
    shadowColor: tokens.shadowColor,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.foreground,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.foreground,
  },
  helpText: {
    fontSize: 12,
    color: tokens.mutedForeground,
    marginTop: 2,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.surface_container_low,
    borderRadius: tokens.radiusSm,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: tokens.foreground,
    fontSize: 15,
  },
  footer: {
    padding: 16,
    backgroundColor: tokens.background,
  }
});

export default OnlineStoreConfigScreen;
