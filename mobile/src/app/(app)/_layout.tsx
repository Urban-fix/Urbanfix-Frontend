import { Stack } from 'expo-router';
import { colors } from '../../theme/tokens';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function AppGroupLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
