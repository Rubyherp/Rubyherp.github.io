let currentPlayer;
let newBoard;
let player1;
let player2;
let boardSize;
let inGameState = true;

const container = document.querySelector(".container");
const gameBoard = document.querySelector(".gameboard");
const resetBtn = document.querySelector(".reset-btn");
const resetScoreBtn = document.querySelector(".resetScore-btn");
const p1_name = document.querySelector(".p1-name");
const p2_name = document.querySelector(".p2-name");
const p1_scoreBoard = document.querySelector(".player1-score");
const p2_scoreBoard = document.querySelector(".player2-score");

gameBoard.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("box") &&
    inGameState &&
    !e.target.classList.contains("pressed")
  ) {
    updateGame(e);
  }
});

resetBtn.addEventListener("click", () => {
  resetBoard();
});

resetScoreBtn.addEventListener("click", () => {
  resetBoard();
  resetScore();
});

function createGameBoard(size) {
  const arr = [];
  for (let row = 0; row < size; row++) {
    arr[row] = [];
    for (let col = 0; col < size; col++) {
      arr[row][col] = 0;
      const box = document.createElement("div");
      box.classList.add("box");
      // tag an id to each box
      const id = `${row}` + " " + `${col}`;
      box.setAttribute("id", id);
      gameBoard.appendChild(box);
    }
  }
  const getArr = () => {
    return arr;
  };
  return { arr, getArr };
}

function updateScoreBoard() {
  p1_scoreBoard.textContent = player1.getScore();
  p2_scoreBoard.textContent = player2.getScore();
}

function createPlayer(name, id) {
  const playerName = `Player: ${name}`;
  let score = 0;
  const addScore = () => {
    score++;
  };
  const getScore = () => {
    return score;
  };
  const getId = () => {
    return id;
  };
  const resetScore = () => {
    score = 0;
  };
  return { playerName, getId, getScore, addScore, resetScore };
}

function updateGame(e) {
  const boxId = e.target.id.split(" ");
  const row = boxId[0];
  const col = boxId[1];
  if (currentPlayer == player1) {
    newBoard.arr[row][col] = 1;
    e.target.classList.add("p1-x");
  } else {
    newBoard.arr[row][col] = -1;
    e.target.classList.add("p2-o");
  }
  e.target.classList.add("pressed");
  currentPlayer = currentPlayer == player1 ? player2 : player1;
  toggleHighlight();
  checkWinningCondition();
}

function toggleHighlight() {
  if (currentPlayer == player1) {
    p1_name.classList.add("highlight");
    p2_name.classList.remove("highlight");
  } else {
    p1_name.classList.remove("highlight");
    p2_name.classList.add("highlight");
  }
}
function checkWinningCondition() {
  const array = [];
  let len = 0;
  let filledSquares = 0;

  // rows
  for (let row = 0; row < boardSize; row++) {
    array[len] = 0;
    for (let col = 0; col < boardSize; col++) {
      const value = newBoard.arr[row][col];
      array[len] += value;
      if (value !== 0) filledSquares++;
    }
    len++;
  }
  // columns
  for (let col = 0; col < boardSize; col++) {
    array[len] = 0;
    for (let row = 0; row < boardSize; row++) {
      array[len] += newBoard.arr[row][col];
    }
    len++;
  }
  // diagonal 1 (top-left to bottom-right)
  array[len] = 0;
  for (let row = 0; row < boardSize; row++) {
    array[len] += newBoard.arr[row][row];
  }
  len++;
  // diagonal 2 (top-right to bottom-left)
  array[len] = 0;
  let col = 0;
  for (let row = 2; row >= 0; row--) {
    array[len] += newBoard.arr[row][col];
    col++;
  }
  console.log("Sums:", array);
  for (let i = 0; i < array.length; i++) {
    if (array[i] === 3) {
      handleWinningSequence(player1);
      return;
    } else if (array[i] === -3) {
      handleWinningSequence(player2);
      return;
    }
  }
  if (filledSquares == boardSize * boardSize) {
    handleWinningSequence(null);
  }
}

function handleWinningSequence(player) {
  if (player == null) {
    alert("It's a draw!");
    inGameState = false;
    return;
  }
  player.addScore();
  updateScoreBoard();
  inGameState = false;
  const playerX = player.playerName;
  alert(`${playerX} win!`);
}

function resetBoard() {
  gameBoard.innerHTML = "";
  newBoard = createGameBoard(3);
  inGameState = true;
  currentPlayer = player1;
  toggleHighlight();
}

function resetScore() {
  player1.resetScore();
  player2.resetScore();
  updateScoreBoard();
  toggleHighlight();
}

function playGame() {
  boardSize = 3;
  newBoard = createGameBoard(boardSize);
  player1 = createPlayer("XN", 1);
  p1_name.textContent = player1.playerName + ":";
  player2 = createPlayer("Loser_XZ did not", 2);
  p2_name.textContent = player2.playerName + ":";
  p2_name.classList.toggle("highlight");
  currentPlayer = player1;
  updateScoreBoard();
}

playGame();
