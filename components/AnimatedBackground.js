import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function AnimatedBackground() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateXInterpolate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  return (
    <Animated.View
      style={[
        styles.animatedBackground,
        { transform: [{ translateX: translateXInterpolate }] },
      ]}
    >
      <LinearGradient
        colors={["#4ade80", "#2dd4bf", "#3b82f6", "#4ade80"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 2,
    height: height,
    zIndex: 0,
    flexDirection: "row",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
