import { useState, useCallback } from 'react';
import { VoiceConfig } from '../types';
import * as Speech from 'expo-speech';

const DEFAULT_CONFIG: VoiceConfig = {
  language: 'es-ES',
  rate: 0.8,
  pitch: 1.2,
  volume: 0.9,
};

export const useVoiceSynthesis = () => {
  const [isInitialized, setIsInitialized] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [config, setConfig] = useState<VoiceConfig>(DEFAULT_CONFIG);

  const speak = useCallback(
    async (text: string, options?: Partial<VoiceConfig>) => {
      const mergedConfig = { ...config, ...options };
      
      try {
        setIsPlaying(true);
        await Speech.speak(text, {
          language: 'es-ES',
          rate: mergedConfig.rate,
          pitch: mergedConfig.pitch,
          volume: mergedConfig.volume,
        });
      } catch (error) {
        console.error('Error hablando:', error);
      } finally {
        setIsPlaying(false);
      }
    },
    [config]
  );

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error deteniendo TTS:', error);
    }
  }, []);

  const speakProblemSequence = useCallback(
    async (storyText: string, question: string) => {
      try {
        await speak(storyText, { rate: 0.8 });
        
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        await speak(question, { rate: 0.8, pitch: 1.3 });
      } catch (error) {
        console.error('Error en secuencia de lectura:', error);
      }
    },
    [speak]
  );

  const speakFeedback = useCallback(
    async (isCorrect: boolean, result?: number) => {
      let feedbackText = '';
      
      if (isCorrect) {
        const positiveMessages = [
          '¡Muy bien! ¡Excelente!',
          '¡Correcto! ¡Eres un campeón!',
          '¡Bravo! ¡Lo hiciste perfecto!',
          '¡Increíble! ¡Sigue así!',
          '¡Fantástico! ¡Muy bien!'
        ];
        feedbackText = positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      } else {
        feedbackText = `Incorrecto. La respuesta correcta es ${result}. Vamos, intenta de nuevo.`;
      }

      await speak(feedbackText, { 
        rate: 0.9,
        pitch: isCorrect ? 1.4 : 1.1,
      });
    },
    [speak]
  );

  const speakInstruction = useCallback(
    async (instruction: string) => {
      await speak(instruction, { rate: 0.75, pitch: 1.2 });
    },
    [speak]
  );

  return {
    isInitialized,
    isPlaying,
    speak,
    stop,
    speakProblemSequence,
    speakFeedback,
    speakInstruction,
    setConfig,
  };
};
