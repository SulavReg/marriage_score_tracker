'use client';
import { useEffect, useState } from 'react';

export default function RoundInput() {
  const [players, setPlayers] = useState([]);
  const [roundScores, setRoundScores] = useState([]);

  useEffect(() => {
    const playerNames = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(playerNames.map(name => ({ name, seen: false, score: '', finished: false, dupli: false })));
  }, []);

  const handleFinish = (index) => {
    setPlayers(players.map((player, i) => ({
      ...player,
      finished: i === index,
    })));
  };

  const handleDupliToggle = (index) => {
    setPlayers(players.map((player, i) => ({
      ...player,
      dupli: i === index ? !player.dupli : player.dupli,
    })));
  };

  const calculateScores = () => {
    // Step 1: Calculate the total score of seen players
    const seenPlayers = players.filter(player => player.seen);
    const totalSeenScore = seenPlayers.reduce((sum, player) => sum + (parseFloat(player.score) || 0), 0);
    const playerCount = players.length;

    // Step 2: Calculate scores for each player
    const updatedPlayers = players.map(player => {
      let newScore = 0;
      if (player.seen) {
        // Seen players adjust their score using the formula
        if (player.dupli) {
          // Dupli players don't get the +3
          newScore = (parseFloat(player.score) * playerCount) - totalSeenScore;
        } else {
          // Seen players get the +3 added
          newScore = (parseFloat(player.score) * playerCount) - (totalSeenScore + 3);
        }
      } else {
        // Unseen players get a penalty based on the total seen score + 10
        newScore = (parseFloat(player.score) || 0) - (totalSeenScore + 10);
      }

      return { ...player, score: newScore };
    });

    // Step 3: Apply the finisher's score adjustment
    const finisherIndex = updatedPlayers.findIndex(player => player.finished);
    if (finisherIndex !== -1) {
      const totalScoreWithoutFinisher = updatedPlayers.reduce((sum, player) => sum + (parseFloat(player.score) || 0), 0);
      const remainingScore = -totalScoreWithoutFinisher;  // The remainder to make the total score zero
      updatedPlayers[finisherIndex].score += remainingScore;  // Finisher takes the remainder
    }

    // Step 4: Save the round's scores to the history and reset for next round
    setRoundScores(prevScores => [
      ...prevScores,
      updatedPlayers.map(player => ({ name: player.name, score: player.score })),
    ]);

    // Reset the input fields for the next round
    setPlayers(players.map(player => ({ ...player, score: '', seen: false, finished: false, dupli: false })));
  };

  const handleScoreChange = (e, index) => {
    const value = e.target.value;
    setPlayers(players.map((player, i) =>
      i === index ? { ...player, score: value } : player
    ));
  };

  const getTotalScores = () => {
    return players.map(player => {
      return roundScores.reduce((total, round) => {
        const playerScore = round.find(p => p.name === player.name)?.score || 0;
        return total + parseFloat(playerScore);
      }, 0);
    });
  };

  const totalScores = getTotalScores();

  return (
    <div className="min-h-screen bg-pastelBlue flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl flex">
        {/* Left Side: Score Input */}
        <div className="w-2/3 mr-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Round Input</h1>

          {players.map((player, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-medium">{player.name}</h3>
              <div className="flex items-center mb-2">
                <label className="mr-2">Seen:</label>
                <input
                  type="checkbox"
                  checked={player.seen}
                  onChange={e =>
                    setPlayers(players.map((p, i) =>
                      i === index ? { ...p, seen: e.target.checked } : p
                    ))
                  }
                  className="mr-4"
                />
                
                {/* Only show score input if "seen" is true */}
                {player.seen && (
                  <>
                    <input
                      type="number"
                      value={player.score || ''}
                      onChange={(e) => handleScoreChange(e, index)}
                      className="p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <label className="ml-2">Finished:</label>
                    <input
                      type="radio"
                      checked={player.finished}
                      onChange={() => handleFinish(index)}
                      className="ml-2"
                    />
                    <label className="ml-4">Dupli:</label>
                    <input
                      type="checkbox"
                      checked={player.dupli}
                      onChange={() => handleDupliToggle(index)}
                      className="ml-2"
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={calculateScores}
            className="bg-blue-500 text-white p-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 w-full mt-6"
          >
            Calculate Scores
          </button>
        </div>

        {/* Right Side: Round Results Table */}
        <div className="w-1/3">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Round Results</h2>

          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Round</th>
                  {players.map((player) => (
                    <th key={player.name} className="px-4 py-2 border-b">{player.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roundScores.map((scores, roundIndex) => (
                  <tr key={roundIndex}>
                    <td className="px-4 py-2 border-b">{roundIndex + 1}</td>
                    {players.map((player) => {
                      const score = scores.find(p => p.name === player.name)?.score || 0;
                      return (
                        <td key={player.name} className="px-4 py-2 border-b">{score}</td>
                      );
                    })}
                  </tr>
                ))}
                {/* Total Scores Row */}
                <tr>
                  <td className="px-4 py-2 font-semibold">Total</td>
                  {totalScores.map((total, index) => (
                    <td key={index} className="px-4 py-2 font-semibold">{total}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}