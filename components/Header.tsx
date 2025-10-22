
import React from 'react';

interface HeaderProps {
  name: string;
}

export const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">
          NutriTrack <span className="text-green-500">by Kuzo</span>
        </h1>
        <p className="text-gray-600 hidden sm:block">
          Hello, <span className="font-semibold">{name}</span>!
        </p>
      </div>
    </header>
  );
};
