import { useState } from "react";

const vectorMethods = {
    onehot: {
        label: "One-Hot Encoding",
        summary: "One-hot encoding represents each unique word in your text as a distinct binary feature. It's simple but can create large and sparse vectors.",
        warningCondition: (options) => !options.remove_punctuation,
        warningMessage: "For One-Hot Encoding, it's recommended to remove punctuation for clean and distinct tokens."
    },
    bow: {
        label: "Bag of Words",
        summary: "Bag of Words (BoW) creates a vector based on word frequency, ignoring grammar and word order. It is fast and interpretable but doesn't capture context.",
    },
    tfidf: {
        label: "TF-IDF",
        summary: "TF-IDF adjusts word frequency based on how common a term is across all documents, helping emphasize more meaningful words.",
    },
    ngram: {
        label: "N-Gram",
        summary: "N-grams capture sequences of N words (like bigrams), preserving some word order and context.",
        warningCondition: (options) => options.remove_stopwords || options.stemming,
        warningMessage: "N-gram vectorization may reduce meaningful phrase detection. Consider disabling 'Remove Stopwords' and 'Stemming' to preserve important word combinations."
    }
};
export default function VectorizationSection({ options, selectedVector, setSelectedVector, setCurrentTab, processedText, setResult }) {
    const [status, setStatus] = useState({
        applied: false,
        warning: '',
        method: '',
        loading: false,
        errorMsg: ''
    });
    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedVector(value);
        if ((value === "onehot" || value === "ngram") && vectorMethods[value].warningCondition(options)) {
            setStatus(prev => ({
                ...prev,
                warning: vectorMethods[value].warningMessage,
                applied: false
            }));
            return;
        }
        setStatus(prev => ({
            ...prev,
            warning: '',
            applied: false
        }));
    }
    const applyVectorMethod = () => {
        const method = vectorMethods[selectedVector];
        setStatus(prev => ({
            ...prev,
            warning: '',
            applied: true,
            method: method
        }))

    }
    const goToBack = () => {
        setCurrentTab('Preprocessing');
        setSelectedVector('bow');
    }
    const API_URL = import.meta.env.VITE_API_URL;
    const predictNews = async () => {
        if (!status.method) {
            setStatus(prev => ({
                ...prev,
                warning: 'Select a vectorization method first!'
            }));
            return;
        }
        if (status.applied) {
            setStatus(prev => ({
                ...prev,
                loading: true,
                errorMsg: ''
            }));
            try {
                const response = await fetch(`${API_URL}/text_vectorize`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: processedText, method: selectedVector })
                });
                if (!response.ok) {
                    if (response.status === 400) {
                        const err = await response.json();
                        throw new Error(err['error']);
                    } else {
                        throw new Error('Failed to respond');
                    }
                };
                const data = await response.json();
                setResult(data?.result);
                setCurrentTab('Prediction');
                setStatus(prev => ({
                    ...prev,
                    warning: '',
                    applied: false,
                    method: '',
                }));
            } catch (error) {
                console.error('Error :', error.message)
                setStatus(prev => ({
                    ...prev,
                    errorMsg: error.message
                }));
            } finally {
                setStatus(prev => ({
                    ...prev,
                    loading: false
                }));
            }
        }
    }
    return (
        <div className="max-w-4xl mx-auto">
            <div className='bg-green-800 text-white rounded-lg p-6'>
                <h1 className='sm:text-2xl text-xl font-bold mb-4'>Step 3: Text Vectorization</h1>
                <div className="flex md:flex-row flex-col sm:justify-between items-center">
                    <div>
                        <select className="bg-green-900 p-2" value={selectedVector} onChange={handleChange}>
                            <option value="" disabled={true}>Select Vectorization Method</option>
                            {Object.keys(vectorMethods).map(key => (
                                <option key={key} value={key}>{vectorMethods[key].label}</option>
                            ))}
                        </select>
                    </div>
                    {status.loading && (
                        <span className="italic md:my-0 my-4">Predicting...</span>
                    )}
                    {status.errorMsg && (
                        <span className="font-bold md:my-0 my-4 text-red-400">{status.errorMsg}</span>
                    )}
                    <div className="space-x-4 md:my-0 my-4">
                        <button className="sm:px-5 sm:py-2 px-4 py-1 bg-orange-500 hover:bg-orange-600 transition rounded-md"
                            onClick={applyVectorMethod}>Apply</button>
                        <button className="sm:px-5 sm:py-2 px-4 py-1 border hover:bg-green-700 transition rounded-md"
                            onClick={goToBack}>Back</button>
                        <button className={`sm:px-5 sm:py-2 px-4 py-1 rounded-md ${!status.applied || status.loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700 transition"}`}
                            onClick={predictNews} disabled={!status.applied || status.loading}>{status.loading ? "Loading..." : "Predict"}</button>
                    </div>
                </div>
            </div>
            {(status.applied || status.warning) && (
                <hr className="my-4 text-white" />
            )}
            {status.warning && (
                <div className='my-4 bg-yellow-700 rounded-lg p-6'>
                    <span className="text-white">⚠️ {status.warning}</span>
                </div>
            )}
            {status.applied && (
                <div className="my-4 bg-gray-700 rounded-lg p-6 text-white">
                    <h2 className="sm:text-xl text-md mb-4">{status.method.label} METHOD APPLIED</h2>
                    <p className="sm:text-lg text-sm italic">{status.method.summary}</p>
                </div>
            )}
        </div>
    )
}