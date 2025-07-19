import { useState } from "react";

export default function PreprocessingSection({ rawText, processedText, setProcessedText, options, setOptions, setCurrentTab }) {
    const [status, setStatus] = useState({
        errorMsg: '',
        loading: false,
        processed: false
    });
    
    const API_URL = import.meta.env.VITE_API_URL;
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setOptions((prev) => ({ ...prev, [name]: checked }))
    }
    const preProcessText = async () => {
        if (!options.lowercase) {
            setStatus(prev => ({
                ...prev,
                errorMsg: 'Lowercase option must be selected!',
                loading: false
            }))
            return;
        }
        setStatus(prev => ({
            ...prev,
            errorMsg: '',
            loading: true
        }))
        try {
            const result = await fetch(`${API_URL}/text_preprocess`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: rawText, options })
            });
            if (!result.ok) {
                throw new Error('Failed to process Text');
            }
            const data = await result.json();
            setProcessedText(data.processed);
            setStatus(prev => ({
                ...prev,
                processed: true
            }))
        } catch (error) {
            console.error('Error :', error);
            setStatus(prev => ({
                ...prev,
                errorMsg: error.message
            }))
        } finally {
            setStatus(prev => ({
                ...prev,
                loading: false
            }))
        }
    }
    const goToBack = () => {
        setCurrentTab('Input');
        setProcessedText('');
    }
    const goToNext = () => {
        if (status.processed) {
            setCurrentTab('Vectorization');
        }
    }
    return (
        <div className='max-w-4xl mx-auto bg-green-800 text-white rounded-lg p-6'>
            <div className="flex justify-between">
                <h1 className='sm:text-2xl text-xl font-bold mb-4'>Step 2: Text Preprocessing</h1>
                <div className="text-right">
                    <p className="font-bold sm:text-base text-sm">PROCESSED SIZE</p>
                    <p className="text-sm"><span>{processedText.length > 0 ? processedText.length : rawText.length}</span>/{rawText.length}</p>
                </div>
            </div>
            <div className="bg-green-900 min-h-30 max-h-50 overflow-auto p-2 rounded border text-base whitespace-pre-wrap">
                {processedText.length > 0 ? processedText : rawText}
            </div>
            <hr className="my-4" />
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4'>
                {Object.keys(options).map((key) => (
                    <label key={key} className='flex items-center sm:text-base text-sm space-x-2'>
                        <input type="checkbox" name={key}
                            className='size-4'
                            checked={options[key]}
                            onChange={handleCheckboxChange}
                        />
                        <span className='capitalize'>{key.replace(/_/g, " ")}</span>
                    </label>
                ))}
            </div>
            <div className="flex sm:flex-row flex-col justify-between items-center">
                <div className="my-2">
                    {status.loading && (
                        <span className='italic'>Loading ...</span>
                    )}
                    {status.errorMsg && (
                        <span className='text-red-400 text-md'>{status.errorMsg}</span>
                    )}
                </div>
                <div className="space-x-4 flex">
                    <button className={`px-5 py-2 bg-orange-500 hover:bg-orange-600 transition rounded-md ${status.loading ? "cursor-not-allowed" : ""}`}
                        onClick={preProcessText}
                        disabled={status.loading}
                    >Apply</button>
                    <button className="px-5 py-2 border hover:bg-green-700 transition rounded-md"
                        onClick={goToBack}>Back</button>
                    <button className={`px-5 py-2 rounded-md ${!status.processed ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 transition"}`}
                        onClick={goToNext} disabled={!status.processed}>Next</button>
                </div>
            </div>
        </div>
    )
}