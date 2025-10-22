
import { GoogleGenAI, Type } from "@google/genai";
import type { Nutrients } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const foodAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    isFood: {
        type: Type.BOOLEAN,
        description: "Is the item in the image an edible food item?"
    },
    foodName: { 
        type: Type.STRING, 
        description: "The name of the identified food item. e.g., 'Banana' or 'Scrambled Eggs'." 
    },
    estimatedWeightGrams: { 
        type: Type.INTEGER, 
        description: "An estimated weight of the food item in grams." 
    },
    calories: { 
        type: Type.INTEGER, 
        description: "Estimated calories for the portion shown." 
    },
    protein: { 
        type: Type.NUMBER, 
        description: "Estimated protein in grams." 
    },
    carbs: { 
        type: Type.NUMBER, 
        description: "Estimated carbohydrates in grams." 
    },
    fat: { 
        type: Type.NUMBER, 
        description: "Estimated fat in grams." 
    },
  },
  required: ["isFood", "foodName", "estimatedWeightGrams", "calories", "protein", "carbs", "fat"],
};


export interface FoodAnalysisResponse {
    isFood: boolean;
    foodName: string;
    estimatedWeightGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}


export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResponse> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: 'Identify the food item in this image. Estimate its weight in grams and provide its nutritional information (calories, protein, carbohydrates, fat) in the provided JSON format. If you cannot confidently identify a food, set isFood to false and other fields to 0 or empty strings.',
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: foodAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText) as FoodAnalysisResponse;

    if (!parsedJson.isFood) {
        throw new Error("No food item could be identified in the image.");
    }
    
    return parsedJson;

  } catch (error) {
    console.error('Error analyzing food image with Gemini:', error);
    throw new Error('Failed to analyze food image. Please try again or enter manually.');
  }
}
