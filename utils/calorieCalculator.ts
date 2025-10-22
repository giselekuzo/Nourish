
interface MifflinStJeorInput {
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE({ gender, weightKg, heightCm, age, activityLevel }: MifflinStJeorInput): number {
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  
  const tdee = bmr * activityMultipliers[activityLevel];
  return Math.round(tdee);
}

export function calculateGoalMacros(tdee: number, goalType: 'lose' | 'maintain' | 'gain') {
  let targetCalories: number;
  switch (goalType) {
    case 'lose':
      targetCalories = tdee - 500;
      break;
    case 'gain':
      targetCalories = tdee + 500;
      break;
    case 'maintain':
    default:
      targetCalories = tdee;
  }

  // Macronutrient split: 40% Carbs, 30% Protein, 30% Fat
  const protein = Math.round((targetCalories * 0.30) / 4);
  const carbs = Math.round((targetCalories * 0.40) / 4);
  const fat = Math.round((targetCalories * 0.30) / 9);

  return {
    calories: Math.round(targetCalories),
    protein,
    carbs,
    fat
  };
}
