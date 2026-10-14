import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { PendiloMascot } from '../../components/PendiloMascot';
import { Button } from '../../components/Button';
import { copy } from '../../data/copy';

export default function ListoScreen() {
  const insets = useSafeAreaInsets();
  const acknowledgeVoiceDone = useAppStore((s) => s.acknowledgeVoiceDone);

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[6] }]}>
      <View style={styles.content}>
        <PendiloMascot mood="organizing" size={110} />
        <Text style={styles.title}>{copy.voice.done}</Text>
      </View>
      <Button
        label="Ver mi día"
        onPress={() => {
          acknowledgeVoiceDone();
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[6] },
  title: { ...type.voice, color: colors.ink[1], textAlign: 'center' },
});
