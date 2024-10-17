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
  }

  const getTurnsPlayed = function () {
    return turnsPlayed;
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

    // check all pieces played
    console.log("Turns played:" + turnsPlayed);
    
    if (turnsPlayed === 9) return true;

    return false;
  }

  return {addPiece, checkGameOver, getTurnsPlayed}
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
  console.log(`Round ${roundNumber}: Current Score ${playerOne.name} (${playerOne.getPiece()}) = ${playerOne.getScore()} vs ${playerTwo.name} (${playerTwo.getPiece()}) = ${playerTwo.getScore()} `)
  const number = roundNumber;
  let currentPlayer = number % 2 ? playerOne : playerTwo;

  const roundBoard = gameBoard();
  let currentBoard = [];
  
  while (!roundBoard.checkGameOver()){
    currentPlayer = currentPlayer.name == playerOne.name ? playerTwo : playerOne;

    let location = prompt(`Select next position ${currentPlayer.name}`);

    currentBoard = roundBoard.addPiece(currentPlayer.getPiece(), location);
    console.log(`${currentBoard[0]} \n ${currentBoard[1]} \n ${currentBoard[2]}`);
  }
  
  let winner = currentPlayer;
  winner.addPoint();

  return {number, winner, roundBoard}
}

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


function createNewGame () {
  let roundNumber = 1;
  const {playerOne, playerTwo} = playerSetup();

  while (roundNumber <= 3){
    createRound(roundNumber, playerOne, playerTwo);
    roundNumber++;
  }
  
  const winner = gameWinner(playerOne, playerTwo);
  console.log("Winner is " + winner);

  return {playerOne, playerTwo, roundNumber, winner};
}