var FRESH_GAME = true;
var COVERED = false;
var PLAYERS = [];
var CURRENT_PLAYER;
var MOVES = [];
var BOARD = ['', '', '', '', '', '', '', '', ''];
var  WIN_COMBINATIONS = [
  [0,1,2],  //Top row
  [3,4,5],  //Middle row
  [6,7,8],  //Bottom row
  [0,3,6],  //First column
  [1,4,7],  //Seccond column
  [2,5,8],  //Third column
  [0,4,8],  //Diaginal top left to bottom right
  [2,4,6]   //Diaginal top right to bottom left
  ];

//player
class player{
  constructor(cpu, symbol, name){
    this.score = 0;
    this.cpu = cpu;
    this.symbol = symbol;
    this.roll = Math.random();
    this.moves = [];
    this.name = name;
  }  
}
//READY EVENT
$('doccument').ready(function(){
  startGame();
});
//Add handler to each square after they are created
function addSquareClickHandler(){  
  $('.square').click(function(e){
    e.preventDefault()
    move(this.id);
  });
}
//Add handler for button selection
function addPlayerSelectHandler(){
  $('.player-select').click(function(e){
    e.preventDefault();
    if (e.target.id == '1-player'){
      player2.cpu = true;
    } 
    gamePrompt('SYMBOL_SELECT');
  });
}
//Add handler for button selection
function addSymbolSelectHandler(){
  $('.symbol').click(function(e){
    e.preventDefault();
    PLAYERS[0].symbol = e.target.id;
    uncover();
  });
}
//Add handler for button selection
function addGameSelectHandler(){
  $('.game-select').click(function(e){
    e.preventDefault();
    if (e.target.id == 'playAgain'){      
      console.log('playing again...');
      BOARD = ['', '', '', '', '', '', '', '', ''];
      player1.moves = [];
      player2.moves = [];
      uncover();      
    }else if(e.target.id == 'resetGame'){
      console.log('Resetting game');
      reset();
    } 
  });
}
//Handle the move sequence after a tile is selected
function move(tile){
  console.log(tile + ' was clicked');
  if(!squareTaken(tile)){
    takeSquare(tile, CURRENT_PLAYER.symbol);
  }
  if (isGameOver()){
    console.log('game over');
  }else{
    togglePlayer();
  }
}
//Check to see if the game has ended in a draw or player win
function isGameOver(){
  let winner = playerHasWon();
  if(gameIsDraw()){
    console.log('Game is a draw.');
    return true;
  }else if(winner != null){
    let prompt = winner.name == 'Player 1' ? 'PLAYER1WINS' : 'PLAYER2WINS';
    console.log(winner.name + ' has won the game!');
    winner.score += 1;
    addScore(winner);
    gamePrompt(prompt);    
    return true;
  }
    return false;
}
//Check to see if a player has won
function playerHasWon(){
  let winner = null;
  PLAYERS.forEach(function(player){
    WIN_COMBINATIONS.forEach(function(combo){
      if (combo.every(square => player.moves.indexOf(square.toString()) > -1)){
        winner = player;
      }
    });
  });
  return winner;
}
//Check for game draw
function gameIsDraw(){
  return !playerHasWon() && BOARD.every(function(square){
    return square == 'X' || square == 'O';
  });
}
//Change players after each move
function togglePlayer(){
  CURRENT_PLAYER = CURRENT_PLAYER == player1 ? player2 : player1;
  if (CURRENT_PLAYER.cpu){cpuMove();}
}
//Put the players symbol in the tile they selected
function takeSquare(square, symbol){
  BOARD[square] = symbol;
  $('#' + square).html(symbol);
  CURRENT_PLAYER.moves.push(square);
}
//Check the the tile has already been taken
function squareTaken(square){
  return (BOARD[square] == 'X' || BOARD[square] == 'O');
}
//Reveal the game board
function uncover(){
  console.log('uncovering');
  $('#master-board').html(`
  <div class='row board-row'>
    <div class='col s4 square' id='0'>
          </div>
          <div class='col s4 middle square' id='1'>
         </div>
          <div class='col s4 square' id='2'>
          </div>
        </div>
        <div class='row board-row'>
          <div class='col s4 square center' id='3'>            
          </div>
          <div class='col s4 center middle square' id='4'>            
          </div>
          <div class='col s4 square center' id='5'>
          </div>
        </div>
        <div class='row board-row'>
          <div class='col s4 square' id='6'>
          </div>
          <div class='col s4 middle square' id='7'>
          </div>
          <div class='col s4 square' id='8'>
          </div>
        </div>
  `);
  COVERED = false;
  addSquareClickHandler();
}
//Create the players and start the game
function startGame(){
  player1 = new player(false, 'X', 'Player 1');
  player2 = new player(false, 'O', 'Player 2');
  PLAYERS.push(player1);
  PLAYERS.push(player2);  
  CURRENT_PLAYER = player1;  
  gamePrompt('NEW_GAME');
}
//Reset the scores and start the game over
function reset(){  
  PLAYERS = [];
  BOARD = ['', '', '', '', '', '', '', '', ''];
  $('#player1Score').html('0');
  $('#player2Score').html('0');
  startGame();
}
//Show a prompt to the user
function gamePrompt(prompt){
  switch(prompt){
    case 'NEW_GAME':
      $('#master-board').html(newGamePrompt);
      COVERED = true;
      addPlayerSelectHandler();
      break;
    case 'SYMBOL_SELECT':
      $('#master-board').html(symbolPrompt);
      addSymbolSelectHandler();
      COVERED = true;
      break;
    case 'GAME_OVER':
      $('#master-board').html(gameOverPrompt);
      addGameSelectHandler();
      break;
    case 'PLAYER1WINS':
      $('#master-board').html(player1WinsPrompt);      
      addGameSelectHandler();
      break;
    case 'PLAYER2WINS':
      $('#master-board').html(player2WinsPrompt);      
      addGameSelectHandler();
      break;
    default:
      console.error('gamePrompt was called without a valid arg.')
      break;
  }
}
//This is the prompt for the user to select their symbol
const symbolPrompt = function(){
  return `
    <div class='col s8 square prompt offset-s2'>
      <div class='row center-align'>Select Symbol</div>
      <div class='row center-align'>Which would you like to be?</div>
      <div class='row'>
        <div class='col s3 offset-s2 symbol'>
          <a id='X' href=''>X</a>
        </div>
        <div class='col s3 offset-s2 symbol'>
          <a id='O' href=''>O</a>
        </div>
      </div>
  `;
}
//This is the prompt for the user to start a new game
const newGamePrompt = function(){
  return `
    <div class='col s8 square prompt offset-s2'>
      <div class='row center-align'>New Game</div>
      <div class='row center-align'>How Many Players?</div>
      <div class='row'>
        <div class='col s3 offset-s2 player-select'>
          <a id='1-player' href=''>One Player</a>
        </div>
        <div class='col s3 offset-s2 player-select'>
          <a id='2-players' href=''>Two Players</a>
        </div>
      </div>
  `;
}
//This is the prompt when the game ends in a draw
const gameOverPrompt = function(){
  return `
    <div class='col s8 square prompt offset-s2'>
      <div class='row center-align'>Game Over</div>
      <div class='row center-align'>Draw!</div>
      <div class='row center-align'>Play again or Reset?</div>
      <div class='row'>
        <div class='col s3 offset-s2 game-select'>
          <a id='playAgain' href=''>Play Again</a>
        </div>
        <div class='col s3 offset-s2 game-select'>
          <a id='resetGame' href=''>Reset Game</a>
        </div>
      </div>
  `;
}
//This is the prompt when the game ends in a player 1 win
const player1WinsPrompt = function(){
  return `
    <div class='col s8 square prompt offset-s2'>
      <div class='row center-align'>Game Over</div>
      <div class='row center-align'>Player 1 Wins!</div>
      <div class='row center-align'>Play again or Reset?</div>
      <div class='row'>
        <div class='col s3 offset-s2 game-select'>
          <a id='playAgain' href=''>Play Again</a>
        </div>
        <div class='col s3 offset-s2 game-select'>
          <a id='resetGame' href=''>Reset Game</a>
        </div>
      </div>
  `;
}
//This is the prompt when the game ends in a player 2 win
const player2WinsPrompt = function(){
  return `
    <div class='col s8 square prompt offset-s2'>
      <div class='row center-align'>Game Over</div>
      <div class='row center-align'>Player 2 Wins!</div>
      <div class='row center-align'>Play again or Reset?</div>
      <div class='row'>
        <div class='col s3 offset-s2 game-select'>
          <a id='playAgain' href=''>Play Again</a>
        </div>
        <div class='col s3 offset-s2 game-select'>
          <a id='resetGame' href=''>Reset Game</a>
        </div>
      </div>
  `;
}
//Generate a random tile for the computer player to select out of remaining free tiles
function cpuTileSelect(){
  var tilePicked = null;
  while(tilePicked == null || squareTaken(tilePicked)){
    tilePicked = Math.floor(Math.random() * 9);
  } 
  console.log('cpu taking square ' + tilePicked);
  return tilePicked.toString(); 
}
//If the player is the computer have it make a move
function cpuMove(){
  move(cpuTileSelect());  
}
//Increase the player's score
function addScore(player){
  let scoreToChange = player.name == 'Player 1' ? $('#player1Score') : $('#player2Score');
  scoreToChange.html(player.score.toString());
  console.log('changing ' + player.name + ' score to ' + player.score);
}
