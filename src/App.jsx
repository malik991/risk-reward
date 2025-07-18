import { useState } from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported

function App() {
  const [entryPrice, setEntryPrice] = useState("");
  const [capital, setCapital] = useState("");
  const [riskInput, setRiskInput] = useState("");
  const [riskType, setRiskType] = useState("fixed"); // 'fixed' or 'percent'
  const [rrRatio, setRrRatio] = useState("");
  const [stopLoss, setStopLoss] = useState(null);
  const [takeProfit, setTakeProfit] = useState(null);
  const [calculatedRiskAmount, setCalculatedRiskAmount] = useState(null);

  const calculateRR = () => {
    if (!entryPrice || !capital || !riskInput || !rrRatio) {
      alert("Please fill in all fields.");
      return;
    }

    const capitalNum = parseFloat(capital);
    const entryPriceNum = parseFloat(entryPrice);
    const rrRatioNum = parseFloat(rrRatio);

    const tokens = capitalNum / entryPriceNum;

    // Calculate actual risk amount depending on risk type
    let riskAmount =
      riskType === "percent"
        ? (parseFloat(riskInput) / 100) * capitalNum
        : parseFloat(riskInput);

    const riskPerToken = riskAmount / tokens;
    const rewardPerToken = riskPerToken * rrRatioNum;

    setStopLoss((entryPriceNum - riskPerToken).toFixed(4));
    setTakeProfit((entryPriceNum + rewardPerToken).toFixed(4));
    setCalculatedRiskAmount(riskAmount.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700">
          Risk-Reward Calculator
        </h1>

        <div className="space-y-4">
          <Input
            label="Entry Price"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="e.g. 0.7983"
          />

          <Input
            label="Capital ($)"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="e.g. 100"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base"
              value={riskType}
              onChange={(e) => setRiskType(e.target.value)}
            >
              <option value="fixed">Fixed Amount ($)</option>
              <option value="percent">Percent of Capital (%)</option>
            </select>
          </div>

          <Input
            label={
              riskType === "fixed"
                ? "Risk Amount ($)"
                : "Risk Percentage of Capital (%)"
            }
            value={riskInput}
            onChange={(e) => setRiskInput(e.target.value)}
            placeholder={riskType === "fixed" ? "e.g. 5" : "e.g. 1.3"}
          />

          <Input
            label="Risk:Reward Ratio (1:X)"
            value={rrRatio}
            onChange={(e) => setRrRatio(e.target.value)}
            placeholder="e.g. 2 or 2.7"
          />

          <button
            onClick={calculateRR}
            className="w-full bg-blue-600 text-white text-base md:text-lg py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Calculate
          </button>
        </div>

        {stopLoss && takeProfit && (
          <div className="bg-blue-50 rounded-lg p-4 text-center space-y-2 border border-blue-200">
            <p className="text-gray-700 text-sm">
              <strong>Effective Risk Amount:</strong> ${calculatedRiskAmount}
            </p>
            <p className="text-blue-700 text-lg">
              <strong>Stop-Loss:</strong> ${stopLoss}
            </p>
            <p className="text-green-700 text-lg">
              <strong>Take-Profit:</strong> ${takeProfit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Input component
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      type="number"
      step="any"
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default App;
