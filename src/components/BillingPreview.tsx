import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeTokens } from '../theme/ThemeProvider';
import { ThemeTokens } from '../theme/tokens';
import DetailRow from './ui/DetailRow';

export type BillLineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type BillPreviewProps = {
  status: string;
  numberLabel: string;
  numberValue: string;
  primaryDateLabel: string;
  primaryDateValue: string;
  secondaryDateLabel?: string;
  secondaryDateValue?: string;
  partyLabel: string;
  partyName: string;
  partySubValue?: string;
  subtotal: number;
  taxAmount?: number;
  totalAmount: number;
  notes?: string;
  items: BillLineItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value || 0);

const BillingPreview: React.FC<BillPreviewProps> = props => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);

  const {
    status,
    numberLabel,
    numberValue,
    primaryDateLabel,
    primaryDateValue,
    secondaryDateLabel,
    secondaryDateValue,
    partyLabel,
    partyName,
    partySubValue,
    subtotal,
    taxAmount = 0,
    totalAmount,
    notes,
    items,
  } = props;

  return (
    <View style={styles.invoiceCard}>
      <View style={styles.brandRow}>
        <View>
          <Text style={styles.brandName}>BillZest Retailers</Text>
          <Text style={styles.brandMeta}>GSTIN: 27AAACB2230M1ZT</Text>
          <Text style={styles.brandMeta}>
            402, Skylark Business Park, Mumbai
          </Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaBadgeLabel}>{status?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.metaGrid}>
        <DetailRow
          label={numberLabel}
          value={numberValue}
          variant="card"
          style={styles.metaBlock}
        />
        <DetailRow
          label={primaryDateLabel}
          value={primaryDateValue}
          variant="card"
          style={styles.metaBlock}
        />
        {secondaryDateLabel && secondaryDateValue ? (
          <DetailRow
            label={secondaryDateLabel}
            value={secondaryDateValue}
            variant="card"
            style={styles.metaBlock}
          />
        ) : null}
      </View>

      <View style={styles.billToRow}>
        <DetailRow
          label={partyLabel}
          value={partyName || 'Unknown'}
          subValue={partySubValue}
          variant="card"
          style={styles.billToBlock}
        />
        <DetailRow
          label="Payment Terms"
          value="15 days credit"
          subValue="UPI · Bank Transfer"
          variant="card"
          style={styles.billToBlock}
        />
      </View>

      <View style={styles.itemsTable}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.colDescription, styles.headerText]}>
            Description
          </Text>
          <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
          <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
          <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
        </View>
        {items.map(item => {
          const amount = item.rate * item.quantity;
          return (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{formatCurrency(item.rate)}</Text>
              <Text style={styles.colAmount}>{formatCurrency(amount)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>GST (18%)</Text>
          <Text style={styles.totalValue}>{formatCurrency(taxAmount)}</Text>
        </View>
        <View style={styles.totalDivider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabelBold}>Grand Total</Text>
          <Text style={styles.totalValueBold}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteTitle}>Notes</Text>
        <Text style={styles.footerNoteText}>
          {notes?.trim() ||
            'Thank you for shopping with us. This invoice was generated from BillZest.'}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    invoiceCard: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: tokens.border,
      backgroundColor: tokens.card,
      padding: 24,
      marginBottom: 20,
    },
    brandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 18,
    },
    brandName: {
      fontSize: 20,
      fontWeight: '700',
      color: tokens.foreground,
    },
    brandMeta: {
      color: tokens.mutedForeground,
      marginTop: 4,
    },
    metaBadge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: tokens.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: tokens.background,
    },
    metaBadgeLabel: {
      fontWeight: '700',
      color: tokens.primary,
    },
    metaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
      marginBottom: 16,
    },
    metaBlock: {
      flex: 1,
      marginHorizontal: 6,
      marginBottom: 12,
    },
    billToRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
      marginBottom: 16,
    },
    billToBlock: {
      flex: 1,
      marginHorizontal: 6,
      marginBottom: 12,
    },
    itemsTable: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      marginBottom: 18,
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    },
    tableHeader: {
      backgroundColor: tokens.background,
    },
    headerText: {
      color: tokens.mutedForeground,
      fontWeight: '600',
    },
    colDescription: {
      flex: 2,
      color: tokens.foreground,
    },
    colQty: {
      flex: 0.5,
      color: tokens.foreground,
      textAlign: 'center',
    },
    colRate: {
      flex: 1,
      color: tokens.foreground,
      textAlign: 'right',
    },
    colAmount: {
      flex: 1,
      color: tokens.foreground,
      textAlign: 'right',
    },
    totalCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: tokens.border,
      padding: 18,
      marginBottom: 16,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    totalLabel: {
      color: tokens.mutedForeground,
    },
    totalValue: {
      color: tokens.foreground,
      fontWeight: '600',
    },
    totalLabelBold: {
      color: tokens.foreground,
      fontWeight: '700',
    },
    totalValueBold: {
      color: tokens.foreground,
      fontWeight: '700',
      fontSize: 18,
    },
    totalDivider: {
      height: 1,
      backgroundColor: tokens.border,
      marginVertical: 10,
    },
    footerNote: {
      marginTop: 6,
    },
    footerNoteTitle: {
      fontWeight: '600',
      color: tokens.foreground,
      marginBottom: 6,
    },
    footerNoteText: {
      color: tokens.mutedForeground,
      lineHeight: 20,
    },
  });

export default BillingPreview;
