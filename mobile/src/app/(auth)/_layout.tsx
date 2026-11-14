import { Stack } from 'expo-router';
import { colors } from '../../theme/tokens';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthGroupLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
