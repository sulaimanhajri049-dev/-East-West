
import { GoogleGenAI } from "@google/genai";
import { Category, Difficulty, Question, GameMode, Language } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateQuestions = async (
  categoryInput: Category | Category[], 
  difficulty: Difficulty, 
  count: number = 10,
  gameMode: GameMode = 'CLASSIC',
  language: Language = 'ar'
): Promise<Question[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return getMockQuestions(Array.isArray(categoryInput) ? categoryInput[0] : categoryInput, language);
  }

  const modelId = "gemini-2.5-flash";
  
  // Handle Mixed Categories
  const isMixed = Array.isArray(categoryInput);
  const categoryText = Array.isArray(categoryInput) 
    ? categoryInput.join(', ') 
    : categoryInput;

  const langText = language === 'ar' ? 'Arabic' : 'English';

  let prompt = `
    You are a quiz master for a game called 'Sharq > Gharb'.
    Generate ${count} multiple-choice questions in ${langText}.
    Category ID: ${categoryText}
    Difficulty: ${difficulty}
  `;

  // --- GAME MODE SPECIFIC INSTRUCTIONS ---
  if (gameMode === 'KIDS') {
    prompt += `
    
    *** CRITICAL MODE: KIDS (Age 5-10) ***
    - ROLE: Kindergarten/Primary School Teacher.
    - TONE: Fun, Cheerful, Encouraging, Simple.
    - LANGUAGE: Simple ${langText}.
    - RESTRICTIONS: NO violence, NO politics, NO complex history, NO obscure facts.
    - IMAGES: Must be colorful, clear, and easy to recognize.

    CATEGORY RULES FOR KIDS:
    - ANIMALS: Focus on sounds, features.
    - CARTOONS: Popular global cartoons (Disney, SpongeBob).
    - COLORS_SHAPES: Basic visual questions.
    - FRUITS_VEG: Identify fruits.
    - CARS: Police, Firetruck.
    - FOOTBALL: Messi, Ronaldo, Ball.
    `;
  } else if (gameMode === 'STUDENTS') {
    prompt += `
    
    *** CRITICAL MODE: STUDENTS (Age 12-18) ***
    - ROLE: High School Teacher.
    - TONE: Academic.
    - LANGUAGE: Academic ${langText}.
    - FOCUS: School Curriculum topics.
    `;
  } else {
    // CLASSIC / ORIGINAL
    prompt += `
    *** MODE: ORIGINAL / GENERAL ***
    - AUDIENCE: General Public.
    - TONE: Entertaining, Trivia Night style.
    `;
  }

  prompt += `
    Your Goal: 
    1. Generate valid questions.
    2. Use the 'googleSearch' tool to find a REAL, VALID, DIRECT image URL.
    3. Return valid JSON.

    JSON Structure:
    {
      "questions": [
        {
          "text": "Question text in ${langText}",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "The correct option text",
          "imageUrl": "https://...", 
          "countryCode": "SA", // ONLY for FLAGS category
          "explanation": "Brief explanation in ${langText}"
        }
      ]
    }
  `;

  if (categoryInput === Category.FLAGS) {
    prompt += `
      - The 'text' MUST ask "Which country is this?".
      - The 'options' must be 4 distinct country names in ${langText}.
      - CRITICAL: You MUST provide the 'countryCode'.
    `;
  }
  
  if (isMixed) {
    prompt += `
      - Distribute questions evenly across: ${categoryText}.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: gameMode === 'KIDS' ? 0.5 : 0.7, 
      }
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    
    const parsed = JSON.parse(cleanJson);
    
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions.map((q: any, index: number) => {
        let finalImageUrl = q.imageUrl;
        if (categoryInput === Category.FLAGS && q.countryCode) {
          finalImageUrl = `https://flagcdn.com/w640/${q.countryCode.toLowerCase()}.png`;
        }

        return {
          id: `${Date.now()}-${index}`,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          imageUrl: finalImageUrl || '',
          countryCode: q.countryCode,
          explanation: q.explanation
        };
      });
    }
    throw new Error("Invalid JSON structure");

  } catch (error) {
    console.error("Gemini Error:", error);
    return getMockQuestions(Array.isArray(categoryInput) ? categoryInput[0] : categoryInput, language);
  }
};

const getMockQuestions = (category: Category, language: Language): Question[] => {
  const isFlags = category === Category.FLAGS;
  const isAr = language === 'ar';
  
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `mock-${i}`,
    text: isFlags 
      ? (isAr ? "ما هي هذه الدولة؟" : "Which country is this?")
      : (isAr ? `سؤال تجريبي ${i + 1}` : `Test Question ${i + 1}`),
    options: isFlags 
      ? (isAr ? ["مصر", "السعودية", "الإمارات", "قطر"] : ["Egypt", "Saudi Arabia", "UAE", "Qatar"])
      : ["A", "B", "C", "D"],
    correctAnswer: isFlags ? (isAr ? "مصر" : "Egypt") : "A",
    imageUrl: isFlags ? "https://flagcdn.com/w640/eg.png" : "", 
    countryCode: isFlags ? 'EG' : undefined,
    explanation: isAr ? "سؤال تجريبي" : "Mock Question"
  }));
};
