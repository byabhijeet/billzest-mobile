import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useThemeTokens } from '../../theme/ThemeProvider';
import { ThemeTokens } from '../../theme/tokens';
import { Product } from '../../types/domain';
import DetailHeader from '../../components/DetailHeader';
import {
  Share2,
  Printer,
  Package,
  Edit2,
  TrendingUp,
  ReceiptText,
  Layers,
  Info,
  MoreHorizontal,
} from 'lucide-react-native';

// ─── Design Tokens (Stitch-aligned) ────────────────────────────────────────
const DS = {
  green: '#006e2d',
  greenContainer: '#1db954',
  greenContainerBg: 'rgba(29,185,84,0.12)',
  greenDim: 'rgba(29,185,84,0.08)',
  surface: '#f8f9fa',
  surfaceCard: '#ffffff',
  surfaceContainerLow: '#f3f4f5',
  surfaceContainerHigh: '#e7e8e9',
  surfaceContainerHighest: '#e1e3e4',
  onSurface: '#191c1d',
  onSurfaceVariant: '#3d4a3d',
  outline: 'rgba(108,123,108,0.15)',
  outlineVariant: 'rgba(188,203,185,0.25)',
  secondary: '#645d5c',
  tertiary: '#a8353e',
  tertiaryLight: 'rgba(168,53,62,0.1)',
  radius24: 24,
  radius16: 16,
  radius12: 12,
  radius8: 8,
};

// ─── Types ──────────────────────────────────────────────────────────────────
type TabKey = 'overview' | 'pricing' | 'inventory' | 'more';

const EMPTY_PRODUCT: Product = {
  id: '',
  organization_id: '',
  name: '',
  sku: null,
  category: null,
  selling_price: 0,
  mrp: 0,
  purchase_price: 0,
  stock_quantity: 0,
  tax_rate: 0,
  unit: '',
  barcode: '',
  description: '',
  is_active: true,
  expiry_date: null,
  created_at: '',
  updated_at: '',
};

type ProductDetailRoute = RouteProp<
  { ProductDetail: { product?: Product } },
  'ProductDetail'
>;

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Hero card shown on all tabs */
const HeroCard: React.FC<{ product: Product; styles: ReturnType<typeof createStyles> }> = ({
  product,
  styles: s,
}) => {
  const discount =
    product.mrp > 0 && product.selling_price < product.mrp
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : 0;

  return (
    <View style={s.heroCard}>
      <View style={s.heroRow}>
        {/* Product icon */}
        <View style={s.heroIcon}>
          <Package color={DS.greenContainer} size={26} />
        </View>

        <View style={s.heroCopy}>
          <Text style={s.heroName} numberOfLines={2}>{product.name || 'Unnamed Item'}</Text>
          <View style={s.chipRow}>
            {product.category?.name ? (
              <View style={s.chipSecondary}>
                <Text style={s.chipSecondaryText}>{product.category.name.toUpperCase()}</Text>
              </View>
            ) : null}
            <View style={s.chipPrimary}>
              <Text style={s.chipPrimaryText}>PRODUCT</Text>
            </View>
            <View style={[s.chipOutline, !product.is_active && s.chipInactive]}>
              <View style={[s.chipDot, !product.is_active && s.chipDotInactive]} />
              <Text style={[s.chipOutlineText, !product.is_active && s.chipInactiveText]}>
                {product.is_active ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
            {discount > 0 && (
              <View style={s.chipDiscount}>
                <Text style={s.chipDiscountText}>{discount}% OFF</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* SKU / Barcode footer */}
      <View style={s.heroFooter}>
        <View>
          <Text style={s.heroFooterLabel}>SKU</Text>
          <Text style={s.heroFooterValue}>{product.sku || '—'}</Text>
        </View>
        <View style={s.heroFooterRight}>
          <Text style={s.heroFooterLabel}>BARCODE</Text>
          <Text style={s.heroFooterValue}>{product.barcode || '—'}</Text>
        </View>
      </View>
    </View>
  );
};

/** Horizontal pill tab bar */
const TabBar: React.FC<{
  active: TabKey;
  onChange: (t: TabKey) => void;
  styles: ReturnType<typeof createStyles>;
}> = ({ active, onChange, styles: s }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'more', label: 'More' },
  ];

  return (
    <View style={s.tabBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabBarContent}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChange(tab.key)}
            activeOpacity={0.75}
            style={[s.tabPill, active === tab.key && s.tabPillActive]}
          >
            <Text style={[s.tabPillText, active === tab.key && s.tabPillTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

/** Row used in info cards */
const InfoRow: React.FC<{
  label: string;
  value: string;
  valueColor?: string;
  styles: ReturnType<typeof createStyles>;
}> = ({ label, value, valueColor, styles: s }) => (
  <View style={s.infoRow}>
    <Text style={s.infoRowLabel}>{label}</Text>
    <Text style={[s.infoRowValue, valueColor ? { color: valueColor } : undefined]}>
      {value}
    </Text>
  </View>
);

/** Section card with accent bar header */
const SectionCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  styles: ReturnType<typeof createStyles>;
}> = ({ title, icon, children, styles: s }) => (
  <View style={s.sectionCard}>
    <View style={s.sectionHeader}>
      {icon ? <View style={s.sectionIconWrap}>{icon}</View> : <View style={s.sectionAccentBar} />}
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// ─── Tab: Overview ──────────────────────────────────────────────────────────
const OverviewTab: React.FC<{
  product: Product;
  onEdit: () => void;
  styles: ReturnType<typeof createStyles>;
}> = ({ product, onEdit, styles: s }) => {
  const margin = product.selling_price - product.purchase_price;

  return (
    <View style={s.tabContent}>
      {/* Action row */}
      <View style={s.actionRow}>
        <Pressable style={s.primaryBtn} onPress={onEdit}>
          <Edit2 size={15} color="#fff" />
          <Text style={s.primaryBtnText}>Edit Item</Text>
        </Pressable>
      </View>

      {/* 4-stat grid */}
      <View style={s.statGrid}>
        {/* Selling Price */}
        <View style={[s.statCard, s.statCardGreen]}>
          <View style={s.statAccentBarGreen} />
          <Text style={s.statLabel}>Selling Price</Text>
          <Text style={s.statValue}>{formatCurrency(product.selling_price)}</Text>
          <Text style={s.statSubtext}>Incl. GST</Text>
        </View>

        {/* Purchase Price */}
        <View style={[s.statCard, s.statCardRed]}>
          <View style={s.statAccentBarRed} />
          <Text style={s.statLabel}>Purchase Price</Text>
          <Text style={s.statValue}>{formatCurrency(product.purchase_price)}</Text>
          {margin > 0 && (
            <View style={s.marginChip}>
              <TrendingUp size={10} color={DS.green} />
              <Text style={s.marginChipText}>{formatCurrency(margin)} margin</Text>
            </View>
          )}
        </View>

        {/* MRP */}
        <View style={s.statCard}>
          <Text style={s.statLabel}>MRP</Text>
          <Text style={s.statValue}>{product.mrp > 0 ? formatCurrency(product.mrp) : '—'}</Text>
          <Text style={s.statSubtext}>Max retail price</Text>
        </View>

        {/* Stock */}
        <View style={s.statCard}>
          <Text style={s.statLabel}>Stock</Text>
          <Text style={s.statValue}>{product.stock_quantity ?? '—'}</Text>
          {product.unit ? (
            <Text style={[s.statSubtext, { textTransform: 'uppercase', fontWeight: '700' }]}>
              {product.unit}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Quick Info card */}
      <SectionCard title="QUICK INFORMATION" styles={s}>
        <View style={s.divider} />
        {product.hsn ? <InfoRow label="HSN Code" value={product.hsn} styles={s} /> : null}
        <InfoRow label="Unit" value={product.unit || '—'} styles={s} />
        <InfoRow label="GST Rate" value={`${product.tax_rate ?? 0}%`} styles={s} />
        <InfoRow
          label="Expiry Date"
          value={formatDate(product.expiry_date)}
          valueColor={product.expiry_date ? DS.tertiary : undefined}
          styles={s}
        />
        {product.description ? (
          <View style={s.descriptionBlock}>
            <Text style={s.infoRowLabel}>Description</Text>
            <Text style={s.descriptionText}>{product.description}</Text>
          </View>
        ) : null}
      </SectionCard>
    </View>
  );
};

// ─── Tab: Pricing ───────────────────────────────────────────────────────────
const PricingTab: React.FC<{
  product: Product;
  styles: ReturnType<typeof createStyles>;
}> = ({ product, styles: s }) => {
  const cgst = (product.tax_rate ?? 0) / 2;
  const sgst = (product.tax_rate ?? 0) / 2;
  const discount =
    product.mrp > 0 && product.selling_price < product.mrp
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : 0;

  return (
    <View style={s.tabContent}>
      {/* Price Breakdown */}
      <SectionCard
        title="PRICE BREAKDOWN"
        icon={<ReceiptText size={18} color={DS.green} />}
        styles={s}
      >
        <View style={s.divider} />
        <InfoRow label="MRP" value={product.mrp > 0 ? formatCurrency(product.mrp) : '—'} styles={s} />
        <InfoRow
          label="Selling Price"
          value={formatCurrency(product.selling_price)}
          valueColor={DS.green}
          styles={s}
        />
        <InfoRow label="Purchase Price" value={formatCurrency(product.purchase_price)} styles={s} />
        {discount > 0 && (
          <View style={s.discountBanner}>
            <Text style={s.discountBannerLabel}>DISCOUNT ON MRP</Text>
            <Text style={s.discountBannerValue}>{discount}% OFF</Text>
          </View>
        )}
      </SectionCard>

      {/* Tax & GST */}
      <SectionCard
        title="TAX & GST"
        icon={<ReceiptText size={18} color={DS.secondary} />}
        styles={s}
      >
        <View style={s.divider} />
        <InfoRow label="GST Rate" value={`${product.tax_rate ?? 0}%`} styles={s} />
        <InfoRow label="CGST" value={`${cgst}%`} styles={s} />
        <InfoRow label="SGST" value={`${sgst}%`} styles={s} />
        <InfoRow label="IGST" value="0%" styles={s} />
        {product.hsn ? <InfoRow label="HSN Code" value={product.hsn} styles={s} /> : null}
      </SectionCard>
    </View>
  );
};

// ─── Tab: Inventory ─────────────────────────────────────────────────────────
const InventoryTab: React.FC<{
  product: Product;
  styles: ReturnType<typeof createStyles>;
}> = ({ product, styles: s }) => {
  const lowStock =
    product.low_stock_threshold != null &&
    product.stock_quantity <= product.low_stock_threshold;

  return (
    <View style={s.tabContent}>
      {/* Stock Health card */}
      <View style={s.stockHealthCard}>
        <View style={s.stockHealthUpper}>
          <View>
            <Text style={s.stockHealthLabel}>ON HAND STOCK</Text>
            <View style={s.stockQtyRow}>
              <Text style={s.stockQtyValue}>{product.stock_quantity ?? 0}</Text>
              {product.unit ? (
                <Text style={s.stockQtyUnit}>{product.unit.toUpperCase()}</Text>
              ) : null}
            </View>
          </View>
          {product.low_stock_threshold != null && (
            <View style={s.stockThresholdBlock}>
              <Text style={s.stockHealthLabel}>THRESHOLD</Text>
              <Text style={[s.stockThresholdValue, lowStock && { color: DS.tertiary }]}>
                {product.low_stock_threshold} {product.unit || ''}
              </Text>
            </View>
          )}
        </View>

        {lowStock && (
          <View style={s.lowStockBanner}>
            <Info size={14} color={DS.tertiary} />
            <Text style={s.lowStockBannerText}>Low stock — consider restocking</Text>
          </View>
        )}

        <View style={s.stockTrackedRow}>
          <Text style={s.stockTrackedLabel}>
            Inventory tracked: {product.is_inventory_tracked !== false ? 'Yes' : 'No'}
          </Text>
          <View style={[s.trackToggle, product.is_inventory_tracked === false && s.trackToggleOff]}>
            <View style={[s.trackToggleThumb, product.is_inventory_tracked === false && s.trackToggleThumbOff]} />
          </View>
        </View>
      </View>

      {/* Inventory details */}
      <SectionCard title="INVENTORY DETAILS" styles={s}>
        <View style={s.divider} />
        <InfoRow label="Unit" value={product.unit || '—'} styles={s} />
        <InfoRow
          label="Low Stock Alert"
          value={product.low_stock_threshold != null ? String(product.low_stock_threshold) : 'Not set'}
          valueColor={lowStock ? DS.tertiary : undefined}
          styles={s}
        />
        <InfoRow
          label="Expiry Date"
          value={formatDate(product.expiry_date)}
          valueColor={product.expiry_date ? DS.tertiary : undefined}
          styles={s}
        />
      </SectionCard>
    </View>
  );
};

// ─── Tab: More ──────────────────────────────────────────────────────────────
const MoreTab: React.FC<{
  product: Product;
  styles: ReturnType<typeof createStyles>;
}> = ({ product, styles: s }) => (
  <View style={s.tabContent}>
    {/* Notes & Compliance */}
    <SectionCard title="NOTES & COMPLIANCE" icon={<Info size={18} color={DS.secondary} />} styles={s}>
      <View style={s.divider} />
      {product.description ? (
        <View style={s.descriptionBlock}>
          <Text style={s.infoRowLabel}>Description</Text>
          <Text style={[s.descriptionText, { marginTop: 6 }]}>{product.description}</Text>
        </View>
      ) : (
        <Text style={s.emptyNote}>No description added yet.</Text>
      )}
      {product.hsn ? <InfoRow label="HSN Code" value={product.hsn} styles={s} /> : null}
      <InfoRow
        label="Expiry Date"
        value={formatDate(product.expiry_date)}
        valueColor={product.expiry_date ? DS.tertiary : undefined}
        styles={s}
      />
    </SectionCard>

    {/* Meta */}
    <View style={[s.sectionCard, { backgroundColor: DS.surfaceContainerLow }]}>
      <View style={s.metaGrid}>
        <View style={s.metaBlock}>
          <Text style={s.metaLabel}>CREATED</Text>
          <Text style={s.metaValue}>{formatDate(product.created_at)}</Text>
        </View>
        <View style={s.metaBlock}>
          <Text style={s.metaLabel}>LAST UPDATED</Text>
          <Text style={s.metaValue}>{formatDate(product.updated_at)}</Text>
        </View>
      </View>
      {product.id ? (
        <View style={s.productIdBlock}>
          <Text style={s.metaLabel}>PRODUCT ID</Text>
          <Text style={s.productIdText} numberOfLines={1} ellipsizeMode="tail">
            {product.id}
          </Text>
        </View>
      ) : null}
    </View>
  </View>
);

// ─── Main Screen ────────────────────────────────────────────────────────────
const ProductDetailScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation = useNavigation<any>();
  const route = useRoute<ProductDetailRoute>();
  const product = route.params?.product ?? EMPTY_PRODUCT;
  const [activeTab, setActiveTab] = React.useState<TabKey>('overview');

  const handleEditProduct = React.useCallback(() => {
    navigation.navigate('ProductForm', { mode: 'edit', product });
  }, [navigation, product]);

  return (
    <View style={styles.screen}>
      <DetailHeader
        title="Item Details"
        actions={[
          {
            icon: <Share2 size={18} color={tokens.foreground} />,
            onPress: () => {},
            accessibilityLabel: 'Share product',
          },
          {
            icon: <Printer size={18} color={tokens.foreground} />,
            onPress: () => {},
            accessibilityLabel: 'Print product',
          },
          {
            icon: <MoreHorizontal size={18} color={tokens.foreground} />,
            onPress: () => {},
            accessibilityLabel: 'More options',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* Index 0: Hero (not sticky) */}
        <HeroCard product={product} styles={styles} />

        {/* Index 1: Tab bar (sticky) */}
        <TabBar active={activeTab} onChange={setActiveTab} styles={styles} />

        {/* Index 2: Tab content */}
        {activeTab === 'overview' && (
          <OverviewTab product={product} onEdit={handleEditProduct} styles={styles} />
        )}
        {activeTab === 'pricing' && <PricingTab product={product} styles={styles} />}
        {activeTab === 'inventory' && <InventoryTab product={product} styles={styles} />}
        {activeTab === 'more' && <MoreTab product={product} styles={styles} />}
      </ScrollView>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: DS.surface,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // ── Hero Card ──
    heroCard: {
      margin: 16,
      marginBottom: 0,
      backgroundColor: DS.surfaceCard,
      borderRadius: DS.radius24,
      padding: 20,
      borderWidth: 1,
      borderColor: DS.outlineVariant,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    heroRow: {
      flexDirection: 'row',
      gap: 14,
    },
    heroIcon: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: DS.greenContainerBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroCopy: {
      flex: 1,
      justifyContent: 'center',
    },
    heroName: {
      fontSize: 18,
      fontWeight: '800',
      color: DS.onSurface,
      letterSpacing: -0.3,
      marginBottom: 8,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    chipSecondary: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: DS.surfaceContainerHighest,
    },
    chipSecondaryText: {
      fontSize: 9,
      fontWeight: '700',
      color: DS.secondary,
      letterSpacing: 0.5,
    },
    chipPrimary: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: DS.greenContainerBg,
    },
    chipPrimaryText: {
      fontSize: 9,
      fontWeight: '700',
      color: DS.green,
      letterSpacing: 0.5,
    },
    chipOutline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: 'rgba(83,224,118,0.15)',
    },
    chipInactive: {
      backgroundColor: DS.surfaceContainerHighest,
    },
    chipDot: {
      width: 5,
      height: 5,
      borderRadius: 99,
      backgroundColor: DS.greenContainer,
    },
    chipDotInactive: {
      backgroundColor: DS.secondary,
    },
    chipOutlineText: {
      fontSize: 9,
      fontWeight: '700',
      color: DS.green,
      letterSpacing: 0.5,
    },
    chipInactiveText: {
      color: DS.secondary,
    },
    chipDiscount: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: DS.tertiaryLight,
    },
    chipDiscountText: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.tertiary,
      letterSpacing: 0.5,
    },
    heroFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: DS.outlineVariant,
    },
    heroFooterRight: {
      alignItems: 'flex-end',
    },
    heroFooterLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.onSurfaceVariant,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    heroFooterValue: {
      fontSize: 12,
      fontWeight: '600',
      color: DS.onSurface,
    },

    // ── Tab Bar ──
    tabBar: {
      backgroundColor: DS.surface,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: DS.outlineVariant,
    },
    tabBarContent: {
      gap: 8,
      flexDirection: 'row',
    },
    tabPill: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: 'transparent',
    },
    tabPillActive: {
      backgroundColor: DS.greenContainer,
      shadowColor: DS.greenContainer,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    },
    tabPillText: {
      fontSize: 13,
      fontWeight: '600',
      color: DS.onSurfaceVariant,
    },
    tabPillTextActive: {
      color: '#fff',
      fontWeight: '700',
    },

    // ── Tab Content ──
    tabContent: {
      padding: 16,
      gap: 14,
    },

    // ── Overview: Action Row ──
    actionRow: {
      flexDirection: 'row',
      gap: 12,
    },
    primaryBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: DS.green,
      paddingVertical: 14,
      borderRadius: DS.radius16,
      shadowColor: DS.green,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryBtnText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
    },

    // ── Overview: 4-stat grid ──
    statGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      width: '47%',
      backgroundColor: DS.surfaceCard,
      borderRadius: DS.radius16,
      padding: 14,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    statCardGreen: {},
    statCardRed: {},
    statAccentBarGreen: {
      position: 'absolute',
      left: 0,
      top: '25%',
      bottom: '25%',
      width: 3,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: DS.greenContainer,
    },
    statAccentBarRed: {
      position: 'absolute',
      left: 0,
      top: '25%',
      bottom: '25%',
      width: 3,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: '#ff767b',
    },
    statLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.secondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '800',
      color: DS.onSurface,
      letterSpacing: -0.5,
    },
    statSubtext: {
      fontSize: 9,
      fontWeight: '500',
      color: DS.onSurfaceVariant,
      marginTop: 2,
    },
    marginChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      marginTop: 2,
    },
    marginChipText: {
      fontSize: 9,
      fontWeight: '700',
      color: DS.green,
    },

    // ── Section Card ──
    sectionCard: {
      backgroundColor: DS.surfaceCard,
      borderRadius: DS.radius24,
      padding: 20,
      borderWidth: 1,
      borderColor: DS.outlineVariant,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 2,
    },
    sectionAccentBar: {
      width: 3,
      height: 20,
      borderRadius: 4,
      backgroundColor: DS.greenContainer,
    },
    sectionIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: DS.greenDim,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: DS.onSurface,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    divider: {
      height: 1,
      backgroundColor: DS.outlineVariant,
      marginVertical: 12,
    },

    // ── Info rows ──
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: DS.outlineVariant,
    },
    infoRowLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: DS.onSurfaceVariant,
    },
    infoRowValue: {
      fontSize: 13,
      fontWeight: '700',
      color: DS.onSurface,
    },
    descriptionBlock: {
      paddingVertical: 8,
    },
    descriptionText: {
      fontSize: 13,
      fontWeight: '500',
      color: DS.onSurface,
      lineHeight: 20,
    },
    emptyNote: {
      fontSize: 13,
      color: DS.onSurfaceVariant,
      fontStyle: 'italic',
      paddingVertical: 8,
    },

    // ── Pricing: Discount Banner ──
    discountBanner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: DS.outlineVariant,
    },
    discountBannerLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.onSurfaceVariant,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    discountBannerValue: {
      fontSize: 14,
      fontWeight: '900',
      color: DS.green,
    },

    // ── Inventory: Stock Health Card ──
    stockHealthCard: {
      backgroundColor: DS.surfaceCard,
      borderRadius: DS.radius24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: DS.outlineVariant,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    stockHealthUpper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
    },
    stockHealthLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.secondary,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    stockQtyRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
    },
    stockQtyValue: {
      fontSize: 32,
      fontWeight: '900',
      color: DS.onSurface,
      letterSpacing: -1,
    },
    stockQtyUnit: {
      fontSize: 13,
      fontWeight: '700',
      color: DS.secondary,
    },
    stockThresholdBlock: {
      alignItems: 'flex-end',
    },
    stockThresholdValue: {
      fontSize: 14,
      fontWeight: '700',
      color: DS.onSurface,
    },
    lowStockBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: DS.tertiaryLight,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    lowStockBannerText: {
      fontSize: 12,
      fontWeight: '700',
      color: DS.tertiary,
    },
    stockTrackedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: DS.outlineVariant,
    },
    stockTrackedLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: DS.onSurfaceVariant,
    },
    trackToggle: {
      width: 38,
      height: 22,
      borderRadius: 99,
      backgroundColor: DS.green,
      justifyContent: 'center',
      paddingHorizontal: 3,
      alignItems: 'flex-end',
    },
    trackToggleOff: {
      backgroundColor: DS.surfaceContainerHighest,
      alignItems: 'flex-start',
    },
    trackToggleThumb: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#fff',
    },
    trackToggleThumbOff: {},

    // ── More: Meta ──
    metaGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 12,
    },
    metaBlock: {
      flex: 1,
    },
    metaLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: DS.onSurfaceVariant,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    metaValue: {
      fontSize: 13,
      fontWeight: '700',
      color: DS.onSurface,
    },
    productIdBlock: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: DS.outlineVariant,
    },
    productIdText: {
      fontSize: 11,
      fontFamily: 'monospace',
      color: DS.secondary,
      backgroundColor: DS.surfaceContainerHigh,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginTop: 4,
    },
  });

export default ProductDetailScreen;
