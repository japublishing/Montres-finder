
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, RecommendationResponse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const WATCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    watches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          model: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          style: { type: Type.STRING },
          movement: { type: Type.STRING },
          diameter: { type: Type.STRING },
          description: { type: Type.STRING },
          imageUrl: { type: Type.STRING, description: "A high-quality placeholder keyword for unsplash (e.g. 'rolex submariner')" },
        },
        required: ["brand", "model", "priceRange", "style", "movement", "diameter", "description", "imageUrl"],
      },
    },
    expertAdvice: { type: Type.STRING },
  },
  required: ["watches", "expertAdvice"],
};

export const getWatchRecommendations = async (prefs: UserPreferences): Promise<RecommendationResponse> => {
  const stylesStr = prefs.style.includes('Je ne sais pas encore') 
    ? "l'utilisateur n'est pas sûr de son style, suggère des pièces iconiques et polyvalentes" 
    : `Styles favoris : ${prefs.style.join(", ")}`;

  const complicationsStr = prefs.complications.length > 0 
    ? `Complications/Affichage souhaités : ${prefs.complications.join(", ")}`
    : "Pas de préférence particulière pour les complications du cadran";

  const prompt = `
    Agis en tant qu'expert horloger passionné pour le site Montres-Passion.fr. 
    L'utilisateur recherche une montre avec les critères suivants :
    - ${stylesStr}
    - ${complicationsStr}
    - Budget : ${prefs.budget}
    - Type de mouvement : ${prefs.movement} (Si Mécanique, suggère des automatiques ou manuels de qualité)
    - Usage : ${prefs.usage}
    - Taille du poignet : ${prefs.wristSize}
    - Informations complémentaires : ${prefs.additionalInfo}

    Suggère exactement 4 montres réelles qui correspondent le mieux à ce profil. 
    Inclus des marques variées (Luxe, Indépendant, Entrée de gamme selon le budget).
    Donne un conseil d'expert global expliquant pourquoi ces choix sont pertinents pour le profil de cet utilisateur en citant les complications choisies si possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: WATCH_SCHEMA,
      },
    });

    const data = JSON.parse(response.text);
    
    // Enhance image URLs with real placeholders
    data.watches = data.watches.map((w: any) => ({
      ...w,
      imageUrl: `https://images.unsplash.com/photo-1524592093055-d57bd2fe7000?auto=format&fit=crop&q=80&w=800&q=${encodeURIComponent(w.brand + ' ' + w.model)}`,
      isPromoted: Math.random() > 0.85
    }));

    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
