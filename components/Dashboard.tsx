import React, { useMemo } from 'react';
// Fix: Import FoodItem to correctly type the item in the reduce function.
import type { Meal, Goal, FoodItem } from '../types';
import { MealCard } from './MealCard';
import { ProgressCharts } from './ProgressCharts';
import { TargetIcon } from './icons/TargetIcon';
import { PlusIcon } from './icons/PlusIcon';

interface DashboardProps {
  goal: Goal | null;
  meals: Meal;
  onOpenGoalModal: () => void;
  onOpenAddMealModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ goal, meals, onOpenGoalModal, onOpenAddMealModal }) => {
  const totals = useMemo(() => {
    // Fix: Explicitly type 'item' as FoodItem to resolve TypeScript inference issue.
    return Object.values(meals).flat().reduce((acc, item: FoodItem) => {
      acc.calories += item.nutrients.calories;
      acc.protein += item.nutrients.protein;
      acc.carbs += item.nutrients.carbs;
      acc.fat += item.nutrients.fat;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  return (
    <div className="space-y-6">
      {goal ? (
        <ProgressCharts totals={totals} goal={goal} />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Set Your Goal!</h2>
          <p className="text-gray-600 mb-4">Set a daily nutritional goal to start tracking your progress.</p>
          <button
            onClick={onOpenGoalModal}
            className="inline-flex items-center px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            <TargetIcon className="w-5 h-5 mr-2" />
            Set Daily Goal
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MealCard mealType="Breakfast" items={meals.breakfast} />
        <MealCard mealType="Lunch" items={meals.lunch} />
        <MealCard mealType="Dinner" items={meals.dinner} />
        <MealCard mealType="Snacks" items={meals.snacks} />
      </div>

      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
          <button
              onClick={onOpenGoalModal}
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Update Goal"
            >
              <TargetIcon className="w-6 h-6" />
          </button>
          <button
              onClick={onOpenAddMealModal}
              className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Add Meal"
            >
              <PlusIcon className="w-8 h-8" />
          </button>
      </div>
    </div>
  );
};
