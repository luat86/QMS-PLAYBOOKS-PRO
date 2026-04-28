import { GoogleGenAI } from "@google/genai";

export async function askPlaybot(prompt: string, context: string, apiKey?: string) {
  const finalApiKey = apiKey || process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  const systemPrompt = `
    Bạn là AI Playbot - Chuyên gia Hỗ trợ Hệ thống Quản lý Chất lượng (QMS) Xây dựng.
    Bạn am hiểu Nghị định 06, ISO 9001:2015 và các quy định pháp luật xây dựng Việt Nam.
    Nhiệm vụ của bạn:
    1. Kiểm tra tính pháp lý của quy trình.
    2. Tạo Checklist chi tiết từ Biện pháp thi công.
    3. Hỗ trợ giải quyết các Sự không phù hợp (NCR).
    
    Bối cảnh hiện tại: ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemPrompt}\n\nNgười dùng hỏi: ${prompt}`,
    });
    return response.text || "Tôi không nhận được phản hồi từ AI.";
  } catch (error) {
    console.error("Playbot Error:", error);
    return "Xin lỗi, tôi gặp sự cố khi kết nối. Vui lòng kiểm tra API Key.";
  }
}
