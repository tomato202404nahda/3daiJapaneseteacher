import { teachers } from "@/components/Teacher";
import { GetState, create } from "zustand";

export interface Message {
  question?: string;
  id: number;
  answer?: any;
  speech?: string;
  audioPlayer?: HTMLAudioElement;
  visemes?: number[][];
}

export const useAITeacher = create((set, get: GetState<any>) => ({
  messages: [] as Message[],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher: string) => {
    set(() => ({
      teacher,
    }));
  },
  furigana: true,
  setFurigana: (furigana: boolean) => {
    set(() => ({ furigana }));
  },
  english: true,
  setEnglish: (english: boolean) => {
    set(() => ({ english }));
  },
  speech: "formal",
  setSpeech: (speech: string) => {
    set(() => ({
      speech,
    }));
  },
  loading: false,
  askAI: async (question: string | undefined) => {
    if (!question) {
      return;
    }
    const message: Message = {
      question: question,
      id: get().messages.length,
    };
    set(() => ({
      loading: true,
    }));

    const speech = get().speech;

    // Ask AI
    const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
    const data = await res.json();
    message.answer = data;
    message.speech = speech;

    set(() => ({
      currentMessage: message,
    }));

    set((state: any) => ({
      messages: [...state.messages, message],
      loading: false,
    }));
    get().playMessage(message);
  },
  playMessage: async (message: Message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));
      const audioRes = await fetch(
        `/api/tts?teacher=${get().teacher}&text=${message.answer.japanese
          .map((w: any) => w.word)
          .join(" ")}`
      );
      const audio = await audioRes.blob();
      const visemes = JSON.parse(
        (await audioRes.headers.get("Visemes")) as string
      );

      const audioURL = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioURL);
      message.visemes = visemes;
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({
          currentMessage: null,
        }));
      };
      set(() => ({
        loading: false,
        messages: get().messages.map((m: Message) => {
          if (m.id === message.id) {
            return message;
          }
          return m;
        }),
      }));
    }
    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },
  stopMessage: (message: Message) => {
    message.audioPlayer?.pause();
    set(() => ({
      currentMessage: null,
    }));
  },
}));
