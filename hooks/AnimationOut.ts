// ANIMATION FILE FOR FADE AND SLIDE OUT EFFECTS
import { Animated, Easing } from 'react-native';

// FADE OUT ANIMATION - USED FOR SCREEN EXIT
export const fadeOut = (duration: number = 500) => {
  const fadeAnim = new Animated.Value(1);

  Animated.timing(fadeAnim, {
    toValue: 0,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return fadeAnim;
};

// SLIDE OUT TO RIGHT - USED FOR HORIZONTAL LOADING PROGRESS
export const slideOutRight = (duration: number = 800) => {
  const slideAnim = new Animated.Value(0);

  Animated.timing(slideAnim, {
    toValue: 100,
    duration,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return slideAnim;
};

// SCALE DOWN ANIMATION - USED FOR BUTTON RELEASE
export const scaleOut = (duration: number = 300) => {
  const scaleAnim = new Animated.Value(1);

  Animated.timing(scaleAnim, {
    toValue: 0.8,
    duration,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return scaleAnim;
};