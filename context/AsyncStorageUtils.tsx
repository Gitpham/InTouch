import AsyncStorage from '@react-native-async-storage/async-storage';

export const TUTORIAL_VIEWED_KEY = 'tutorial_viewed';

export const setTutorialViewed = async () => {
  try {
    await AsyncStorage.setItem(TUTORIAL_VIEWED_KEY, 'true');
  } catch (error) {
    console.error('Error setting tutorial viewed:', error);
  }
};

export const hasViewedTutorial = async () => {
  try {
    const value = await AsyncStorage.getItem(TUTORIAL_VIEWED_KEY);
    return value !== null;
  } catch (error) {
    console.error('Error getting tutorial viewed status:', error);
    return false;
  }
};