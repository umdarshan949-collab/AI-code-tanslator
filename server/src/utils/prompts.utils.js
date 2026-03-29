export const parseGeminiJSON = (text) => {
  try {
    let cleanText = text.trim();

    // Strip markdown code blocks if present
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "");
      cleanText = cleanText.replace(/\n?```\s*$/, "");
    }

    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error.message);
    throw new Error("AI returned an unexpected response format.");
  }
};

export const cleanCodeResponse = (text) => {
  let cleanText = text.trim();

  // Strip markdown code blocks if present
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```\w*\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```\s*$/, "");
  }

  return cleanText.trim();
};