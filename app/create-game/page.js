/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGame() {
  const [players, setPlayers] = useState([{ name: '' }]);
  const router = useRouter();

  const addPlayer = () => setPlayers([...players, { name: '' }]);
  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = value;
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    const playerNames = players.map(p => p.name.trim()).filter(Boolean);
    if (playerNames.length < 2) return alert('At least 2 players are required!');
    
    // Save players to localStorage
    localStorage.setItem('players', JSON.stringify(playerNames));
    router.push('/round'); // Navigate to the round input page
  };

  return (
    <div className="min-h-screen bg-pastelPurple flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create a New Game</h1>
        
        {players.map((player, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder={`Player ${index + 1} name`}
              value={player.name}
              onChange={e => handlePlayerChange(index, e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div className="flex justify-between mb-4">
          <button
            onClick={addPlayer}
            className="bg-indigo-600 text-white p-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Add Player
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startGame}
            className="bg-pastelPurple text-black px-6 py-3 rounded-lg text-xl hover:bg-darkPurple transition duration-300"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
