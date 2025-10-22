
export interface FoodItem {
  id: string;
  name: string;
  nutrients: Nutrients;
  weight: number; // in grams
}

export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
}

export interface Goal {
  type: 'lose' | 'maintain' | 'gain';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserData {
  user: {
    name: string;
    email: string;
  };
  goal: Goal | null;
  log: {
    [date: string]: Meal;
  };
}
