import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

export interface FilePart {
  mimeType: string;
  data: string; // base64
}

export const sendMessageToGemini = async (
  apiKey: string,
  messages: Message[],
  options: {
    model?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    files?: FilePart[];
    onChunk?: (chunk: string) => void;
  } = {}
) => {
  const { model = "gemini-3-flash-preview", temperature, topP, maxTokens, files, onChunk } = options;
  const ai = new GoogleGenAI({ apiKey });
  
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const lastMessage = messages[messages.length - 1];
  
  // Combine text and files for the prompt
  const currentParts: any[] = [{ text: lastMessage.content }];
  if (files && files.length > 0) {
    files.forEach(file => {
      currentParts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    });
  }

  const config = {
    model,
    contents: [
      ...history,
      { role: 'user', parts: currentParts }
    ],
    generationConfig: {
      temperature,
      topP,
      maxOutputTokens: maxTokens,
    }
  };

  if (onChunk) {
    const response = await ai.models.generateContentStream(config);

    let fullText = "";
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    }
    return fullText;
  } else {
    const response = await ai.models.generateContent(config);
    return response.text;
  }
};
