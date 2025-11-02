import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  FlatList,
  Share,
  Animated,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

interface Transaction {
  id: string;
  deliveryId: string;
  amount: number;
  appFee: number;
  feePercentage: number;
  dateProcessed: string;
  status: "completed" | "pending";
}

const generateDummyTransactions = (): Transaction[] => [
  {
    id: "txn-1",
    deliveryId: "E-FGJHFSBN5",
    amount: 450.0,
    appFee: 67.5,
    feePercentage: 15,
    dateProcessed: "2025-11-01",
    status: "completed",
  },
  {
    id: "txn-2",
    deliveryId: "E-KJHSDFKJ2",
    amount: 320.0,
    appFee: 48.0,
    feePercentage: 15,
    dateProcessed: "2025-10-31",
    status: "completed",
  },
  {
    id: "txn-3",
    deliveryId: "E-LKJHSDFL3",
    amount: 580.0,
    appFee: 87.0,
    feePercentage: 15,
    dateProcessed: "2025-10-30",
    status: "completed",
  },
  {
    id: "txn-4",
    deliveryId: "E-MNBVCXZ4",
    amount: 275.0,
    appFee: 41.25,
    feePercentage: 15,
    dateProcessed: "2025-10-29",
    status: "completed",
  },
  {
    id: "txn-5",
    deliveryId: "E-QWERTYUI5",
    amount: 420.0,
    appFee: 63.0,
    feePercentage: 15,
    dateProcessed: "2025-10-28",
    status: "completed",
  },
  {
    id: "txn-6",
    deliveryId: "E-ASDFGHJK6",
    amount: 350.0,
    appFee: 52.5,
    feePercentage: 15,
    dateProcessed: "2025-10-27",
    status: "pending",
  },
  {
    id: "txn-7",
    deliveryId: "E-ZXCVBNM7",
    amount: 510.0,
    appFee: 76.5,
    feePercentage: 15,
    dateProcessed: "2025-10-26",
    status: "completed",
  },
  {
    id: "txn-8",
    deliveryId: "E-POIUYTRE8",
    amount: 395.0,
    appFee: 59.25,
    feePercentage: 15,
    dateProcessed: "2025-10-25",
    status: "completed",
  },
];

export default function EarningsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const transactions = generateDummyTransactions();

  const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFeesPaid = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.appFee, 0);
  const feeOwing = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.appFee, 0);

  const handleExportPDF = async () => {
    try {
      await Share.share({
        message: `📊 EARNINGS REPORT\n\n💰 Total Earnings: R${totalEarnings.toFixed(
          2
        )}\n📉 Total Fees Paid: R${totalFeesPaid.toFixed(
          2
        )}\n⚠️ Fee Owing: R${feeOwing.toFixed(
          2
        )}\n\n📋 TRANSACTION HISTORY\n${transactions
          .map(
            (t) =>
              `\nDelivery ID: ${t.deliveryId}\nDate: ${
                t.dateProcessed
              }\nGross: R${t.amount.toFixed(2)} | Fee: R${t.appFee.toFixed(
                2
              )} | Net: R${(t.amount - t.appFee).toFixed(
                2
              )}\nStatus: ${t.status.toUpperCase()}`
          )
          .join("\n")}\n\nGenerated from Earnings Screen`,
        title: "Earnings Report",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const TransactionCard = ({ item }: { item: Transaction }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.transactionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Collapsed View */}
        <View style={styles.transactionHeader}>
          <View style={styles.transactionLeft}>
            <View
              style={[
                styles.deliveryBadge,
                { backgroundColor: colors.tint + "20" },
              ]}
            >
              <Ionicons name="bicycle-outline" size={16} color={colors.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 13,
                  color: colors.text,
                }}
              >
                {item.deliveryId}
              </ThemedText>
              <ThemedText
                style={{
                  fontFamily: "poppinsLight",
                  fontSize: 11,
                  color: colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {item.dateProcessed}
              </ThemedText>
            </View>
          </View>

          <View style={styles.transactionRight}>
            <ThemedText
              style={{
                fontFamily: "poppinsBold",
                fontSize: 15,
                color: "#4CAF50",
              }}
            >
              R{(item.amount - item.appFee).toFixed(2)}
            </ThemedText>
            <View
              style={[
                styles.statusBadgeSmall,
                {
                  backgroundColor:
                    item.status === "completed" ? "#4CAF5020" : "#FF980020",
                },
              ]}
            >
              <Ionicons
                name={item.status === "completed" ? "checkmark" : "time"}
                size={12}
                color={item.status === "completed" ? "#4CAF50" : "#FF9800"}
              />
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 10,
                  color: item.status === "completed" ? "#4CAF50" : "#FF9800",
                  marginLeft: 2,
                }}
              >
                {item.status === "completed" ? "Done" : "Pending"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Expanded View */}
        {isExpanded && (
          <View
            style={[styles.expandedContent, { borderTopColor: colors.border }]}
          >
            <View style={styles.expandedRow}>
              <ThemedText
                style={{
                  fontFamily: "poppinsLight",
                  fontSize: 12,
                  color: colors.textSecondary,
                }}
              >
                Gross Amount
              </ThemedText>
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 13,
                  color: colors.text,
                }}
              >
                R{item.amount.toFixed(2)}
              </ThemedText>
            </View>

            <View style={styles.expandedRow}>
              <ThemedText
                style={{
                  fontFamily: "poppinsLight",
                  fontSize: 12,
                  color: colors.textSecondary,
                }}
              >
                App Fee ({item.feePercentage}%)
              </ThemedText>
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 13,
                  color: "#FF6B6B",
                }}
              >
                -R{item.appFee.toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={[
                styles.expandedRow,
                styles.netRow,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 12,
                  color: colors.text,
                }}
              >
                Net Earnings
              </ThemedText>
              <ThemedText
                style={{
                  fontFamily: "poppinsBold",
                  fontSize: 14,
                  color: "#4CAF50",
                }}
              >
                R{(item.amount - item.appFee).toFixed(2)}
              </ThemedText>
            </View>
          </View>
        )}

        {/* See More Button */}
        <TouchableOpacity
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          style={styles.seeMoreButton}
        >
          <ThemedText
            style={{
              fontFamily: "poppinsMedium",
              fontSize: 12,
              color: colors.tint,
            }}
          >
            {isExpanded ? "See Less" : "See More"}
          </ThemedText>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.tint}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with Export Button */}
      <View style={styles.headerTop}>
        <View style={styles.titleSection}>
          <ThemedText style={[styles.title, { fontFamily: "poppinsLight" }]}>
            Your
          </ThemedText>
          <ThemedText
            style={[styles.title, { fontFamily: "poppinsLight", fontSize: 42 }]}
          >
            Earnings
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={handleExportPDF}
          style={[
            styles.exportButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="share-social-outline" size={20} color={colors.tint} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards - Row View */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statContent}>
            <Ionicons name="wallet-outline" size={20} color="#4CAF50" />

            <ThemedText
              style={{
                fontFamily: "poppinsLight",
                fontSize: 11,
                color: colors.textSecondary,
              }}
            >
              Total Earnings
            </ThemedText>
            <ThemedText
              style={{
                fontFamily: "poppinsBold",
                fontSize: 14,
                color: colors.text,
                marginTop: 2,
              }}
            >
              R{totalEarnings.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.statContent}>
            <Ionicons name="trending-down-outline" size={20} color="#FF6B6B" />

            <ThemedText
              style={{
                fontFamily: "poppinsLight",
                fontSize: 11,
                color: colors.textSecondary,
              }}
            >
              Fees Paid
            </ThemedText>
            <ThemedText
              style={{
                fontFamily: "poppinsBold",
                fontSize: 14,
                color: colors.text,
                marginTop: 2,
              }}
            >
              R{totalFeesPaid.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Transaction History */}
      <ThemedText
        style={{
          fontFamily: "poppinsMedium",
          fontSize: 15,
          color: colors.text,
          marginBottom: 12,
          marginTop: 24,
        }}
      >
        Recent Deliveries ({transactions.length})
      </ThemedText>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard item={item} />}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 70,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  titleSection: { flex: 1 },
  title: { fontSize: 52, fontWeight: "600", lineHeight: 52 },
  exportButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    gap: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  statCard: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },

  transactionCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  deliveryBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  statusBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  expandedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  netRow: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 2,
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  listContent: { paddingBottom: 100 },
});
