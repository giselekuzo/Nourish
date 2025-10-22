
import React, { useState, useCallback } from 'react';
import { SmartScanner } from './SmartScanner';
import type { FoodItem, Meal } from '../types';
import type { FoodAnalysisResponse } from '../services/geminiService';
import { CameraIcon } from './icons/CameraIcon';
import { XIcon } from './icons/XIcon';

interface AddMealModalProps {
  onClose: () => void;
  onAddFood: (mealType: keyof Meal, food: FoodItem) => void;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({ onClose, onAddFood }) => {
  const [mealType, setMealType] = useState<keyof Meal>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [weight, setWeight] = useState('');
  const [isScanning, setScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFood: FoodItem = {
      id: new Date().toISOString(),
      name: foodName,
      weight: parseFloat(weight) || 0,
      nutrients: {
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
      },
    };
    onAddFood(mealType, newFood);
  };
  
  const handleScanSuccess = useCallback((data: FoodAnalysisResponse) => {
      setFoodName(data.foodName);
      setCalories(data.calories.toString());
      setProtein(data.protein.toFixed(1));
      setCarbs(data.carbs.toFixed(1));
      setFat(data.fat.toFixed(1));
      setWeight(data.estimatedWeightGrams.toString());
      setScanning(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">{isScanning ? 'Scan Your Meal' : 'Add Meal'}</h2>
        </div>
        
        {isScanning ? (
            <SmartScanner onScanSuccess={handleScanSuccess} onCancel={() => setScanning(false)} />
        ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex justify-center mb-4">
                <button
                    type="button"
                    onClick={() => setScanning(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
                >
                    <CameraIcon className="w-5 h-5" />
                    Scan with AI
                </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm">- OR -</p>
            
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">Meal Type</label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as keyof Meal)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
  
            <div>
              <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Food Name</label>
              <input type="text" id="foodName" value={foodName} onChange={(e) => setFoodName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (g)</label>
                <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700">Calories (kcal)</label>
                <input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
              </div>
              <div>
                <label htmlFor="protein" className="block text-sm font-medium text-gray-700">Protein (g)</label>
                <input type="number" id="protein" value={protein} onChange={(e) => setProtein(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                <input type="number" id="carbs" value={carbs} onChange={(e) => setCarbs(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-gray-700">Fat (g)</label>
                <input type="number" id="fat" value={fat} onChange={(e) => setFat(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
            </div>
  
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">Add Food</button>
          </form>
        )}
      </div>
    </div>
  );
};
