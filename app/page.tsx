/* eslint-disable react/no-unescaped-entities */
'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToCreateGame = () => {
    router.push('/create-game'); // Assuming the create game page is at this path
  };

  return (
    <div className="min-h-screen bg-pastelGreen flex flex-col justify-center items-center text-black">
      <div className="max-w-4xl text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-black">Welcome to the Marriage Game Tracker</h1>
        <p className="text-xl mb-6 text-black">
          This tool allows you to keep track of scores for the card game "Marriage." You can create a game, add players, and calculate scores in real-time based on the rules of the game.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4 text-black">How to Use:</h2>
        <ul className="text-lg list-disc list-inside mb-8 text-black">
          <li>Click "Create New Game" to input the number of players and their names.</li>
          <li>For each round, players will check if they've "seen" and input their scores.</li>
          <li>Track if players are "finished" or playing in "dupli" mode.</li>
        </ul>

        <p className="text-lg mb-8 text-black">
          If a player with "dupli" finishes, input an additional 5 points to their score. If a "dupli" player has seen, their score will be calculated without the +3 to the total points. 
        </p>

        <button
          onClick={navigateToCreateGame}
          className="bg-pastelGreen text-black px-6 py-3 rounded-lg text-xl hover:bg-green-500 transition duration-300"
        >
          Create New Game
        </button>
      </div>
    </div>
  );
}
