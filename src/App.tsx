import { useState } from 'react'
import './App.css'
import NeuralNetworkExample from './NeuralNetwork'
import Kinetic2DExample from './Kinetic2D'
import BayesVisualizationExample from './BayesVisualization'
import MinimalSummation from './MinimalSummation'

function App() {
  const [activeExample, setActiveExample] = useState<'kinetic' | 'bayes' | 'summation' | 'neural'>('neural')

  return (
    <div className="App">
      <div className="flex gap-4 p-4 border-b">
        <button
          onClick={() => setActiveExample('neural')}
          className={`px-4 py-2 rounded ${
            activeExample === 'neural'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Neural Network
        </button>
        <button
          onClick={() => setActiveExample('kinetic')}
          className={`px-4 py-2 rounded ${
            activeExample === 'kinetic'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Kinetic Energy
        </button>
        <button
          onClick={() => setActiveExample('bayes')}
          className={`px-4 py-2 rounded ${
            activeExample === 'bayes'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Bayes Theorem
        </button>
        <button
          onClick={() => setActiveExample('summation')}
          className={`px-4 py-2 rounded ${
            activeExample === 'summation'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Summation
        </button>
      </div>

      <div className="p-4">
        {activeExample === 'neural' ? (
          <NeuralNetworkExample />
        ) : activeExample === 'kinetic' ? (
          <Kinetic2DExample />
        ) : activeExample === 'bayes' ? (
          <BayesVisualizationExample />
        ) : (
          <MinimalSummation />
        )}
      </div>
    </div>
  )
}

export default App