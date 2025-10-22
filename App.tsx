
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GoalCalculatorModal } from './components/GoalCalculatorModal';
import { AddMealModal } from './components/AddMealModal';
import type { UserData, Meal, FoodItem, Goal } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [userData, setUserData] = useLocalStorage<UserData | null>('nutriTrackUserData', null);
  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isAddMealModalOpen, setAddMealModalOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const dailyMeals = useMemo(() => {
    return userData?.log[today] ?? { breakfast: [], lunch: [], dinner: [], snacks: [] };
  }, [userData, today]);

  const handleSetGoal = (goal: Goal) => {
    setUserData(prev => ({
      ...prev,
      user: {
        name: prev?.user.name ?? "User",
        email: prev?.user.email ?? ""
      },
      goal: goal,
      log: prev?.log ?? {}
    }));
    setGoalModalOpen(false);
  };
  
  const handleWelcomeSubmit = (name: string, email: string) => {
    setUserData({
      user: { name, email },
      goal: null,
      log: {},
    });
    setGoalModalOpen(true);
  };

  const addFoodToMeal = (mealType: keyof Meal, food: FoodItem) => {
    setUserData(prev => {
      if (!prev) return null;
      const newLog = { ...prev.log };
      const todayLog = newLog[today] ?? { breakfast: [], lunch: [], dinner: [], snacks: [] };
      
      const updatedMeal = [...todayLog[mealType], food];
      const updatedTodayLog = { ...todayLog, [mealType]: updatedMeal };
      
      newLog[today] = updatedTodayLog;
      
      return { ...prev, log: newLog };
    });
    setAddMealModalOpen(false);
  };

  if (!userData) {
    return <WelcomeScreen onSetup={handleWelcomeSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header name={userData.user.name} />
      <main className="container mx-auto p-4 md:p-6">
        <Dashboard
          goal={userData.goal}
          meals={dailyMeals}
          onOpenGoalModal={() => setGoalModalOpen(true)}
          onOpenAddMealModal={() => setAddMealModalOpen(true)}
        />
      </main>
      
      {isGoalModalOpen && (
        <GoalCalculatorModal 
          onClose={() => setGoalModalOpen(false)}
          onSave={handleSetGoal}
          currentGoal={userData.goal}
        />
      )}

      {isAddMealModalOpen && (
        <AddMealModal 
          onClose={() => setAddMealModalOpen(false)}
          onAddFood={addFoodToMeal}
        />
      )}
    </div>
  );
};


interface WelcomeScreenProps {
  onSetup: (name: string, email: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetup }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name.trim() && email.trim()){
            onSetup(name, email);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-green-700">Welcome to NutriTrack</h1>
                    <p className="text-gray-500">Let's get started on your health journey. Please enter your details.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Start Tracking
                    </button>
                </form>
            </div>
        </div>
    );
};


export default App;
