'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EndGame() {
  const [pointValue, setPointValue] = useState(0.1); // Default to 10 cents
  const [customPoint, setCustomPoint] = useState('');
  const [totalScores, setTotalScores] = useState([]);
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the player names and scores from localStorage or previous session data
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const storedScores = JSON.parse(localStorage.getItem('roundScores')) || [];

    setPlayers(storedPlayers);

    // Calculate total scores for each player
    const playerScores = storedPlayers.map(player => {
      const playerScore = storedScores.reduce((total, round) => {
        const roundPlayer = round.find(p => p.name === player.name);
        return total + (roundPlayer ? parseFloat(roundPlayer.score) : 0);
      }, 0);
      return playerScore;
    });

    setTotalScores(playerScores);
  }, []);

  const handlePointChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setCustomPoint(value);
      if (value !== '') setPointValue(parseFloat(value));
    }
  };

  const calculateWinnings = () => {
    const totalPoints = totalScores.reduce((sum, score) => sum + score, 0);
    const pointPerPlayer = pointValue * totalScores.length;

    const results = players.map((player, index) => {
      const playerScore = totalScores[index];
      const playerWinnings = (playerScore / totalPoints) * pointPerPlayer;
      return {
        name: player.name,
        score: playerScore,
        winnings: playerWinnings,
      };
    });

    return results;
  };

  const results = calculateWinnings();

  const handleFinishGame = () => {
    // Optionally, reset the game or navigate to another page
    router.push('/create-game');
  };

  return (
    <div className="min-h-screen bg-pastelBlue flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">End Game</h1>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Select Point Value</h2>
          <div className="flex items-center mb-4">
            <label className="mr-2">10 cents</label>
            <input
              type="radio"
              value={0.1}
              checked={pointValue === 0.1}
              onChange={() => setPointValue(0.1)}
              className="mr-4"
            />

            <label className="mr-2">25 cents</label>
            <input
              type="radio"
              value={0.25}
              checked={pointValue === 0.25}
              onChange={() => setPointValue(0.25)}
              className="mr-4"
            />

            <label className="mr-2">50 cents</label>
            <input
              type="radio"
              value={0.5}
              checked={pointValue === 0.5}
              onChange={() => setPointValue(0.5)}
              className="mr-4"
            />

            <label className="mr-2">1 dollar</label>
            <input
              type="radio"
              value={1}
              checked={pointValue === 1}
              onChange={() => setPointValue(1)}
              className="mr-4"
            />

            <label className="mr-2">Custom</label>
            <input
              type="radio"
              value="custom"
              checked={customPoint !== ''}
              onChange={() => setPointValue(parseFloat(customPoint) || 0)}
              className="mr-4"
            />
            <input
              type="text"
              value={customPoint}
              onChange={handlePointChange}
              className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Custom Value"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Player Winnings</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Player</th>
                <th className="px-4 py-2 border-b">Score</th>
                <th className="px-4 py-2 border-b">Winnings</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b">{result.name}</td>
                  <td className="px-4 py-2 border-b">{result.score}</td>
                  <td className="px-4 py-2 border-b">${result.winnings.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleFinishGame}
          className="bg-blue-500 text-white p-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 w-full mt-6"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
