import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface NetworkContextType {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: true });

export const useNetwork = () => useContext(NetworkContext);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);

      if (!connected) {
        setShowOverlay(true);
        // Slide down + fade in
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 9,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Start pulsing icon
        startPulse();
      } else {
        // Slide up + fade out
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -SCREEN_HEIGHT,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowOverlay(false);
          pulseAnim.setValue(1);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
      {showOverlay && (
        <>
          {/* Backdrop */}
          <Animated.View
            style={[styles.backdrop, { opacity: fadeAnim }]}
            pointerEvents="none"
          />
          {/* Content card */}
          <Animated.View
            style={[
              styles.overlayContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.card}>
              <Animated.View
                style={[
                  styles.iconCircle,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Ionicons name="cloud-offline-outline" size={48} color="#FFF" />
              </Animated.View>
              <Text style={styles.title}>No Internet Connection</Text>
              <Text style={styles.subtitle}>
                Please check your connection and try again
              </Text>
              <View style={styles.dots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </NetworkContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 9998,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 36,
    alignItems: "center",
    marginHorizontal: 32,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    // Glow effect
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#334155",
  },
  dotActive: {
    backgroundColor: "#EF4444",
  },
});
