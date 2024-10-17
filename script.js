const gameBoard = (function () {
  let board = [
    ["", "", ""], 
    ["", "", ""],
    ["", "", ""]];

  const addPiece = function (piece, locationX, locationY) {
    if (board[locationX][locationY] === "") {
      board[locationX][locationY] = piece;
    }
  }

  const checkGameOver = function () {
    // check rows and columns
    console.log(board)
    for (let i = 0; i < 3; i++) {
      if (( board[i][0] !==  "" ) && ( board[i][0] === board[i][1] ) && ( board[i][1] === board[i][2] ) ) return true;
      if (( board[0][i] !==  "" ) && ( board[0][i] === board[1][i] ) && ( board[1][i] === board[2][i] ) ) return true;
    }
    
    // check diagonals
    if (( board[0][0] !==  "" ) && ( board[0][0] === board[1][1] ) && ( board[1][1] === board[2][2] ) ) return true;
    if (( board[2][0] !==  "" ) && ( board[2][0] === board[1][1] ) && ( board[1][1] === board[0][2] )) return true;

    return false;
  }

  return {board, addPiece, checkGameOver}
})();

function createPlayer (playerName) {
  const name = playerName;
  let score = 0;
  let piece = "";

  
  const addPoint = function () {
    this.score++;
  };

  const getScore = function () {
    return this.score;
  };

  const setPiece = function (chosenPiece){
    this.piece = chosenPiece;
  };

  const getPiece = function (){
    return this.piece;
  };

  return {name, addPoint, getScore, setPiece, getPiece}
}

// function createRound(roundNumber, playerOne, playerTwo, ) {
//   const number = roundNumber;
//   const firstMove = number % 2 ? playerTwo : playerOne;

//   const gameBoard

// }

function playerSetup () {
  const playerOneName = prompt("Ready Player one? What is your name");
  const playerTwoName = prompt("Ready Player two? What is your name");

  let playerOne = createPlayer(playerOneName);
  let playerTwo = createPlayer(playerTwoName);

  console.log(`Next up! ${playerOne.name} vs ${playerTwo.name}`);
  
  const playerOnePiece = prompt(`${playerOne.name}! Select your piece ->`);
  let playerTwoPiece = prompt(`${playerTwo.name}! Select your piece ->`);
  
  while (playerOnePiece == playerTwoPiece) {
    playerTwoPiece = prompt(`Sorry ${playerTwo.name} that piece has already been selected. Please select another`);
  }

  playerOne.setPiece(playerOnePiece);
  playerTwo.setPiece(playerTwoPiece);

  console.log(`In the red corner! ${playerOne.name} fighting with ${playerOne.getPiece()}`);
  console.log(`In the red corner! ${playerTwo.name} fighting with ${playerTwo.getPiece()}`);

  return {playerOne, playerTwo}
}

function createNewGame () {
  let roundNumber = 1;
  const {playerOne, playerTwo} = playerSetup();

  const winningPlayer = function () {
    if (playerOne.getScore() === playerTwo.getScore()){
      return "Tie";
    }
    else if (playerOne.getScore() > playerTwo.getScore()) {
      playerOne.addPoint();
      return playerOne.name;
    }
    else {
      playerTwo.addPoint();
      return playerTwo.name;
    }
  }

  return {playerOne, playerTwo, roundNumber, winningPlayer, firstMove}
}