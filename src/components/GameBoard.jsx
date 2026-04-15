function GameBoard({ board, onSelectSquare, activePlayer }) {
   return (
      <ol id="game-board">
         {board.map((row, rowIndex) => (
            <li key={rowIndex}>
               <ol>
                  {row.map((playerSymbol, colIndex) => (
                     <li key={colIndex}>
                        <button onClick={() => onSelectSquare(colIndex, rowIndex)} disabled={(playerSymbol !== null || activePlayer === 'X')}>
                           {playerSymbol}
                        </button>
                     </li>
                  ))}
               </ol>
            </li>
         ))}
      </ol>
   );
}
export default GameBoard;