import React, { useState, useEffect } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
// --- Constants ---
const PLAYERS = {
   X: 'Player 1',
   O: 'Computer',
};

const INITIAL_GAME_BOARD = [
   [null, null, null],
   [null, null, null],
   [null, null, null],
];
const WINNING_COMBINATIONS = [
   [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
   [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
   [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
   [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
   [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
   [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
   [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
   [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
];

// --- Helper Functions ---

function deriveBoard(logTurns) {
   const gameBoard = [...INITIAL_GAME_BOARD.map((row) => [...row])];
   for (const logTurn of logTurns) {
      const { player, square } = logTurn;
      const { col, row } = square;
      gameBoard[row][col] = player;
   }
   return gameBoard;
}

function checkWinnerInternal(board) {
   for (const combination of WINNING_COMBINATIONS) {
      const s1 = board[combination[0].row][combination[0].col];
      const s2 = board[combination[1].row][combination[1].col];
      const s3 = board[combination[2].row][combination[2].col];
      if (s1 && s1 === s2 && s1 === s3) return s1;
   }
   return null;
}

// Minimax Algorithm for unbeatable AI
function minimax(board, depth, isMaximizing) {
   const result = checkWinnerInternal(board);
   if (result === 'O') return 10 - depth;
   if (result === 'X') return depth - 10;

   const isFull = board.every((row) => row.every((cell) => cell !== null));
   if (isFull) return 0;

   if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
               board[i][j] = 'O';
               let score = minimax(board, depth + 1, false);
               board[i][j] = null;
               bestScore = Math.max(score, bestScore);
            }
         }
      }
      return bestScore;
   } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
         for (let j = 0; j < 3; j++) {
            if (board[i][j] === null) {
               board[i][j] = 'X';
               let score = minimax(board, depth + 1, true);
               board[i][j] = null;
               bestScore = Math.min(score, bestScore);
            }
         }
      }
      return bestScore;
   }
}

function findBestMove(board) {
   let bestScore = -Infinity;
   let move = { row: -1, col: -1 };
   for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
         if (board[i][j] === null) {
            board[i][j] = 'O';
            let score = minimax(board, 0, false);
            board[i][j] = null;
            if (score > bestScore) {
               bestScore = score;
               move = { row: i, col: j };
            }
         }
      }
   }
   return move;
}
// --- Main Component ---

export default function App() {
   const [players, setPlayers] = useState(PLAYERS);
   const [gameTurns, setGameTurns] = useState([]);

   const activePlayer = gameTurns.length > 0 && gameTurns[0].player === 'X' ? 'O' : 'X';
   const gameBoard = deriveBoard(gameTurns);
   const winnerSymbol = checkWinnerInternal(gameBoard);
   const winner = winnerSymbol ? players[winnerSymbol] : null;
   const hasDraw = gameTurns.length === 9 && !winner;

   // AI Turn effect
   useEffect(() => {
      if (activePlayer === 'O' && !winner && !hasDraw) {
         const timer = setTimeout(() => {
            const move = findBestMove(gameBoard);
            if (move.row !== -1) {
               handleSelectSquare(move.col, move.row);
            }
         }, 600);
         return () => clearTimeout(timer);
      }
   }, [activePlayer, winner, hasDraw, gameBoard]);

   function handleSelectSquare(colIndex, rowIndex) {
      if (gameBoard[rowIndex][colIndex] || winner) return;

      setGameTurns((prevTurns) => {
         const currentPlayer = prevTurns.length > 0 && prevTurns[0].player === 'X' ? 'O' : 'X';
         const updatedTurns = [
            { square: { col: colIndex, row: rowIndex }, player: currentPlayer },
            ...prevTurns,
         ];
         return updatedTurns;
      });
   }

   function handleRestart() {
      setGameTurns([]);
   }

   function handlePlayerNameChange(symbol, newName) {
      setPlayers((prevPlayers) => ({
         ...prevPlayers,
         [symbol]: newName,
      }));
   }

   return (
      <main>
         <div id="game-container">
            <ol id="players" className="highlight-player">
               <Player
                  name={PLAYERS.X}
                  symbol="X"
                  isActive={activePlayer === 'X'}
                  onChangeName={handlePlayerNameChange}
               />
               <Player
                  name={PLAYERS.O}
                  symbol="O"
                  isActive={activePlayer === 'O'}
                  onChangeName={handlePlayerNameChange}
               />
            </ol>
            {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
            <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
         </div>
         <Log turns={gameTurns} />
      </main>
   );
}