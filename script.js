const gameBoard = function () {
  let board = [
    ["", "", ""], 
    ["", "", ""],
    ["", "", ""]];

  const locationMap = [
    [0,0], [0,1], [0,2],
    [1,0], [1,1], [1,2],
    [2,0], [2,1], [2,2]
  ]

  let turnsPlayed = 0;

  const addPiece = function (piece, location) {
    const locationX = locationMap[location][0];
    const locationY = locationMap[location][1];

    if (board[locationX][locationY] === "") {
      board[locationX][locationY] = piece;
      turnsPlayed++;
      return board;
    }

    return board;
  }

  const getBoard = function (){
    return board
  }

  const getTurnsPlayed = function () {
    return turnsPlayed;
  }

  const checkGameOver = function () {
    // check rows and columns
    console.log(board)
    for (let i = 0; i < 3; i++) {
      if (( board[i][0] !==  "" ) && ( board[i][0] === board[i][1] ) && ( board[i][1] === board[i][2] ) ) return board[i][0];
      if (( board[0][i] !==  "" ) && ( board[0][i] === board[1][i] ) && ( board[1][i] === board[2][i] ) ) return board[0][i];
    }
    
    // check diagonals
    if (( board[0][0] !==  "" ) && ( board[0][0] === board[1][1] ) && ( board[1][1] === board[2][2] ) ) return board[0][0];
    if (( board[2][0] !==  "" ) && ( board[2][0] === board[1][1] ) && ( board[1][1] === board[0][2] )) return board[2][0];

    // check all pieces played
    console.log("Turns played:" + turnsPlayed);
    
    if (turnsPlayed === 9) return "tie";

    return "";
  }

  return {addPiece, checkGameOver, getTurnsPlayed, getBoard}
};

function createPlayer (playerName) {
  const name = playerName;
  let score = 0;
  let piece = "";
  
  const addPoint = function () {
    score++;
  };

  const getScore = function () {
    return score;
  };

  const setPiece = function (chosenPiece){
    piece = chosenPiece;
  };

  const getPiece = function (){
    return piece;
  };

  return {name, addPoint, getScore, setPiece, getPiece}
}

function createRound(roundNumber, playerOne, playerTwo) {
  const number = roundNumber;
  let startingPlayer = number % 2 ? playerOne : playerTwo;
  let currentPlayer = startingPlayer;
  let winner = "";
  console.log(`Round ${roundNumber}: Current Score ${playerOne.name} (${playerOne.getPiece()}) = ${playerOne.getScore()} vs ${playerTwo.name} (${playerTwo.getPiece()}) = ${playerTwo.getScore()} Starting: ${startingPlayer.name} `)

  const roundBoard = gameBoard();
  let currentBoard = [];

  const piecePlayed = function (location) {
    currentBoard = this.roundBoard.addPiece(currentPlayer.getPiece(), location);
    
    if (this.roundBoard.checkGameOver()) {
      winner = this.roundBoard.checkGameOver();
      if (winner != "tie") currentPlayer.addPoint();
      console.log("Round winner: " + winner);
    }

    currentPlayer = currentPlayer.name == playerOne.name ? playerTwo : playerOne;
  };

  const getCurrentPlayer = function () {
    return currentPlayer;
  };

  const getWinner = function () {
    return winner;
  }

  const getRoundNumber = function () {
    return number;
  }
  
  return {roundBoard, piecePlayed, getCurrentPlayer, getWinner, getRoundNumber}
}

function playerSetup (playerOneName, playerTwoName) {
  let playerOne = playerOneName.trim() ? createPlayer(playerOneName) : createPlayer("P1");
  let playerTwo = playerTwoName.trim() ? createPlayer(playerTwoName) : createPlayer("P2");

  const playerOnePiece = "X";
  const playerTwoPiece = "O";

  playerOne.setPiece(playerOnePiece);
  playerTwo.setPiece(playerTwoPiece);

  console.log(`In the red corner! ${playerOne.name} fighting with ${playerOne.getPiece()}`);
  console.log(`In the red corner! ${playerTwo.name} fighting with ${playerTwo.getPiece()}`);

  updateScoreboard(playerOne, playerTwo, 1);

  return {playerOne, playerTwo}
}

function gameWinner (playerOne, playerTwo) {
  if (playerOne.getScore() === playerTwo.getScore()){
    return "Tie";
  }
  else if (playerOne.getScore() > playerTwo.getScore()) {
    return playerOne.name;
  }
  else {
    return playerTwo.name;
  }
}

function createNewGame (playerOneName, playerTwoName) {
  let roundNumber = 0;
  let numberOfRounds = 3;
  const {playerOne, playerTwo} = playerSetup(playerOneName, playerTwoName);
  let rounds = [];

  for (let i = 1; i <= numberOfRounds; i++){
    rounds.push(createRound(i, playerOne, playerTwo));
  }

  let currentRound = rounds[roundNumber];
  updateInstructions(`${currentRound.getCurrentPlayer().name}'s (${currentRound.getCurrentPlayer().getPiece()}) turn.`);

  addEventListener("click", (event) => {
    if (event.target.id.startsWith("box") && (roundNumber < numberOfRounds)){
      let boxedPressed = Number(event.target.id.split("-")[1]);
      currentRound.piecePlayed(boxedPressed);
      updateBoard(currentRound.roundBoard.getBoard());
      updateInstructions(`${currentRound.getCurrentPlayer().name}'s (${currentRound.getCurrentPlayer().getPiece()}) turn.`);

      if (currentRound.getWinner() !== ""){
        if (roundNumber + 1 === numberOfRounds) {
          const winner = gameWinner(playerOne, playerTwo);
          roundNumber ++;
          updateScoreboard(playerOne, playerTwo, roundNumber);
          updateInstructions("Champion is " + winner);
        }
        else {
          roundNumber++;
          currentRound = rounds[roundNumber];
          updateInstructions(`Round ${roundNumber} done! Next round = ${currentRound.getRoundNumber()}`);
          updateScoreboard(playerOne, playerTwo, roundNumber+1);
        }
      }

    }
  });

  return {playerOne, playerTwo, roundNumber, currentRound};
}

const dialogElement = document.querySelector("dialog");
const playerOneInput = document.querySelector("#player-one");
const playerTwoInput = document.querySelector("#player-two");

addEventListener('click', (event) => {
  
  if (event.target.id == "new-game"){
    dialogElement.showModal();
  }
  else if (event.target.id == "close"){
    event.preventDefault()
    dialogElement.close();
  }
  else if (event.target.id == "start-game"){
    createNewGame(playerOneInput.value, playerTwoInput.value);
    dialogElement.close();
  }
});

function updateBoard(currentBoard) {
  currentBoard = currentBoard.flat();

  let htmlBoxes = document.querySelectorAll("#gameboard div");
    
  for (let i = 0; i < currentBoard.length; i++) {
    htmlBoxes[i].innerHTML = currentBoard[i];
  }
}

function updateScoreboard(playerOne, playerTwo, roundNumber) {
  let scoreBoard = document.querySelector("#scoreboard > div");
  let roundElement = document.querySelector("#scoreboard > h2");

  let playerOneName = playerOne.name;
  let playerTwoName = playerTwo.name;
  let playerOneScore = playerOne.getScore();
  let playerTwoScore = playerTwo.getScore();

  scoreBoard.innerHTML = `${playerOneName} = ${playerOneScore} vs ${playerTwoName} = ${playerTwoScore}`;
  roundElement.innerHTML = `Round ${roundNumber}`;
}

function updateInstructions(message) {
  let instructions = document.querySelector("#instructions");

  instructions.innerHTML = message;
}