import {
  Platform,
  Animated,
  Easing,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useEffect, useRef } from "react";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeTokens } from "../../theme/ThemeProvider";
import { ThemeTokens } from "../../theme/tokens";
import DetailHeader from "../../components/DetailHeader";
import {
  Share2,
  Printer,
  Download,
  CreditCard,
  X,
  Edit,
  Send,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react-native";
import { pdfService } from "../../services/pdfService";
import type { InvoicesStackParamList } from "../../navigation/types";
import {
  validateInvoiceIntegrity,
  calculateRepairedTotals,
} from "../../utils/reconciliation";
import {
  useRecordOrderPayment,
  useOrderDetail,
  useUpdateOrderStatus,
  useUpdateOrder,
} from "../../logic/orderLogic";

const PulsingBadge: React.FC<{
  label: string;
  color: string;
  bgColor: string;
}> = ({ label, color, bgColor }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View
      style={{
        backgroundColor: bgColor,
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Animated.View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          opacity: pulseAnim,
        }}
      />
      <Text
        style={{
          fontSize: 10,
          fontWeight: "800",
          color: color,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

export type BillLineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

const formatCurrency = (value: number) =>
  `₹${(value ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

type InvoiceSummary = {
  id: string;
  invoice_number: string;
  client_name: string;
  created_at: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
};

type InvoiceDetailRoute = RouteProp<InvoicesStackParamList, "InvoiceDetail">;

const EMPTY_INVOICE: InvoiceSummary = {
  id: "",
  invoice_number: "",
  client_name: "",
  created_at: "",
  status: "draft",
  subtotal: 0,
  tax_amount: 0,
  total_amount: 0,
};

// Status workflow validation
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const getStatusTransitions = (currentStatus?: string): InvoiceStatus[] => {
  if (!currentStatus) return [];
  const status = currentStatus.toLowerCase() as InvoiceStatus;

  switch (status) {
    case "draft":
      return ["sent"];
    case "sent":
      return ["paid", "overdue"];
    case "overdue":
      return ["paid"];
    case "paid":
    case "cancelled":
    default:
      return [];
  }
};

const getStatusLabel = (status?: string): string => {
  if (!status) return "Draft";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const InvoiceDetailScreen: React.FC = () => {
  const { tokens } = useThemeTokens();
  const styles = React.useMemo(() => createStyles(tokens), [tokens]);
  const navigation =
    useNavigation<NativeStackNavigationProp<InvoicesStackParamList>>();
  const route = useRoute<InvoiceDetailRoute>();
  const routeInvoice = route.params?.invoice ?? EMPTY_INVOICE;

  const { data: fullInvoice, isLoading: isLoadingInvoice } = useOrderDetail(
    routeInvoice.id,
  );

  const invoice = fullInvoice || routeInvoice;
  const subtotal =
    invoice.subtotal ?? invoice.total_amount - (invoice.tax_amount || 0);

  const { mutate: recordPayment, isPending: isRecordingPayment } =
    useRecordOrderPayment();

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();

  const { mutate: updateOrder, isPending: isRepairing } = useUpdateOrder();

  const reconciliation = useMemo(() => {
    if (!fullInvoice) return null;
    return validateInvoiceIntegrity(fullInvoice);
  }, [fullInvoice]);

  const handleRepair = React.useCallback(() => {
    if (!fullInvoice?.items) return;
    const repairedTotals = calculateRepairedTotals(fullInvoice.items);
    Alert.alert(
      "Repair Invoice?",
      "Recalculate header totals based on line items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Repair & Sync",
          onPress: () => {
            updateOrder({ orderId: fullInvoice.id, order: repairedTotals });
          },
        },
      ],
    );
  }, [fullInvoice, updateOrder]);

  const lineItems: BillLineItem[] = useMemo(() => {
    if (fullInvoice?.items) {
      return fullInvoice.items.map((item, index) => ({
        id: item.id || `item-${index}`,
        description: item.product_name,
        quantity: item.quantity,
        rate: item.unit_price,
      }));
    }
    return [];
  }, [fullInvoice]);

  const calculatedTaxAmount = useMemo(() => {
    if (fullInvoice?.items) {
      return fullInvoice.items.reduce((total, item) => {
        const itemTotal = item.quantity * item.unit_price;
        const gstRate = item.gst_rate || 0;
        return total + (itemTotal * gstRate) / 100;
      }, 0);
    }
    return 0;
  }, [fullInvoice]);

  const taxAmount = invoice.tax_amount && invoice.tax_amount > 0
      ? invoice.tax_amount
      : calculatedTaxAmount;

  const handleShare = React.useCallback(async () => {
    if (!fullInvoice) return;
    try {
      await pdfService.shareInvoiceAsPDF(fullInvoice);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to share");
    }
  }, [fullInvoice]);

  const handleDownload = React.useCallback(async () => {
    if (!fullInvoice) return;
    try {
      await pdfService.generateInvoicePDF(fullInvoice);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to download");
    }
  }, [fullInvoice]);

  const handlePrint = React.useCallback(() => {
    Alert.alert("Print", "Coming soon. Use Share for now.");
  }, []);

  const handleCancel = React.useCallback(async () => {
    if (!invoice?.id) return;
    Alert.alert(
      "Cancel Invoice",
      "Are you sure? Stock will be restored.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const { ordersService } = await import("../../supabase/ordersService");
              await ordersService.cancelOrder((invoice as any).organization_id || "", invoice.id);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  }, [invoice, navigation]);

  const handleCollect = React.useCallback(() => {
    if (!invoice?.id) return;
    recordPayment(
      { orderId: invoice.id, amount: invoice.total_amount },
      { onError: (error) => Alert.alert("Payment failed", error.message) }
    );
  }, [invoice, recordPayment]);

  const handleEdit = React.useCallback(() => {
    if (!invoice?.id) return;
    navigation.navigate("AddSale", { orderId: invoice.id, initialMode: "sale" });
  }, [invoice, navigation]);

  const handleStatusChange = React.useCallback(
    (newStatus: string) => {
      if (!invoice?.id) return;
      updateStatus(
        { orderId: invoice.id, status: newStatus },
        { onSuccess: () => Alert.alert("Success", "Status updated") }
      );
    },
    [invoice, updateStatus],
  );

  if (isLoadingInvoice && !fullInvoice) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <DetailHeader
        title="Invoice Details"
        actions={[
          { icon: <Edit size={18} color={tokens.foreground} />, onPress: handleEdit },
          { icon: <Share2 size={18} color={tokens.foreground} />, onPress: handleShare },
          { icon: <Download size={18} color={tokens.foreground} />, onPress: handleDownload },
          { icon: <Printer size={18} color={tokens.foreground} />, onPress: handlePrint },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {reconciliation && !reconciliation.isValid && (
          <View style={styles.mismatchBanner}>
            <View style={styles.mismatchIconWrap}><AlertTriangle size={20} color={tokens.destructive} /></View>
            <View style={styles.mismatchCopy}>
              <Text style={styles.mismatchTitle}>Data Integrity Error</Text>
              <Text style={styles.mismatchText}>Total mismatch: recorded vs items.</Text>
            </View>
            <Pressable style={styles.repairButton} onPress={handleRepair} disabled={isRepairing}>
              <RefreshCw size={14} color={tokens.white} />
              <Text style={styles.repairButtonText}>Repair</Text>
            </Pressable>
          </View>
        )}

        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <PulsingBadge
              label={invoice.status || "DRAFT"}
              color={
                invoice.status === "paid"
                  ? tokens.success
                  : invoice.status === "cancelled"
                    ? tokens.destructive
                    : tokens.primary
              }
              bgColor={
                invoice.status === "paid"
                  ? tokens.primaryAlpha15
                  : invoice.status === "cancelled"
                    ? tokens.destructiveAlpha15
                    : tokens.primaryAlpha15
              }
            />
            <Text style={styles.totalAmountHero}>{formatCurrency(invoice.total_amount)}</Text>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.partyNameHero}>{fullInvoice?.party?.name || (invoice as any).client_name || "Customer"}</Text>
            {(fullInvoice?.party as any)?.phone && <Text style={styles.partyPhoneHero}>{(fullInvoice?.party as any).phone}</Text>}
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.metaGridContainer}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabelAlt}>INVOICE NO</Text>
              <Text style={styles.metaValueAlt}>#{invoice.invoice_number}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabelAlt}>ISSUE DATE</Text>
              <Text style={styles.metaValueAlt}>{new Date(invoice.created_at || new Date()).toLocaleDateString("en-IN")}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabelAlt}>DUE DATE</Text>
              <Text style={styles.metaValueAlt}>{(fullInvoice?.party as any)?.due_date ? new Date((fullInvoice?.party as any).due_date).toLocaleDateString("en-IN") : "N/A"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabelAlt}>STATUS</Text>
              <Text style={[styles.metaValueAlt, { color: tokens.primary }]}>{(invoice.status || "DRAFT").toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Billed To */}
        {fullInvoice?.party && (
          <View style={styles.billedToCard}>
            <Text style={styles.metaLabelAlt}>BILLED TO</Text>
            <Text style={styles.partyNameBilled}>{fullInvoice.party.name}</Text>
            {fullInvoice.party.gst_number && <Text style={styles.billedMetaText}>GSTIN: {fullInvoice.party.gst_number}</Text>}
            {fullInvoice.party.address && <Text style={styles.billedMetaText}>{fullInvoice.party.address}</Text>}
          </View>
        )}

        {/* Line Items */}
        <View style={styles.lineItemsSection}>
          <View style={styles.sectionHeaderAlt}>
            <Text style={styles.sectionTitleAlt}>LINE ITEMS</Text>
            <Text style={styles.itemCountAlt}>{lineItems.length} ITEMS</Text>
          </View>
          <View style={styles.itemsContainer}>
            {lineItems.map((item, index) => (
              <View key={item.id} style={[styles.itemRowAlt, index === lineItems.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.itemInfoAlt}>
                  <Text style={styles.itemNameAlt}>{item.description}</Text>
                  <Text style={styles.itemMetaAlt}>Qty {item.quantity} × {formatCurrency(item.rate)}</Text>
                </View>
                <Text style={styles.itemAmountAlt}>{formatCurrency(item.rate * item.quantity)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summaryStackAlt}>
            <View style={styles.summaryRowAlt}><Text style={styles.summaryLabelAlt}>Subtotal</Text><Text style={styles.summaryValueAlt}>{formatCurrency(subtotal)}</Text></View>
            <View style={styles.summaryRowAlt}><Text style={styles.summaryLabelAlt}>GST (18%)</Text><Text style={styles.summaryValueAlt}>{formatCurrency(taxAmount)}</Text></View>
            <View style={styles.summaryDividerAlt} />
            <View style={styles.summaryRowAlt}><Text style={styles.grandTotalLabelAlt}>Grand Total</Text><Text style={styles.grandTotalValueAlt}>{formatCurrency(invoice.total_amount)}</Text></View>
          </View>
        </View>

        <View style={styles.footerNoteAlt}>
          <Text style={styles.footerNoteTitleAlt}>NOTES</Text>
          <Text style={styles.footerNoteTextAlt}>{invoice.notes || "Thank you for your business."}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.stickyBottomNav}>
        <View style={styles.bottomActions}>
          {getStatusTransitions(invoice.status).length > 0 ? (
            <>
              <Pressable style={[styles.bottomButton, styles.bottomButtonSecondary]} onPress={() => Alert.alert("Reminder", "Sent")}>
                <Send size={18} color={tokens.foreground} /><Text style={styles.bottomButtonTextSecondary}>REMINDER</Text>
              </Pressable>
              <Pressable style={[styles.bottomButton, styles.bottomButtonPrimary]} onPress={() => handleStatusChange("paid")} disabled={isUpdatingStatus}>
                <CheckCircle size={18} color={tokens.primaryForeground} /><Text style={styles.bottomButtonTextPrimary}>MARK AS PAID</Text>
              </Pressable>
            </>
          ) : invoice.status !== "paid" && invoice.status !== "cancelled" ? (
            <>
              <Pressable style={[styles.bottomButton, styles.bottomButtonDanger]} onPress={handleCancel}>
                <X size={18} color={tokens.destructive} /><Text style={styles.bottomButtonTextDanger}>CANCEL</Text>
              </Pressable>
              <Pressable style={[styles.bottomButton, styles.bottomButtonPrimary]} onPress={handleCollect} disabled={isRecordingPayment}>
                <CreditCard size={18} color={tokens.primaryForeground} /><Text style={styles.bottomButtonTextPrimary}>COLLECT</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={[styles.bottomButton, styles.bottomButtonSecondary, { flex: 1 }]} onPress={handleShare}>
              <Share2 size={18} color={tokens.foreground} /><Text style={styles.bottomButtonTextSecondary}>SHARE</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: tokens.background },
    content: { padding: tokens.spacingMd, paddingBottom: 100 },
    mismatchBanner: {
      flexDirection: "row",
      backgroundColor: tokens.destructiveAlpha10,
      padding: tokens.spacingMd,
      borderRadius: tokens.radiusMd,
      alignItems: "center",
      marginBottom: tokens.spacingMd,
    },
    mismatchIconWrap: { marginRight: tokens.spacingSm },
    mismatchCopy: { flex: 1 },
    mismatchTitle: { fontSize: 14, fontWeight: "700", color: tokens.destructive },
    mismatchText: { fontSize: 12, color: tokens.destructive, opacity: 0.8 },
    repairButton: {
      backgroundColor: tokens.destructive,
      paddingHorizontal: tokens.spacingMd,
      paddingVertical: tokens.spacingXs,
      borderRadius: tokens.radiusSm,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    repairButtonText: { color: tokens.white, fontSize: 12, fontWeight: "600" },

    // Hero Section
    heroCard: {
      backgroundColor: tokens.surface_container_lowest,
      padding: tokens.spacingLg,
      borderRadius: tokens.radiusLg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: tokens.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
      marginBottom: tokens.spacingMd,
    },
    heroLeft: { flex: 1, gap: 8 },
    totalAmountHero: { fontSize: 36, fontWeight: "900", color: tokens.foreground, letterSpacing: -1 },
    heroRight: { alignItems: "flex-end" },
    partyNameHero: { fontSize: 16, fontWeight: "800", color: tokens.foreground },
    partyPhoneHero: { fontSize: 12, fontWeight: "500", color: tokens.mutedForeground },

    // Info Grid
    metaGridContainer: { marginBottom: tokens.spacingMd, gap: tokens.spacingSm },
    metaRow: { flexDirection: "row", gap: tokens.spacingSm },
    metaItem: { flex: 1, backgroundColor: tokens.surface_container_low, padding: tokens.spacingMd, borderRadius: tokens.radiusMd },
    metaLabelAlt: { fontSize: 10, fontWeight: "800", color: tokens.mutedForeground, letterSpacing: 0.5, marginBottom: 2 },
    metaValueAlt: { fontSize: 14, fontWeight: "700", color: tokens.foreground },

    // Billed To
    billedToCard: { backgroundColor: tokens.surface_container_lowest, padding: tokens.spacingMd, borderRadius: tokens.radiusMd, marginBottom: tokens.spacingMd, gap: 2 },
    partyNameBilled: { fontSize: 14, fontWeight: "700", color: tokens.foreground },
    billedMetaText: { fontSize: 12, color: tokens.mutedForeground, lineHeight: 18 },

    // Line Items Section
    lineItemsSection: { backgroundColor: tokens.surface_container_lowest, borderRadius: tokens.radiusLg, overflow: "hidden", marginBottom: tokens.spacingMd },
    sectionHeaderAlt: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: tokens.spacingMd, backgroundColor: `${tokens.surface_container_low}50` },
    sectionTitleAlt: { fontSize: 10, fontWeight: "900", color: tokens.mutedForeground, letterSpacing: 1 },
    itemCountAlt: { fontSize: 10, fontWeight: "900", color: tokens.primary },
    itemsContainer: { paddingHorizontal: tokens.spacingMd },
    itemRowAlt: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: tokens.spacingMd, borderBottomWidth: 0.5, borderBottomColor: `${tokens.mutedForeground}20` },
    itemInfoAlt: { flex: 1 },
    itemNameAlt: { fontSize: 14, fontWeight: "700", color: tokens.foreground, marginBottom: 2 },
    itemMetaAlt: { fontSize: 11, color: tokens.mutedForeground },
    itemAmountAlt: { fontSize: 14, fontWeight: "800", color: tokens.foreground },

    // Summary Stack
    summaryStackAlt: { backgroundColor: `${tokens.surface_container_low}30`, padding: tokens.spacingMd, gap: 8 },
    summaryRowAlt: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    summaryLabelAlt: { fontSize: 12, fontWeight: "500", color: tokens.mutedForeground },
    summaryValueAlt: { fontSize: 12, fontWeight: "700", color: tokens.foreground },
    summaryDividerAlt: { height: 1, borderStyle: "dashed", borderColor: `${tokens.mutedForeground}30`, borderWidth: 0.5, marginVertical: 4 },
    grandTotalLabelAlt: { fontSize: 14, fontWeight: "800", color: tokens.foreground },
    grandTotalValueAlt: { fontSize: 20, fontWeight: "900", color: tokens.primary },

    footerNoteAlt: { padding: tokens.spacingMd, gap: 4 },
    footerNoteTitleAlt: { fontSize: 10, fontWeight: "800", color: tokens.mutedForeground, letterSpacing: 0.5 },
    footerNoteTextAlt: { fontSize: 12, color: tokens.mutedForeground, lineHeight: 18 },

    // Sticky Footer
    stickyBottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: tokens.background, padding: tokens.spacingLg, paddingBottom: Platform.OS === "ios" ? 32 : tokens.spacingLg, shadowColor: tokens.shadowColor, shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 10 },
    bottomActions: { flexDirection: "row", gap: tokens.spacingMd },
    bottomButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: tokens.radiusMd, gap: 8 },
    bottomButtonPrimary: { backgroundColor: tokens.primary, shadowColor: tokens.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    bottomButtonSecondary: { backgroundColor: tokens.surface_container_lowest, borderWidth: 1, borderColor: `${tokens.mutedForeground}20` },
    bottomButtonDanger: { backgroundColor: tokens.surface_container_low, borderWidth: 1, borderColor: `${tokens.destructive}30` },
    bottomButtonTextPrimary: { fontSize: 12, fontWeight: "800", color: tokens.primaryForeground, letterSpacing: 0.5 },
    bottomButtonTextSecondary: { fontSize: 12, fontWeight: "800", color: tokens.foreground, letterSpacing: 0.5 },
    bottomButtonTextDanger: { fontSize: 12, fontWeight: "800", color: tokens.destructive, letterSpacing: 0.5 },
  });

export default InvoiceDetailScreen;
