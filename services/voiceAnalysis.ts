// Voice tone and emotion analysis using audio metrics

export interface VoiceAnalysis {
  emotion: "happy" | "frustrated" | "neutral" | "excited" | "calm" | "anxious";
  speechRate: number; // words per minute
  pauseCount: number;
  avgPauseDuration: number; // seconds
  energyLevel: number; // 0-1
  pitchVariation: number; // 0-1
}

export function analyzeVoiceTone(
  audioMetrics: {
    average: number;
    peak: number;
    variance: number;
    frequency: Uint8Array;
  },
  transcription: string,
  duration: number
): VoiceAnalysis {
  const { average, peak, variance, frequency } = audioMetrics;

  // Calculate speech rate (words per minute)
  const wordCount = transcription.split(/\s+/).length;
  const speechRate = duration > 0 ? (wordCount / duration) * 60 : 0;

  // Detect pauses (silence periods)
  const pauseThreshold = average * 0.3;
  let pauseCount = 0;
  let pauseDuration = 0;
  let currentPause = 0;

  for (let i = 0; i < frequency.length; i++) {
    if (frequency[i] < pauseThreshold) {
      currentPause++;
    } else {
      if (currentPause > 10) {
        pauseCount++;
        pauseDuration += currentPause;
      }
      currentPause = 0;
    }
  }

  const avgPauseDuration =
    pauseCount > 0 ? pauseDuration / pauseCount / 100 : 0;

  // Calculate energy level
  const energyLevel = Math.min(average / 255, 1);

  // Calculate pitch variation (variance in frequency)
  const pitchVariation = Math.min(variance / 10000, 1);

  // Determine emotion based on metrics
  let emotion: VoiceAnalysis["emotion"] = "neutral";

  if (energyLevel > 0.7 && pitchVariation > 0.6) {
    emotion = "excited";
  } else if (energyLevel > 0.6 && pitchVariation > 0.5) {
    emotion = "happy";
  } else if (energyLevel < 0.3 && pitchVariation < 0.3) {
    emotion = "calm";
  } else if (energyLevel < 0.4 && variance > 5000) {
    emotion = "frustrated";
  } else if (energyLevel < 0.35) {
    emotion = "anxious";
  }

  return {
    emotion,
    speechRate,
    pauseCount,
    avgPauseDuration,
    energyLevel,
    pitchVariation,
  };
}
