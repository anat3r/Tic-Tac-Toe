import { useState } from 'react';

function Square({value, onSquareClick }) {
  let isWin = false;
  if (value && value[0] == 'w')
  {
    value = value[1]
    isWin = true;
  }
  return (
    <button className={((isWin) ? "square win" : "square")} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ currentMove, squares, onPlay}) {
  const winner = calculateWinner(squares);
  let status;
  if (winner){
    status = "Winner: " + winner.at(-1);
  }
  else{
    status = "Next player: " + ((currentMove % 2 == 0) ? "X" : "0")
  }

  function handleClick(i) {
    try{
      const nextSquares = squares.slice();
      if (nextSquares[i] || calculateWinner(squares)){
        return
      }
      nextSquares[i] = (currentMove % 2 == 0) ? 'X' : "O";

      onPlay(nextSquares);
    } catch(e){
      console.log(e.name + e.message);
    }
  }

  let board = Array(3).fill(null);
  for (let colN = 0; colN < 3; colN++) {
    let rows = Array(3).fill(null);
    for (let rowN = 0; rowN < 3; rowN++) {
      rows[rowN] = <Square key={rowN} value={squares[colN * 3 + rowN]} onSquareClick={() => handleClick(colN * 3 + rowN)} />
    }
    board[colN] = <div key={colN} className='board-row'>{rows}</div>
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>{board}</div>
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key = {move}>
        <button className='moveButton' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board currentMove={currentMove} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="status">{'You are at move #' + currentMove}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      squares[a] = "w" + squares[a].at(-1);
      squares[b] = "w" + squares[b].at(-1);
      squares[c] = "w" + squares[c].at(-1);
      return squares[a];
    }
  }
  return null;
}
