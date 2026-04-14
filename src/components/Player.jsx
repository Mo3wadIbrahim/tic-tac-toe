import { useState } from "react";

export default function Player({ playerName, playerSymbol, isActive, onPlayerNameChange }) {
   const [isEditing, setIsEditing] = useState(false);
   const [editingName, setEditingName] = useState(playerName);
   const playerNameElement = isEditing ? <input type="text" required value={editingName} onChange={(e) => setEditingName(e.target.value)} /> : <span className="player-name">{editingName}</span>;
   return (
      <>
         <li className={isActive ? 'active' : undefined}>
            <span className="player-info">
               {playerNameElement}
               <span className="player-symbol">{playerSymbol}</span>
            </span>
            <button onClick={() => {
               setIsEditing(prev => !prev);
               isEditing && onPlayerNameChange(playerSymbol, editingName);
            }}>{isEditing ? 'Save' : 'Edit'}</button>
         </li>
      </>
   )
}