
export default function GameBoard({ onSelectSquare, gameBoard, winner }) {

   return (
      <>
         <ol id="game-board">
            {gameBoard.map((row, rowIndex) => (
               <li key={rowIndex}>
                  <ol>
                     {row.map((playerSymbol, colIndex) => (
                        <li key={colIndex}>
                           <button
                              disabled={playerSymbol !== null || winner}
                              onClick={() => {
                                 onSelectSquare(colIndex, rowIndex);
                              }}>{playerSymbol}</button>
                        </li>
                     ))}
                  </ol>
               </li>
            ))}
         </ol>
      </>
   )
}
