import React, { useState, useEffect } from 'react';
import { Trophy, Frown, Meh, Smile, Crown } from 'lucide-react';

const SplashScreen = ({ score, resetGame, maxPossibleGold }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          resetGame();
        }
        return prevCount - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resetGame]);

  const getEmoji = (score, maxPossibleGold) => {
    const ratio = score / maxPossibleGold;
    if (ratio < 0.3) return <Frown size={64} className="text-red-500" />;
    if (ratio < 0.6) return <Meh size={64} className="text-yellow-500" />;
    if (ratio < 0.9) return <Smile size={64} className="text-green-500" />;
    return <Crown size={64} className="text-purple-500" />;
  };

  const getMessage = (score, maxPossibleGold) => {
    const ratio = score / maxPossibleGold;
    if (ratio < 0.3) return "Keep practicing, you'll improve!";
    if (ratio < 0.6) return "Good effort! There's room for growth.";
    if (ratio < 0.9) return "Great job! You're close to perfection!";
    return "Perfect score! You've mastered the Golden Labyrinth!";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-indigo-100 z-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-2xl transform animate-scale-in">
        <h2 className="text-5xl font-bold text-indigo-300 mb-4">Congratulations!</h2>
        <p className="text-3xl text-gray-700 mb-4">You successfully reached home !</p>
        <div className="flex justify-center items-center space-x-4 mb-6">
          {getEmoji(score, maxPossibleGold)}
          <div>
            <p className="text-4xl font-bold text-yellow-500">Your score: {score}</p>
            <p className="text-2xl font-semibold text-green-500">Max possible: {maxPossibleGold}</p>
          </div>
        </div>
        <p className="text-xl text-gray-600 mb-6">{getMessage(score, maxPossibleGold)}</p>
        <div className="flex justify-center mb-6">
          <Trophy size={48} className="text-yellow-500 animate-bounce" />
        </div>
        <p className="text-2xl text-gray-600">Restarting in <span className="font-bold text-indigo-600">{countdown}</span> seconds...</p>
      </div>
    </div>
  );
};

export default SplashScreen;