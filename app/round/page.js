/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Importing useRouter

export default function RoundInput() {
  const [players, setPlayers] = useState([]);
  const [roundScores, setRoundScores] = useState([]);  // To store the round scores
  const [finishedPlayer, setFinishedPlayer] = useState(null);  // Track the finished player
  const router = useRouter();  // Initialize useRouter

  useEffect(() => {
    const playerNames = JSON.parse(localStorage.getItem('players')) || [];
    setPlayers(playerNames.map(name => ({ name, seen: false, score: '', finished: false, dupli: false })));

    const savedRoundScores = JSON.parse(localStorage.getItem('roundScores')) || []; // Load saved round scores
    setRoundScores(savedRoundScores);
  }, []);

  const handleFinish = (index) => {
    setPlayers(players.map((player, i) => {
      if (i === index) {
        return { ...player, finished: true };
      }
      return { ...player, finished: false };  // Reset the 'finished' flag for others
    }));
    setFinishedPlayer(index);  // Set the most recent player as finished
  };

  const handleDupliToggle = (index) => {
    setPlayers(players.map((player, i) => ({
      ...player,
      dupli: i === index ? !player.dupli : player.dupli,
    })));
  };

  const calculateScores = () => {
    const hasFinishedPlayer = players.some(player => player.finished);
    if (!hasFinishedPlayer) {
      return alert('At least one player must have finished the game!');
    }

    const seenPlayers = players.filter(player => player.seen);
    const totalSeenScore = seenPlayers.reduce((sum, player) => sum + (parseFloat(player.score) || 0), 0);
    const playerCount = players.length;

    const updatedPlayers = players.map(player => {
      let newScore = 0;
      if (player.seen) {
        if (player.dupli) {
          newScore = (parseFloat(player.score) * playerCount) - totalSeenScore;
        } else {
          newScore = (parseFloat(player.score) * playerCount) - (totalSeenScore + 3);
        }
      } else {
        newScore = (parseFloat(player.score) || 0) - (totalSeenScore + 10);
      }
      return { ...player, score: newScore };
    });

    const finisherIndex = updatedPlayers.findIndex(player => player.finished);
    if (finisherIndex !== -1) {
      const totalScoreWithoutFinisher = updatedPlayers.reduce((sum, player) => sum + (parseFloat(player.score) || 0), 0);
      const remainingScore = -totalScoreWithoutFinisher;
      updatedPlayers[finisherIndex].score += remainingScore;
    }

    setRoundScores(prevScores => {
      const newScores = [...prevScores, updatedPlayers.map(player => ({ name: player.name, score: player.score }))];
      localStorage.setItem('roundScores', JSON.stringify(newScores)); // Save round scores to localStorage
      return newScores;
    });

    setPlayers(players.map(player => ({ ...player, score: '', seen: false, finished: false, dupli: false })));
    setFinishedPlayer(null);  // Reset the finished player after calculating
  };

  const undoLastRound = () => {
    if (roundScores.length > 0) {
      setRoundScores(prevScores => {
        const newScores = prevScores.slice(0, -1);
        localStorage.setItem('roundScores', JSON.stringify(newScores)); // Save updated round scores to localStorage
        return newScores;
      });
    }
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

  // Function to handle the "Green Button" click and navigate to /endgame
  const endGame = () => {
    router.push('/endgame');  // This will navigate to the '/endgame' page
  };

  const totalScores = getTotalScores();

  return (
    <div className="min-h-screen bg-pastelBlue flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl flex">
        {/* Left Side: Score Input */}
        <div className="w-1/2 mr-6">
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

          <div className="flex mt-4 space-x-4">
            <button
              onClick={undoLastRound}
              className="bg-red-500 text-white p-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 w-1/2"
            >
              Undo Last Round
            </button>
            <button
              onClick={endGame}  // Call endGame function here
              className="bg-green-500 text-white p-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 w-1/2"
            >
              End Game
            </button>
          </div>
        </div>

        {/* Right Side: Round Results Table */}
        <div className="w-1/2">
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
