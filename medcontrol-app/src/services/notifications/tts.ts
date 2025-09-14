import * as Speech from "expo-speech";
import { isVoiceAssistantEnabled } from "./settings";

export const speakIfEnabled = async (text: string): Promise<void> => {
  try {
    if (!text) return;
    const enabled = await isVoiceAssistantEnabled();
    if (!enabled) return;
    Speech.stop();
    Speech.speak(text, {
      language: "pt-BR",
      rate: 1.0,
      pitch: 1.0,
    });
  } catch (error) {
    console.error("Erro no TTS ao falar notificação:", error);
  }
};
