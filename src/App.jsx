import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winningCompinatios";

const PLAYERS = {
   X: 'player 1',
   O: 'player 2',
}
const INITIAL_GAME_BOARD = [
   [null, null, null],
   [null, null, null],
   [null, null, null],
];
function driveBoard(logTurns) {
   const gameBoard = [...INITIAL_GAME_BOARD.map(row => [...row])];
   for (const logTurn of logTurns) {
      const { player, square } = logTurn;
      const { Col, Row } = square;
      gameBoard[Row][Col] = player;
   }
   return gameBoard;
}
function driveWinner(gameBoard, players) {
   let winner;
   for (const combination of WINNING_COMBINATIONS) {
      const firstSquareSymbol = gameBoard[combination[0].col][combination[0].row];
      const secondSquareSymbol = gameBoard[combination[1].col][combination[1].row];
      const thirdSquareSymbol = gameBoard[combination[2].col][combination[2].row];

      if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
         winner = players[firstSquareSymbol];
         break;
      }
   }
   return winner;
}
function App() {
   const [players, setPlayers] = useState(PLAYERS);
   const [logTurns, setLogTurns] = useState([]);
   const [currentPlayer, setCurrentPlayer] = useState('X');
   const gameBoard = driveBoard(logTurns);
   const winner = driveWinner(gameBoard, players);
   const hasDraw = logTurns.length === 9 && !winner;
   const handleRematchGame = () => setLogTurns([]);
   const handleOnSeletClick = (colIndex, rowIndex) => {
      setLogTurns(prevTurns => {
         const newTurn = { player: currentPlayer, square: { Col: colIndex, Row: rowIndex }, isWinner: false };
         setCurrentPlayer(prevPlayer => prevPlayer === 'X' ? 'O' : 'X');
         return (
            [newTurn, ...prevTurns]
         )
      })
   }
   const handleChangePlayersNames = (symbol, newName) => {
      setPlayers(prevPlayers => {
         return {
            ...prevPlayers,
            [symbol]: newName,
         }
      });
   }
   return (
      <main>
         <div id="game-container">
            <ol id="players" className="highlight-player">
               <Player playerName={PLAYERS.X}
                  playerSymbol='X'
                  onPlayerNameChange={handleChangePlayersNames}
                  isActive={currentPlayer === 'X'} />
               <Player playerName={PLAYERS.O}
                  playerSymbol='O'
                  onPlayerNameChange={handleChangePlayersNames}
                  isActive={currentPlayer === 'O'} />
            </ol>
            {(hasDraw || winner) && <GameOver winner={winner} onRematchGame={handleRematchGame} />}
            <GameBoard
               gameBoard={gameBoard}
               currentPlayer={logTurns.length && logTurns[0].player}
               onSelectSquare={handleOnSeletClick}
               winner={winner}
            />
         </div>

         <Log logTurns={logTurns}
         />
      </main>
   )
}

export default App


