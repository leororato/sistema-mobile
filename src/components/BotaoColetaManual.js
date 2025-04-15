import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";
import { IconKeyboard } from "./IconsSvg";

export default function BotaoAnimado({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
          marginRight: 20,
        }}
      >
        <IconKeyboard width={40} height={40} />
      </Animated.View>
    </Pressable>
  );
}
