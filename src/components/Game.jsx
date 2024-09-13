import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MdArrowUpward, MdArrowDownward, MdArrowForward, MdArrowBack, MdHome, MdRefresh } from 'react-icons/md';
import { GiGoldBar, GiBrickWall, GiRunningNinja } from 'react-icons/gi';
import SplashScreen from './SplashScreen';
import ConfirmationDialog from './ConfirmationDialog';
import GoldAnimation from './GoldAnimation';
import { gridData } from '../generateGrid/gridData';
import { Trophy } from 'lucide-react';



const Game = () => {
    const [playerPosition, setPlayerPosition] = useState([0, 0]);
    const [blockers, setBlockers] = useState([]);
    const [gold, setGold] = useState([]);
    const [visited, setVisited] = useState(new Set(['0,0']));
    const [score, setScore] = useState(0);
    const [showSplash, setShowSplash] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(() => { });
    const [showGoldAnimation, setShowGoldAnimation] = useState(false);
    const [goldPosition, setGoldPosition] = useState([0, 0]);
    const [showSolution, setShowSolution] = useState(false);
    const [maxPossibleGold, setMaxPossibleGold] = useState(0);
    const [currentGridIndex, setCurrentGridIndex] = useState(0);
    const [isCalculatingSolution, setIsCalculatingSolution] = useState(false);

    const getGridData = () => {
        const currentGrid = gridData[currentGridIndex];

        return {
            blockers: currentGrid.obstacles.map(obs => `${obs.x},${obs.y}`),
            gold: currentGrid.gold.map(g => `${g.x},${g.y}`),
            maxGold: currentGrid.maxGold
        };
    };

    const handleViewSolution = () => {
        setShowSolution(true);
        setIsCalculatingSolution(true);
        setTimeout(() => {
            const { maxGold } = getGridData();
            setMaxPossibleGold(maxGold);
            setIsCalculatingSolution(false);
        }, 1000);
    };

    const handleCloseSolution = () => {
        setShowSolution(false);
    };

    const handleKeyPress = (event) => {
        switch (event.key) {
            case 'ArrowUp': movePlayer('up'); break;
            case 'ArrowDown': movePlayer('down'); break;
            case 'ArrowLeft': movePlayer('left'); break;
            case 'ArrowRight': movePlayer('right'); break;
            default: break;
        }
    };

    useEffect(() => {
        resetGame();
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handleNewGame = () => {
        setConfirmationAction(() => () => {
            resetGame();
            setShowConfirmation(false);
        });
        setShowConfirmation(true);
    };

    const handleResetGame = () => {
        setConfirmationAction(() => () => {
            resetGame(currentGridIndex);
            setShowConfirmation(false);
        });
        setShowConfirmation(true);
    };

    const resetGame = (gridIndex = null) => {
        const newGridIndex = gridIndex !== null ? gridIndex : Math.floor(Math.random() * gridData.length);
        setCurrentGridIndex(newGridIndex);
        const { blockers, gold, maxGold } = getGridData();
        setBlockers(blockers);
        setGold(gold);
        setMaxPossibleGold(maxGold);
        setPlayerPosition([0, 0]);
        setScore(0);
        setVisited(new Set(['0,0']));
        setShowSplash(false);
    };

    const movePlayer = (direction) => {
        let [x, y] = playerPosition;
        if (direction === 'up') x--;
        else if (direction === 'down') x++;
        else if (direction === 'left') y--;
        else if (direction === 'right') y++;

        const newPosition = [x, y];
        const newPositionKey = `${x},${y}`;

        if (x < 0 || x > 7 || y < 0 || y > 7 || blockers.includes(newPositionKey)) {
            toast.error("Can't move there!");
            return;
        }

        if (visited.has(newPositionKey)) {
            toast("You have already visited this cell!", { icon: '🔄' });
            return;
        }

        if (gold.includes(newPositionKey)) {
            setGoldPosition([x, y]);
            setShowGoldAnimation(true);
            setTimeout(() => {
                setScore(score + 1);
                setGold(gold.filter(g => g !== newPositionKey));
                setShowGoldAnimation(false);
                toast.success("Gold collected!");
            }, 1000);
        }

        setVisited(new Set(visited.add(newPositionKey)));
        setPlayerPosition(newPosition);
        if (newPositionKey === '7,7') {
            setShowSplash(true);
        }
    };

    const isGameOver = playerPosition[0] === 7 && playerPosition[1] === 7;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-2/3 pr-4">
                <h1 className="text-4xl font-bold mb-6 text-indigo-700 tracking-wide">Crystal Quest: The Golden Labyrinth</h1>
                <div className="grid grid-cols-8 gap-1 bg-indigo-200 p-2 rounded-lg shadow-xl" style={{ width: '80vmin', height: '80vmin' }}>
                    {Array.from({ length: 64 }, (_, index) => {
                        const row = Math.floor(index / 8);
                        const col = index % 8;
                        const positionKey = `${row},${col}`;
                        let cellContent = null;
                        let cellClass = "w-full h-full flex items-center justify-center border border-indigo-300 transition-all duration-300";

                        if (blockers.includes(positionKey)) {
                            cellContent = <GiBrickWall className="text-red-600 text-3xl" />;
                            cellClass += " bg-red-100";
                        } else if (gold.includes(positionKey)) {
                            cellContent = <GiGoldBar className="text-yellow-500 text-3xl" />;
                            cellClass += " bg-yellow-100";
                        } else if (playerPosition[0] === row && playerPosition[1] === col) {
                            cellContent = <GiRunningNinja className="text-green-600 text-3xl" />;
                            cellClass += " bg-green-100";
                        } else if (visited.has(positionKey)) {
                            cellClass += " bg-gray-200";
                        } else {
                            cellClass += " bg-white";
                        }

                        if (positionKey === '0,0' || positionKey === '7,7') {
                            cellClass += " relative";
                            const homeIcon = <MdHome className="text-blue-500 text-xl absolute top-1 left-1" />;
                            cellContent = (
                                <>
                                    {homeIcon}
                                    {cellContent}
                                </>
                            );
                        }

                        return (
                            <div key={index} className={cellClass} style={{ width: '10vmin', height: '10vmin' }}>
                                {cellContent}
                            </div>
                        );
                    })}
                </div>
                {showGoldAnimation && (
                    <GoldAnimation
                        startPosition={goldPosition}
                        endPosition={[8, 0]}
                    />
                )}
            </div>
            <div className="w-1/3 flex flex-col justify-center items-center">
                <div className="mb-8 flex justify-center space-x-4">
                    <button onClick={() => movePlayer('left')} className="p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-200">
                        <MdArrowBack size={32} />
                    </button>
                    <button onClick={() => movePlayer('up')} className="p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-200">
                        <MdArrowUpward size={32} />
                    </button>
                    <button onClick={() => movePlayer('down')} className="p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-200">
                        <MdArrowDownward size={32} />
                    </button>
                    <button onClick={() => movePlayer('right')} className="p-4 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-200">
                        <MdArrowForward size={32} />
                    </button>
                </div>
                <div className="mb-8">
                    <button onClick={handleNewGame} className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition duration-200 mr-4">
                        New Game
                    </button>
                    <button onClick={handleResetGame} className="px-6 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition duration-200">
                        Reset Game
                    </button>
                    <button onClick={handleViewSolution} className="px-6 py-3 mx-4 bg-red-300 text-white rounded-full shadow-lg hover:bg-red-600 transition duration-200 mr-4">View Solution</button>
                </div>
                <div className="text-3xl font-bold text-indigo-700">
                    Score: {score}
                </div>
            </div>
            {showSplash && <SplashScreen score={score} maxPossibleGold={maxPossibleGold} resetGame={resetGame} />}
            {showConfirmation && (
                <ConfirmationDialog
                    onConfirm={confirmationAction}
                    onCancel={() => setShowConfirmation(false)}
                    message="Are you sure you want to start a new game? Your current progress will be lost."
                />
            )}
            {showGoldAnimation && <GoldAnimation />}
            {showSolution && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Solution</h2>
                        {isCalculatingSolution ? (
                            <div className="flex flex-col items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                                <p className="mt-4 text-lg text-gray-600">Calculating maximum possible gold...</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Maximum Possible Gold</h3>
                                <div className="flex items-center justify-center mb-6">
                                    <Trophy size={48} className="text-yellow-500 mr-4" />
                                    <p className="text-5xl font-bold text-yellow-500">{maxPossibleGold}</p>
                                </div>
                                <p className="text-gray-600">This is the maximum amount of gold you can collect on this grid.</p>
                            </div>
                        )}
                        <button
                            onClick={handleCloseSolution}
                            className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 w-full text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;