import { useEffect, useState } from "react";

const WARNING_LIMIT = 3000;
const MAX_CHAR_LIMIT = 3500;
const initialStatus = {
    error: false,
    emptyInput: false,
    warning: false,
    maxLimitReached: false
}

export default function TextInputSection({ rawText, setRawText, setOptions, defaultOptions, setSelectedVector, setCurrentTab }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [status, setStatus] = useState(initialStatus);
    const wordsCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
    const textLength = rawText.length;
    console.log(textLength);
    setOptions(defaultOptions);
    setSelectedVector('bow');
    useEffect(() => {
        setStatus(prev => ({
            ...prev,
            warning: textLength > WARNING_LIMIT && textLength < MAX_CHAR_LIMIT,
            maxLimitReached: textLength >= MAX_CHAR_LIMIT,
            error: false,
            emptyInput: false
        }));
    }, [textLength, isSubmitted]);
    const handleTextInput = (e) => {
        const textValue = e.target.value;
        if (textValue.length <= MAX_CHAR_LIMIT) {
            setRawText(textValue);
        }
    }
    const clearRawText = () => {
        setRawText('');
        setStatus(initialStatus);
    }
    const handleSubmit = () => {
        setIsSubmitted(true);
        const trimmedText = rawText.trim();
        if (trimmedText === '') {
            setStatus(prev => ({
                ...prev,
                emptyInput: true,
                error: false
            }))
            return;
        }
        if (wordsCount(rawText) > 0 && wordsCount(rawText) < 3) {
            setStatus(prev => ({
                ...prev,
                emptyInput: false,
                error: true
            }))
            return;
        }
        setRawText(trimmedText);
        setCurrentTab('Preprocessing');
    }
    return (
        <div className='max-w-4xl mx-auto bg-green-800 text-white rounded-lg sm:p-6 p-3'>
            <div className="flex justify-between">
                <h1 className='sm:text-2xl text-lg font-bold sm:mb-4 mb-2'>Step 1: News Text Input</h1>
                <div className="text-right">
                    <p className="font-bold sm:text-base text-sm">CHAR SIZE</p>
                    <p className="text-sm"><span className={textLength >= WARNING_LIMIT ? "text-orange-300" : ""}>{textLength}</span>/{MAX_CHAR_LIMIT}</p>
                </div>
            </div>
            <textarea className='w-full sm:text-lg text-md bg-green-900 sm:p-3 p-2 border rounded sm:mb-4 mb-2'
                placeholder='Paste News Content Here...'
                rows={6}
                value={rawText}
                onChange={handleTextInput}
            />

            <div className='flex flex-row flex-wrap justify-between items-center gap-4 sm:text-base text-sm'>

                <div className="">
                    {status.error && (
                        <span className='text-red-400'>Input must have at least 3 words.</span>
                    )}
                    {status.emptyInput && (
                        <span className='font-bold text-red-400'>Please fill out the text.</span>
                    )}
                    {status.warning && (
                        <span className="text-orange-300">⚠️ You're approaching the maximum character limit.</span>
                    )}
                    {status.maxLimitReached && (
                        <span className="text-red-400 font-semibold">🚫 Maximum character limit reached!</span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={clearRawText}
                        disabled={textLength === 0}
                        className={`sm:px-4 sm:py-2 px-3 py-1 rounded ${textLength === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 transition" }`}
                    >Clear</button>
                    <button onClick={handleSubmit}
                        className='bg-yellow-600 sm:px-4 sm:py-2 px-3 py-1 rounded hover:bg-yellow-700 transition'
                    >Submit</button>
                </div>
            </div>
        </div>
    )
}