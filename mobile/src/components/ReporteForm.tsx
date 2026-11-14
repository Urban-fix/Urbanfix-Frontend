import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme/tokens';
import { useCategorias, useZonas } from '../hooks/useData';
import { LocationPicker, type Coords } from './LocationPicker';
import { Button, Card, Divider, Input, Select } from './ui';

export interface ReporteFormValues {
  titulo: string;
  descripcion: string;
  categoriaId: number | '';
  zonaId: number | '';
  fotoUrl: string;
  location: Coords | null;
  photo: ImagePicker.ImagePickerAsset | null;
}

type Errors = Partial<Record<keyof ReporteFormValues, string>>;

/** Mismas reglas que el web (react-hook-form en ReporteCreate.tsx). */
const validate = (v: ReporteFormValues): Errors => {
  const e: Errors = {};
  const t = v.titulo.trim();
  const d = v.descripcion.trim();
  if (!t) e.titulo = 'Título es requerido';
  else if (t.length < 5) e.titulo = 'Mínimo 5 caracteres';
  if (!d) e.descripcion = 'Descripción es requerida';
  else if (d.length < 10) e.descripcion = 'Mínimo 10 caracteres';
  if (!v.categoriaId) e.categoriaId = 'Categoría es requerida';
  if (!v.zonaId) e.zonaId = 'Zona es requerida';
  if (!v.location) e.location = 'Fija la ubicación en el mapa';
  return e;
};

interface Props {
  initial?: Partial<ReporteFormValues>;
  submitLabel: string;
  allowPhotoUpload?: boolean;
  onSubmit: (values: ReporteFormValues) => Promise<void>;
}

export const ReporteForm: React.FC<Props> = ({ initial, submitLabel, allowPhotoUpload = true, onSubmit }) => {
  const { data: categorias } = useCategorias();
  const { data: zonas } = useZonas();
  const [v, setV] = useState<ReporteFormValues>({
    titulo: '',
    descripcion: '',
    categoriaId: '',
    zonaId: '',
    fotoUrl: '',
    location: null,
    photo: null,
    ...initial,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof ReporteFormValues>(k: K, val: ReporteFormValues[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const pick = async (source: 'camera' | 'library') => {
    const perm = source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErrors((p) => ({ ...p, photo: 'Necesitamos permiso para acceder a la ' + (source === 'camera' ? 'cámara' : 'galería') }));
      return;
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7, allowsEditing: true, aspect: [4, 3] };
    const res = source === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (res.canceled) return;
    const asset = res.assets[0];
    if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
      setErrors((p) => ({ ...p, photo: 'El archivo no puede exceder 10MB' }));
      return;
    }
    set('photo', asset);
  };

  const submit = async () => {
    const e = validate(v);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await onSubmit(v);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ gap: spacing.lg }}>
      <Input label="Título" value={v.titulo} onChangeText={(t) => set('titulo', t)} maxLength={200} counter={v.titulo.length} error={errors.titulo} placeholder="Ej. Bache grande en Av. Arequipa" />

      <Input
        label="Descripción"
        value={v.descripcion}
        onChangeText={(t) => set('descripcion', t)}
        multiline
        maxLength={2000}
        counter={v.descripcion.length}
        error={errors.descripcion}
        placeholder="Describe el problema con el mayor detalle posible"
      />

      <LocationPicker value={v.location} onChange={(c) => set('location', c)} error={errors.location} />

      <Select
        label="Categoría"
        placeholder="Selecciona una categoría"
        value={v.categoriaId}
        options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
        onChange={(val) => set('categoriaId', val)}
        error={errors.categoriaId}
      />

      <Select
        label="Zona"
        placeholder="Selecciona una zona"
        value={v.zonaId}
        options={zonas.map((z) => ({ value: z.id, label: z.nombre }))}
        onChange={(val) => set('zonaId', val)}
        error={errors.zonaId}
      />

      <View>
        <Text style={styles.label}>Foto</Text>
        {v.photo ? (
          <View>
            <Image source={v.photo.uri} style={styles.preview} contentFit="cover" />
            <Pressable onPress={() => set('photo', null)} style={styles.remove} accessibilityLabel="Quitar foto">
              <Feather name="x" size={16} color="#fff" />
            </Pressable>
            <Text style={styles.hint}>
              {v.photo.fileName ?? 'foto.jpg'}
              {v.photo.fileSize ? ` (${(v.photo.fileSize / 1024 / 1024).toFixed(2)} MB)` : ''}
            </Text>
          </View>
        ) : (
          <>
            {allowPhotoUpload && (
              <View style={styles.pickRow}>
                <Pressable style={styles.drop} onPress={() => pick('camera')}>
                  <Feather name="camera" size={26} color={colors.textMuted} />
                  <Text style={styles.dropText}>Tomar foto</Text>
                </Pressable>
                <Pressable style={styles.drop} onPress={() => pick('library')}>
                  <Feather name="image" size={26} color={colors.textMuted} />
                  <Text style={styles.dropText}>Galería</Text>
                </Pressable>
              </View>
            )}
            {allowPhotoUpload && <Text style={[styles.hint, { textAlign: 'center' }]}>PNG, JPG hasta 10MB</Text>}
            {allowPhotoUpload && <Divider label="O ingresa una URL" style={{ marginVertical: spacing.md }} />}
            <Input
              value={v.fotoUrl}
              onChangeText={(t) => set('fotoUrl', t)}
              placeholder="https://ejemplo.com/foto.jpg"
              keyboardType="url"
              autoCapitalize="none"
              maxLength={500}
              counter={v.fotoUrl.length}
            />
          </>
        )}
        {errors.photo && <Text style={styles.error}>⚠ {errors.photo}</Text>}
      </View>

      <Button title={submitting ? 'Enviando...' : submitLabel} onPress={submit} isLoading={submitting} />
    </Card>
  );
};

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: 8 },
  pickRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  drop: {
    flex: 1,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  dropText: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 14 },
  hint: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12, marginTop: 6 },
  preview: { width: '100%', height: 192, borderRadius: 8 },
  remove: { position: 'absolute', top: 8, right: 8, padding: 8, borderRadius: 999, backgroundColor: colors.error },
  error: { color: colors.error, fontFamily: fonts.body, fontSize: 13, marginTop: 6 },
});

/** Arma el FormData multipart igual que el web (campo `foto`). */
export const buildReporteFormData = (v: ReporteFormValues) => {
  const fd = new FormData();
  fd.append('titulo', v.titulo.trim());
  fd.append('descripcion', v.descripcion.trim());
  fd.append('latitud', String(v.location!.lat));
  fd.append('longitud', String(v.location!.lng));
  fd.append('categoriaId', String(v.categoriaId));
  fd.append('zonaId', String(v.zonaId));
  const p = v.photo!;
  // React Native acepta { uri, name, type } como archivo en FormData
  fd.append('foto', { uri: p.uri, name: p.fileName ?? 'foto.jpg', type: p.mimeType ?? 'image/jpeg' } as unknown as Blob);
  return fd;
};
