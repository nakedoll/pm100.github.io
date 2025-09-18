import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const podcastSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "팟캐스트 대본을 한두 문단으로 요약한 매력적인 글. 청취자의 흥미를 유발하고 에피소드의 내용을 설명해야 합니다.",
    },
    keyTakeaways: {
      type: Type.ARRAY,
      description: "에피소드의 핵심 내용 또는 요점 3-5개를 완전한 문장으로 작성한 목록입니다.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["summary", "keyTakeaways"],
};

export interface GeneratedContent {
    summary: string;
    keyTakeaways: string[];
}

export const generatePodcastContent = async (transcript: string): Promise<GeneratedContent> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `다음 팟캐스트 대본을 바탕으로 필요한 콘텐츠를 한국어로 생성해 주세요. 대본: """${transcript}"""`,
            config: {
                responseMimeType: "application/json",
                responseSchema: podcastSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedJson.summary || !Array.isArray(parsedJson.keyTakeaways)) {
            throw new Error("API로부터 잘못된 JSON 구조를 받았습니다.");
        }

        return parsedJson;

    } catch (error) {
        console.error("Error generating podcast content:", error);
        throw new Error("대본에서 콘텐츠를 생성하는 데 실패했습니다. 대본을 확인하고 다시 시도해 주세요.");
    }
};