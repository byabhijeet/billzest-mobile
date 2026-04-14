import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Inbox, Receipt } from "lucide-react-native";
import { ThemeTokens } from "../../../theme/tokens";

interface InvoiceBottomBarProps {
  onDraft: () => void;
  onGenerate: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  tokens: ThemeTokens;
}

const InvoiceBottomBar: React.FC<InvoiceBottomBarProps> = ({
  onDraft,
  onGenerate,
  isSubmitting,
  isEditMode,
  tokens,
}) => {
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarInner}>
        <Pressable style={styles.draftButton} onPress={onDraft}>
          <Inbox size={18} color={tokens.primary} />
          <Text style={styles.draftText}>Save Draft</Text>
        </Pressable>
        <Pressable
          style={[styles.generateButton, isSubmitting && { opacity: 0.7 }]}
          onPress={onGenerate}
          disabled={isSubmitting}
        >
          <Receipt size={18} color="#fff" />
          <Text style={styles.generateText}>
            {isSubmitting
              ? "Saving…"
              : isEditMode
              ? "Update Bill"
              : "Generate Bill"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (tokens: ThemeTokens) =>
  StyleSheet.create({
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: tokens.card + "E0",
      borderTopWidth: 1,
      borderTopColor: tokens.border + "20",
      paddingBottom: 28,
    },
    bottomBarInner: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    draftButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderWidth: 1.5,
      borderColor: tokens.primary + "40",
      borderRadius: 14,
      paddingVertical: 14,
    },
    draftText: { fontSize: 14, fontWeight: "600", color: tokens.primary },
    generateButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: tokens.primary,
      borderRadius: 14,
      paddingVertical: 14,
      shadowColor: tokens.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 6,
    },
    generateText: {
      fontSize: 14,
      fontWeight: "700",
      color: tokens.primaryForeground,
    },
  });

export default InvoiceBottomBar;
