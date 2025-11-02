import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

interface Notification {
  id: string;
  type: "delivery" | "payment" | "promotion" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  color: string;
}

const generateDummyNotifications = (): Notification[] => [
//   {
//     id: "notif-1",
//     type: "delivery",
//     title: "Delivery Completed!",
//     message: "You earned R382.50 from delivery E-FGJHFSBN5",
//     timestamp: "5 mins ago",
//     read: false,
//     icon: "checkmark-circle",
//     color: "#4CAF50",
//   },
//   {
//     id: "notif-2",
//     type: "promotion",
//     title: "Special Bonus Available",
//     message: "Complete 5 deliveries today to earn 20% bonus",
//     timestamp: "2 hours ago",
//     read: false,
//     icon: "gift",
//     color: "#FF6B9D",
//   },
//   {
//     id: "notif-3",
//     type: "payment",
//     title: "Payment Processed",
//     message: "Your weekly earnings of R2,795.00 have been processed",
//     timestamp: "Yesterday",
//     read: true,
//     icon: "wallet",
//     color: "#4A90E2",
//   },
//   {
//     id: "notif-4",
//     type: "alert",
//     title: "App Update Available",
//     message: "Update to the latest version for better performance",
//     timestamp: "2 days ago",
//     read: true,
//     icon: "download-outline",
//     color: "#FF9800",
//   },
];

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal = ({
  visible,
  onClose,
}: NotificationModalProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [notifications, setNotifications] = useState<Notification[]>(
    generateDummyNotifications()
  );
  const slideAnim = new Animated.Value(1000);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationPress = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const handleClearAll = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const NotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.card : colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: item.color + "20" },
        ]}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={item.color}
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <ThemedText
            style={{
              fontFamily: "poppinsMedium",
              fontSize: 13,
              color: colors.text,
              flex: 1,
            }}
          >
            {item.title}
          </ThemedText>
          {!item.read && (
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: item.color },
              ]}
            />
          )}
        </View>

        <ThemedText
          style={{
            fontFamily: "poppinsLight",
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {item.message}
        </ThemedText>

        <ThemedText
          style={{
            fontFamily: "poppinsLight",
            fontSize: 10,
            color: colors.textSecondary,
            marginTop: 6,
            opacity: 0.7,
          }}
        >
          {item.timestamp}
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== item.id)
          );
        }}
        style={styles.dismissButton}
      >
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border },
            ]}
          >
            <View>
              <ThemedText
                style={{
                  fontFamily: "poppinsBold",
                  fontSize: 20,
                  color: colors.text,
                }}
              >
                Notifications
              </ThemedText>
              {unreadCount > 0 && (
                <ThemedText
                  style={{
                    fontFamily: "poppinsLight",
                    fontSize: 11,
                    color: colors.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {unreadCount} unread
                </ThemedText>
              )}
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: colors.card },
                ]}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={colors.textSecondary}
                />
              </View>
              <ThemedText
                style={{
                  fontFamily: "poppinsMedium",
                  fontSize: 16,
                  color: colors.text,
                  marginTop: 16,
                }}
              >
                You are Caught Up!
              </ThemedText>
              <ThemedText
                style={{
                  fontFamily: "poppinsLight",
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                No new notifications. Check back later.
              </ThemedText>
            </View>
          ) : (
            <>
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={handleClearAll}
                  style={styles.clearAllButton}
                >
                  <ThemedText
                    style={{
                      fontFamily: "poppinsMedium",
                      fontSize: 11,
                      color: colors.tint,
                    }}
                  >
                    Mark all as read
                  </ThemedText>
                </TouchableOpacity>
              )}

              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationItem item={item} />}
                scrollEnabled={true}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    borderTopWidth: 1,
    maxHeight: "95%",
    minHeight: "50%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clearAllButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dismissButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});