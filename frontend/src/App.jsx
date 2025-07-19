import { useState } from 'react'
import './App.css'
import TextInputSection from './components/TextInputSection'
import PreprocessingSection from './components/PreprocessingSection'
import VectorizationSection from './components/VectorizationSection'
import { GrNext } from "react-icons/gr";
import PredictionSection from './components/PredictionSection'

const tabs = ['Input', 'Preprocessing', 'Vectorization', 'Prediction'];
const defaultOptions = {
    lowercase: true,
    remove_punctuation: false,
    remove_stopwords: false,
    stemming: false,
    remove_numbers: false,
    strip_whitespace: false
}

function App() {
    const [currentTab, setCurrentTab] = useState('Input');
    const [rawText, setRawText] = useState('');
    const [processedText, setProcessedText] = useState('');
    const [options, setOptions] = useState(defaultOptions);
    const [selectedVector, setSelectedVector] = useState('bow');
    const [result, setResult] = useState('');

    const currentIndex = tabs.indexOf(currentTab);

    return (
        <div className='min-h-screen bg-gray-800 p-4'>
            <h1 className='max-w-4xl mx-auto text-yellow-300 text-center sm:text-3xl mb-8 font-bold underline text-xl'>News Category Classifier</h1>
            <div className='max-w-4xl mx-auto flex flex-wrap sm:space-x-4 space-x-1 sm:mb-4 mb-2 text-white' aria-label='Breadcrumb'>
                {tabs.map((tab, index) => (
                    <div key={tab} className='flex items-center sm:space-x-2 space-x-1'>
                        <span
                        className={`py-1 sm:text-lg text-sm ${
                            index <= currentIndex
                            ? 'text-green-700 font-bold'
                            : 'text-gray-700'
                        }`}
                        >{tab}</span>
                        {index < tabs.length - 1 && (
                            <GrNext className={index < currentIndex ? 'text-green-700 font-bold':'text-gray-700'}/>
                        )}
                    </div>
                ))}
            </div>
            {currentTab === 'Input' && (
                <TextInputSection rawText={rawText} setRawText={setRawText} setOptions={setOptions} defaultOptions={defaultOptions} setSelectedVector={setSelectedVector} setCurrentTab={setCurrentTab}/>
            )}
            {currentTab === 'Preprocessing' && (
                <PreprocessingSection rawText={rawText} processedText={processedText} setProcessedText={setProcessedText} setCurrentTab={setCurrentTab} options={options} setOptions={setOptions}/>
            )}
            {currentTab === 'Vectorization' && (
                <VectorizationSection options={options} selectedVector={selectedVector} setSelectedVector={setSelectedVector} setCurrentTab={setCurrentTab} processedText={processedText} setResult={setResult}/>
            )}
            {currentTab === 'Prediction' && (
                <PredictionSection result={result} setRawText={setRawText} setOptions={setOptions} defaultOptions={defaultOptions} setProcessedText={setProcessedText} setSelectedVector={setSelectedVector} setCurrentTab={setCurrentTab} />
            )}
        </div>
    )
}

export default App
