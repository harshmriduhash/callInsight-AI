/**
 * Audio compression utilities
 * Compresses audio before upload to reduce bandwidth and storage
 */

export interface CompressionOptions {
  quality?: number; // 0.0 to 1.0
  bitrate?: number; // kbps
  format?: "webm" | "mp3" | "ogg";
}

/**
 * Compress audio blob using Web Audio API
 */
export async function compressAudio(
  audioBlob: Blob,
  options: CompressionOptions = {}
): Promise<Blob> {
  const { quality = 0.7, bitrate = 64, format = "webm" } = options;

  try {
    // Create audio context
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Convert blob to array buffer
    const arrayBuffer = await audioBlob.arrayBuffer();

    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Create buffer source
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create compressor node
    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Connect nodes
    source.connect(compressor);
    compressor.connect(offlineContext.destination);

    // Start processing
    source.start(0);
    const renderedBuffer = await offlineContext.startRendering();

    // Convert back to blob
    const wav = audioBufferToWav(renderedBuffer);
    const compressedBlob = new Blob([wav], { type: "audio/wav" });

    // If format is webm, use MediaRecorder for additional compression
    if (format === "webm") {
      return await compressWithMediaRecorder(compressedBlob, quality);
    }

    return compressedBlob;
  } catch (error) {
    console.error("Erro na compressão:", error);
    // Return original blob if compression fails
    return audioBlob;
  }
}

/**
 * Compress audio using MediaRecorder API
 */
async function compressWithMediaRecorder(
  audioBlob: Blob,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioBlob);

    audio.onloadedmetadata = () => {
      const stream = audio.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 64000 * quality,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const compressedBlob = new Blob(chunks, { type: "audio/webm" });
        URL.revokeObjectURL(audio.src);
        resolve(compressedBlob);
      };

      mediaRecorder.onerror = (e) => {
        URL.revokeObjectURL(audio.src);
        reject(e);
      };

      mediaRecorder.start();
      audio.play();

      setTimeout(() => {
        mediaRecorder.stop();
        audio.pause();
      }, audio.duration * 1000);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error("Erro ao carregar áudio"));
    };
  });
}

/**
 * Convert AudioBuffer to WAV format
 */
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  const channels: Float32Array[] = [];

  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length * numberOfChannels * 2, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return arrayBuffer;
}

/**
 * Estimate compression ratio
 */
export function estimateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  return ((originalSize - compressedSize) / originalSize) * 100;
}
