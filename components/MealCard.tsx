
import React from 'react';
import type { FoodItem } from '../types';

interface MealCardProps {
  mealType: string;
  items: FoodItem[];
}

const mealIcons: { [key: string]: string } = {
  Breakfast: '🍳',
  Lunch: '🥗',
  Dinner: '🍲',
  Snacks: '🍎',
};

export const MealCard: React.FC<MealCardProps> = ({ mealType, items }) => {
  const totalCalories = items.reduce((sum, item) => sum + item.nutrients.calories, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">
          <span className="mr-2">{mealIcons[mealType]}</span>
          {mealType}
        </h3>
        <span className="font-semibold text-green-600">{Math.round(totalCalories)} kcal</span>
      </div>
      <div className="flex-grow space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="text-sm bg-gray-50 p-2 rounded-md">
              <p className="font-semibold text-gray-700">{item.name} <span className="font-normal text-gray-500">({item.weight}g)</span></p>
              <p className="text-xs text-gray-500">
                P: {item.nutrients.protein.toFixed(1)}g, C: {item.nutrients.carbs.toFixed(1)}g, F: {item.nutrients.fat.toFixed(1)}g
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No items logged yet.</p>
        )}
      </div>
    </div>
  );
};
