
export interface Watch {
  brand: string;
  model: string;
  priceRange: string;
  style: string;
  movement: string;
  diameter: string;
  description: string;
  imageUrl: string;
  isPromoted?: boolean;
}

export interface UserPreferences {
  style: string[];
  complications: string[];
  budget: string;
  movement: string;
  usage: string;
  wristSize: string;
  additionalInfo: string;
}

export enum Step {
  Intro = 'intro',
  Style = 'style',
  Complications = 'complications',
  Specs = 'specs',
  Context = 'context',
  Result = 'result'
}

export interface RecommendationResponse {
  watches: Watch[];
  expertAdvice: string;
}
