import {
  useFonts as useBricolageFonts,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  useFonts as useInstrumentFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';

/** Carga las dos familias tipográficas del handoff. Ver theme/tokens.ts `fonts`. */
export function usePendiloFonts() {
  const [displayLoaded] = useBricolageFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });
  const [bodyLoaded] = useInstrumentFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
  });

  return displayLoaded && bodyLoaded;
}
