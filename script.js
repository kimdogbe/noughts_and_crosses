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
  console.log(`Round ${roundNumber}: Current Score ${playerOne.name} (${playerOne.getPiece()}) = ${playerOne.getScore()} vs ${playerTwo.name} (${playerTwo.getPiece()}) = ${playerTwo.getScore()} `)
  const number = roundNumber;
  let startingPlayer = this.number % 2 ? playerOne : playerTwo;
  let currentPlayer = startingPlayer;
  let winner = "";

  const roundBoard = gameBoard();
  let currentBoard = [];

  const piecePlayed = function(location) {
    currentBoard = this.roundBoard.addPiece(currentPlayer.getPiece(), location);
    console.log(`${currentBoard[0]} \n ${currentBoard[1]} \n ${currentBoard[2]}`);

    if (this.roundBoard.checkGameOver()) {
      this.winner = this.roundBoard.checkGameOver();
      if (this.winner != "tie") currentPlayer.addPoint();
      console.log("Round winner: " + this.winner);
    }
    currentPlayer = currentPlayer.name == playerOne.name ? playerTwo : playerOne;
  };

  return {number, winner, roundBoard, piecePlayed}
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
  let roundNumber = 0;
  let numberOfRounds = 3;
  const {playerOne, playerTwo} = playerSetup();
  let rounds = [];

  for (let i = 1; i <= numberOfRounds; i++){
    rounds.push(createRound(i, playerOne, playerTwo));
  }

  let currentRound = rounds[roundNumber];

  addEventListener("click", (event) => {
    if (event.target.id.startsWith("box")){
      let boxedPressed = Number(event.target.id.split("-")[1]);
      currentRound.piecePlayed(boxedPressed);
      updateBoard(currentRound.roundBoard.getBoard());

      if (currentRound.winner !== ""){
        if (roundNumber + 1 === numberOfRounds) {
          const winner = gameWinner(playerOne, playerTwo);
          console.log("Winner is " + winner);
        }
        else {
          roundNumber++;
          currentRound = rounds[roundNumber];
          console.log(`Round ${roundNumber} done! Next round = ${currentRound.number}`);
          console.log(`Current Score ${playerOne.name}: ${playerOne.getScore()} vs ${playerTwo.name}: ${playerTwo.getScore()} `);
          updateScoreboard(playerOne, playerTwo);
        }
      }

    }
  });

  return {playerOne, playerTwo, roundNumber, currentRound};
}

addEventListener('click', (event) => {
  if (event.target.id == "newGame"){
    createNewGame();
  }
})

function updateBoard(currentBoard) {
  currentBoard = currentBoard.flat();

  let htmlBoxes = document.querySelectorAll("#gameboard div");
    
  for (let i = 0; i < currentBoard.length; i++) {
    htmlBoxes[i].innerHTML = currentBoard[i];
  }
}

function updateScoreboard(playerOne, playerTwo) {
  let scoreBoard = document.querySelector("#scoreboard");

  let playerOneName = playerOne.name;
  let playerTwoName = playerTwo.name;
  let playerOneScore = playerOne.getScore();
  let playerTwoScore = playerTwo.getScore();

  scoreBoard.innerHTML = `${playerOneName} = ${playerOneScore} vs ${playerTwoName} = ${playerTwoScore}`;
}