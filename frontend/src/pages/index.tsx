import React, { useState } from 'react';
import { D3StateMap } from '../components/D3StateMap';
import { PurchaseForm } from '../components/PurchaseForm';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('');

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          50 States Pixel Project
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Map Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Select a State</h2>
            <D3StateMap onStateSelect={handleStateSelect} />
          </div>

          {/* Purchase Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Purchase Pixels</h2>
            <PurchaseForm selectedState={selectedState} />
          </div>
        </div>
      </main>
    </div>
  );
} 