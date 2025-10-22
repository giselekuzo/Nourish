
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip, PolarAngleAxis } from 'recharts';
import type { Goal } from '../types';

interface ProgressChartsProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goal: Goal;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // Blue for Carbs, Green for Protein, Yellow for Fat

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ totals, goal }) => {
  const calorieData = [{ name: 'Calories', value: totals.calories, fill: '#10B981' }];
  
  const macroData = [
    { name: 'Carbs', value: totals.carbs },
    { name: 'Protein', value: totals.protein },
    { name: 'Fat', value: totals.fat },
  ];

  const totalMacros = totals.carbs + totals.protein + totals.fat;
  const pieData = totalMacros > 0 ? macroData : [{name: 'No Data', value: 1}];

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Today's Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        
        {/* Calorie Progress */}
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              innerRadius="70%" 
              outerRadius="100%" 
              data={calorieData} 
              startAngle={90} 
              endAngle={-270}
              barSize={20}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, goal.calories]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-green-600">{Math.round(totals.calories)}</span>
              <span className="text-sm text-gray-500">/ {goal.calories} kcal</span>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => totalMacros > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={totalMacros > 0 ? COLORS[index % COLORS.length] : '#E5E7EB'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${(value as number).toFixed(1)}g`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
