import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme/tokens';
import { useAppStore } from '../../state/useAppStore';
import { TaskReview } from '../../components/TaskReview';
import { Button } from '../../components/Button';
import { CloseIcon } from '../../components/icons';
import { foundSummary } from '../../data/copy';
import { todayISO } from '../../lib/date';

export default function RevisionScreen() {
  const insets = useSafeAreaInsets();
  const voice = useAppStore((s) => s.voice);
  const cancelVoiceSession = useAppStore((s) => s.cancelVoiceSession);
  const editReviewTaskDate = useAppStore((s) => s.editReviewTaskDate);
  const editReviewTaskMinutes = useAppStore((s) => s.editReviewTaskMinutes);
  const editReviewGoalTarget = useAppStore((s) => s.editReviewGoalTarget);
  const editUnclearFix = useAppStore((s) => s.editUnclearFix);
  const convertUnclearToTask = useAppStore((s) => s.convertUnclearToTask);
  const removeReviewItem = useAppStore((s) => s.removeReviewItem);
  const canConfirmReview = useAppStore((s) => s.canConfirmReview);
  const confirmReview = useAppStore((s) => s.confirmReview);

  useEffect(() => {
    if (voice.stage === 'done') router.replace('/(voz)/listo');
  }, [voice.stage]);

  const taskCount = voice.review.filter((i) => i.type === 'task').length;
  const goalCount = voice.review.filter((i) => i.type === 'goal').length;
  const canConfirm = canConfirmReview();

  return (
    <View style={[styles.container, { paddingTop: insets.top + space[4], paddingBottom: insets.bottom + space[4] }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title} accessibilityLiveRegion="polite">
          {foundSummary(taskCount, goalCount)}
        </Text>
        <Pressable
          onPress={() => {
            cancelVoiceSession();
            router.replace('/(tabs)');
          }}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          hitSlop={8}
        >
          <CloseIcon size={24} color={colors.ink[2]} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <TaskReview
          items={voice.review}
          nowDate={todayISO()}
          onEditDate={editReviewTaskDate}
          onEditMinutes={editReviewTaskMinutes}
          onEditGoalTarget={editReviewGoalTarget}
          onEditUnclearFix={editUnclearFix}
          onConvertUnclear={convertUnclearToTask}
          onRemove={removeReviewItem}
        />
      </ScrollView>

      <Button
        label="Confirmar"
        disabled={!canConfirm}
        disabledHint="Resolvé los campos marcados antes de confirmar"
        onPress={confirmReview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: space[5] },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space[3], marginBottom: space[4] },
  title: { ...type.section, color: colors.ink[1], flex: 1 },
  scroll: { paddingBottom: space[6] },
});
