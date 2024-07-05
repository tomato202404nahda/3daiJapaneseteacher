import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { NextRequest } from "next/server";
import { PassThrough } from "stream";

export async function GET(req: NextRequest) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env["AZURE_TTS_KEY"] as string,
    process.env["AZURE_TTS_REGION"] as string
  );

  const teacher = req.nextUrl.searchParams.get("teacher") || "Nanami";
  speechConfig.speechSynthesisVoiceName = `ja-JP-${teacher}Neural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes: number[][] = [];
  speechSynthesizer.visemeReceived = (s, e) => {
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };
  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      req.nextUrl.searchParams.get("text") || "めっちゃよくへんや",
      (result) => {
        const { audioData } = result;

        speechSynthesizer.close();

        // convert arrayBuffer to stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });

  const response = new Response(audioStream as ReadableStream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename=tts.mp3`,
      Visemes: JSON.stringify(visemes),
    },
  });
  return response;
}
