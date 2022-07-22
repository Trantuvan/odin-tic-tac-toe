
// player factory: Properties => name, marker
// to define inside Player factory: getname, getMarker, setNamen, setMarker (return these 4)
const player = (marker) =>{
  const getMarker = () => marker;
  const setMarker = (value) => marker = value;

  return {getMarker, setMarker};
}

// another factory => store data inside of it
// create the board. 9 fields of the board, what value?
// create a function to find an element at a specific index of the board
// create function to set a value to a specific index of the board
// create a function that will get you a state of the board at any given time (you want to return a copy of the board because of data privacy.
// This way, your original board stays inside of your factory and in that way it's protected. You only ever work with the copy)
// so inside of this one you return : getValueOfTheBoardAtIndex, setValueOfTheBoardAtIndex, getBoard (you probably want to name this better :D)
const board = () =>{
  const board = [
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ];

  const getBoardValueIndex = (index) => board[index];
  const setBoardValueIndex = (index, value) => board[index] = value;
  const getBoard = () => [...board];

  return { getBoard, getBoardValueIndex, setBoardValueIndex };
}

// and finally, an IIFE. This is where you define your game logic. Here you define players, define a function that will define which player is
// the current player, the clear function, checkWinner function, and you attach event listeners to divs. Once you defined all of the above, this part should
// not be too complicated. In this event listener, what you want is to actually tie your state of the board with the DOM. Dom should be used only to display
// our data, it should not be our primary source of data. There you go. I go back you can ask questions in discord

(() => {
  const gameBoard = board();
  const player1 = player("X");
  const player2 = player("O");
  let player1Turns = true;

  //* cache dom
  const wrapper = document.querySelector(".wrapper");
  const markers = wrapper.querySelectorAll(".marker > img");
  const currentMarker = wrapper.querySelector("#current-marker");
  const cells = wrapper.querySelectorAll("#game-board > .cell");

  function changeMarker(evt) {
    const player1Marker = evt.target.getAttribute("data-marker");
    const player2Marker = player1Marker === "X" ? "O" : "X";
    player1.setMarker(player1Marker);
    player2.setMarker(player2Marker);
  }

  function getCurrentPlayer() {
    if (player1Turns) {
      player1Turns = false;
      return player1;
    }
    player1Turns = true;
    return player2;
  }

  function renderCurrentMarker(currentPlayer) {
    let playerMarker = currentPlayer.getMarker();
    currentMarker.textContent = playerMarker;
  }

  function renderCellMarker(evt, currentPlayer) {
    let playerMarker = currentPlayer.getMarker();

    if(playerMarker === "X"){
      evt.target.innerHTML = `<img src="./assets/img/x-marker.png" alt="x-marker">`;
    }

    if(playerMarker === "O"){
      evt.target.innerHTML = `<img src="./assets/img/o-marker.png" alt="o-marker">`;
    }
  }

  function updateBoard(evt,currentPlayer) {
    const cellIndex = evt.target.getAttribute("data-index");
    const playermarker = currentPlayer.getMarker();
    gameBoard.setBoardValueIndex(cellIndex, playermarker);
  }

  function checkWinner(){

  }

  //* change marker
  Array.from(markers).forEach(marker => {
    marker.addEventListener("click", (evt)=>{
      changeMarker(evt);
    });
  });

  //* playGame
  Array.from(cells).forEach(cell => {
    cell.addEventListener("click", (evt) => {
      // prevent player click already taken spot
      if(cell.hasChildNodes() === true) {
        return;
      }

      let currentPlayer = getCurrentPlayer();

      updateBoard(evt,currentPlayer);
      renderCurrentMarker(currentPlayer);
      renderCellMarker(evt,currentPlayer);
    })
  })
})()
