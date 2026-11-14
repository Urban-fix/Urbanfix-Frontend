import React from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '../theme/tokens';

/** react-native-maps no soporta web: placeholder para poder abrir la app en el navegador. */
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
export type MapPressEvent = { nativeEvent: { coordinate: { latitude: number; longitude: number } } };

export const MapView = React.forwardRef<{ animateToRegion: (r: Region, ms?: number) => void }, { style?: StyleProp<ViewStyle>; children?: React.ReactNode } & Record<string, any>>(
  ({ style }, ref) => {
    React.useImperativeHandle(ref, () => ({ animateToRegion: () => {} }));
    return (
      <View style={[style, { backgroundColor: '#242424', alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 13 }}>Mapa disponible en iOS / Android</Text>
      </View>
    );
  },
);
export type MapView = { animateToRegion: (r: Region, ms?: number) => void };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Marker = (_props: Record<string, any>) => null;
