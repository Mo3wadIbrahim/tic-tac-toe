export default function GameOver({ winner, onRematchGame }) {

   return (
      <div id="game-over">
         <h2>Game Over!</h2>
         {winner && <p>{winner} Won!</p>}
         {!winner && <p>It's a draw!</p>}
         <p>
            <button
               onClick={onRematchGame}
            >
               Rematch Game!
            </button>
         </p>
      </div>
   )
}