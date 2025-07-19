import { IoReturnUpBack } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";

export default function PredictionSection({ result, setRawText, setOptions, defaultOptions, setProcessedText, setSelectedVector, setCurrentTab }) {
    const topClasses = result.probabilities || {};
    const sortedProbabilities = Object.entries(topClasses).sort((a, b) => b[1] - a[1]);
    const categoryLabels = {
        business: "Business",
        tech: "Technology",
        politics: "Politics",
        entertainment: "Entertainment",
        sport: "Sports"
    };
    const goToPreprocessing = () => {
        setCurrentTab('Preprocessing');
        setSelectedVector('bow');
    }
    const goToInput = () => {
        setCurrentTab('Input');
        setRawText('');
        setOptions(defaultOptions);
        setProcessedText('');
        setSelectedVector('bow');
    }
    return (
        <div className="max-w-4xl mx-auto bg-green-800 text-white rounded-lg p-6">
            <h1 className="sm:text-2xl text-xl font-bold mb-4">Step 4: Prediction Result</h1>

            <div className="bg-green-900 p-4 rounded mb-6 flex flex-col sm:flex-row sm:justify-around gap-8">
                <div className="flex-1 text-center flex flex-col justify-center">
                    <p className="text-lg font-medium mb-2">Predicted Category:</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {result.prediction ? categoryLabels[result.prediction] : "N/A"}
                    </p>
                    <p className="mt-2">Confidence: {(result.probabilities?.[result.prediction] * 100).toFixed(2)}%</p>
                </div>

                <div className="hidden sm:block w-px bg-white/30 mr-6" />

                <div className="flex-1 text-sm">
                    <h4 className="text-center mb-2 text-xl">Top Category Probabilities:</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-white/20 text-left">
                            <thead className="bg-green-700">
                                <tr>
                                    <th className="px-2 py-1 border-b border-white/20">Category</th>
                                    <th className="px-2 py-1 border-b border-white/20">Probability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProbabilities.map(([category, probability]) => (
                                    <tr key={category} className="border-b border-white/10">
                                        <td className="px-2 py-1">{categoryLabels[category]}</td>
                                        <td className="px-2 py-1">{Number(probability).toFixed(5)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                    onClick={goToInput}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 transition rounded flex gap-2 items-center justify-center"
                >
                    <VscDebugRestart /> Analyze New Text
                </button>
                <button
                    onClick={goToPreprocessing}
                    className="px-4 py-2 border hover:bg-green-700 transition rounded flex gap-2 items-center justify-center"
                >
                    <IoReturnUpBack /> Back to Preprocessing
                </button>
            </div>
        </div>
    );
}
