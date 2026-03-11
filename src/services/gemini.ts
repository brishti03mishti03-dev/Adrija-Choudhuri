import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getChatResponse = async (message: string, history: { role: 'user' | 'assistant', content: string }[]) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the SAP Finance Copilot, an advanced AI analyst for S/4HANA. 
    You manage a multi-agent system:
    - Reconciliation Agent: Handles bank matching.
    - AP Agent: Validates and posts invoices.
    - Risk Agent: Detects anomalies and fraud.
    - Forecast Agent: Predicts cash flow using HANA ML.
    - Closing Agent: Manages month-end processes.

    Capabilities:
    1. Decision Intelligence: Provide cash flow forecasts, risk alerts, and corrective recommendations.
    2. Conversational Analytics: Answer natural language queries about financial data (e.g., "Show overdue invoices > $50k").
    3. Autonomous Workflows: Proactively report on pending approvals or closing delays.
    4. Knowledge Engine: Answer SOP/Policy questions using RAG (simulated).

    When responding:
    - If a user asks for data, simulate a HANA query result.
    - Use [ACTION:INTENT_NAME] markers for system triggers.
    - For predictions, use [ACTION:FORECAST_CASH].
    - For anomalies, use [ACTION:DETECT_RISK].
    - For drill-downs, provide structured data descriptions.

    Example: "Based on current vendor trends, I predict a $200k liquidity gap in Q3. [ACTION:FORECAST_CASH]"
  `;

  const contents = [
    ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents: contents as any,
      config: {
        systemInstruction,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request in the SAP S/4HANA system.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to SAP Generative AI Hub failed. Please check BTP connectivity.";
  }
};
