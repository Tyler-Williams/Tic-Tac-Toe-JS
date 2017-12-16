var COVERED = false;
var PLAYERS = [];
var CURRENT_PLAYER;
var MOVES = [];
var BOARD = ['', '', '', '', '', '', '', '', ''];
var ACITVE = false;
var NUM_HUMANS = 0;
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
function player(cpu, symbol){
  this.score = 0;
  this.cpu = cpu;
  this.symbol = symbol;
  this.roll = Math.random();
}
//READY EVENT
$('doccument').ready(function(){
  startGame();
});

function addSquareClickHandler(){  
  $('.square').click(function(e){
    e.preventDefault()
    move(this.id);
  });
}

function addPlayerSelectHandler(){
  $('.player-select').click(function(e){
    e.preventDefault();
    if (e.target.id == '1-player'){
      PLAYERS[1].cpu = true;
    } 
    gamePrompt('SYMBOL_SELECT');
  });
}

function addSymbolSelectHandler(){
  $('.symbol').click(function(e){
    e.preventDefault();
    PLAYERS[0].symbol = e.target.id;
    uncover();
  });
}

function move(tile){
  console.log(tile + ' was clicked');
  if(!squareTaken(tile)){
    console.log('square is not taken');
    takeSquare(tile, CURRENT_PLAYER.symbol);
    togglePlayer();
  }
  if (isGameOver()){
    console.log('game over');
  }
}

function isGameOver(){
  if(gameIsDraw()){
    console.log('Game is a draw.');
    return true;
  }else if(playerHasWon()){
    console.log('a player has won.');
    return true;
  }
    return false;
}

function playerHasWon(){
  return false
}

function gameIsDraw(){
  return !playerHasWon() && BOARD.every(function(square){
    return square == 'X' || square == 'O';
  });
}

function togglePlayer(){
  CURRENT_PLAYER = CURRENT_PLAYER == PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
}

function takeSquare(square, symbol){
  BOARD[square] = symbol;
  $('#' + square).html(symbol);
}

function squareTaken(square){
  return (BOARD[square] == 'X' || BOARD[square] == 'O');
}

function cover(){
  $('#master-board').html(symbolPrompt);
  COVERED = true;
}

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

function startGame(){
  var player1 = new player(false, 'X');
  var player2 = new player(false, 'O');
  PLAYERS.push(player1);
  PLAYERS.push(player2);  
  CURRENT_PLAYER = PLAYERS[0];  
  gamePrompt('NEW_GAME');
}

function reset(){  
  PLAYERS = [];
}

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
    case 'GAME_OVER':
      break;
    default:
      console.error('gamePrompt was called without a valid arg.')
      break;
  }
}

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

