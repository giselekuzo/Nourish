
import React, { useState, useEffect } from 'react';
import { calculateTDEE, calculateGoalMacros } from '../utils/calorieCalculator';
import type { Goal } from '../types';
import { XIcon } from './icons/XIcon';

interface GoalCalculatorModalProps {
  onClose: () => void;
  onSave: (goal: Goal) => void;
  currentGoal: Goal | null;
}

export const GoalCalculatorModal: React.FC<GoalCalculatorModalProps> = ({ onClose, onSave, currentGoal }) => {
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('light');
  const [goalType, setGoalType] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [calculatedGoal, setCalculatedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (age && weight && height) {
      const tdee = calculateTDEE({
        gender,
        age: parseInt(age),
        weightKg: parseFloat(weight),
        heightCm: parseFloat(height),
        activityLevel,
      });
      const goalMacros = calculateGoalMacros(tdee, goalType);
      setCalculatedGoal({ type: goalType, ...goalMacros });
    } else {
      setCalculatedGoal(null);
    }
  }, [gender, age, weight, height, activityLevel, goalType]);

  const handleSave = () => {
    if (calculatedGoal) {
      onSave(calculatedGoal);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative border-b">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800">Calculate Your Goal</h2>
          <p className="text-center text-gray-500 text-sm">Based on the Mifflin-St Jeor formula.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                {/* Inputs */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., 28" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., 65" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., 170" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                    <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as any)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                        <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                        <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
                        <option value="very_active">Extra active (very hard exercise/physical job)</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Goal</label>
                    <select value={goalType} onChange={(e) => setGoalType(e.target.value as any)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Weight</option>
                    </select>
                </div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 flex flex-col justify-center text-center">
                {calculatedGoal ? (
                    <>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Daily Goal</h3>
                        <p className="text-5xl font-bold text-green-600">{calculatedGoal.calories}</p>
                        <p className="text-gray-500 mb-6">calories/day</p>
                        <div className="text-left space-y-2">
                            <p><span className="font-semibold">Protein:</span> {calculatedGoal.protein} g</p>
                            <p><span className="font-semibold">Carbs:</span> {calculatedGoal.carbs} g</p>
                            <p><span className="font-semibold">Fat:</span> {calculatedGoal.fat} g</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        <p>Fill in your details to calculate your daily targets.</p>
                    </div>
                )}
            </div>
        </div>
        <div className="p-6 bg-gray-50 text-right">
             <button
                onClick={handleSave}
                disabled={!calculatedGoal}
                className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Set as My Goal
            </button>
        </div>
      </div>
    </div>
  );
};
