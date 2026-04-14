export default function Log({ logTurns }) {
   return <ol id="log">
      {logTurns.map((logTurn, index) => {
         const { player, square } = logTurn;
         const { Col, Row } = square;

         return (
            <li key={index}>
               Player Symbol: {player} - Col: {Col} - Row: {Row}
            </li>
         )
      })}
   </ol>
}