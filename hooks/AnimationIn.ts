// ANIMATION FILE FOR FADE AND SLIDE IN EFFECTS
import { Animated, Easing } from 'react-native';

// FADE IN ANIMATION - USED FOR INITIAL SCREEN LOAD
export const fadeIn = (duration: number = 500) => {
  const fadeAnim = new Animated.Value(0);

  Animated.timing(fadeAnim, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return fadeAnim;
};

// SLIDE IN FROM LEFT - USED FOR CARD ENTRANCE
export const slideInLeft = (duration: number = 400) => {
  const slideAnim = new Animated.Value(-100);

  Animated.timing(slideAnim, {
    toValue: 0,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return slideAnim;
};

// SCALE UP ANIMATION - USED FOR BUTTON PRESS FEEDBACK
export const scaleIn = (duration: number = 300) => {
  const scaleAnim = new Animated.Value(0.8);

  Animated.timing(scaleAnim, {
    toValue: 1,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return scaleAnim;
};