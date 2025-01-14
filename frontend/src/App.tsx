import { useState } from 'react'
import InteractiveMap from './components/InteractiveMap'
import PurchaseForm from './components/PurchaseForm'

function App() {
  const [selectedState, setSelectedState] = useState<string>('')

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            50 States Pixel Project
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Map Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Select a State</h2>
              <InteractiveMap onStateSelect={handleStateSelect} />
            </div>
          </div>

          {/* Purchase Form Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Purchase Pixels</h2>
              <PurchaseForm selectedState={selectedState} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 