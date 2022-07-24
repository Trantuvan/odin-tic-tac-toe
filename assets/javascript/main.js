
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
  let board = [
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ];

  const setBoardValueIndex = (index, value) => board[index] = value;
  const getBoard = () => [...board];
  const setBoardDefault = () => board = [
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined
  ];

  return { getBoard, setBoardValueIndex, setBoardDefault };
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
  const replayBtn = wrapper.querySelector(".action > .replay-btn");
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

  function renderMarkerStatus(currentPlayer) {
    let playerMarker = currentPlayer.getMarker();
    currentMarker.textContent = playerMarker;
  }

  function renderCellMarker(evt, currentPlayer, status) {
    let playerMarker = currentPlayer.getMarker();

    if(playerMarker === "X"){
      evt.target.innerHTML = `<img src="./assets/img/x-marker.png" alt="x-marker">`;
    }

    if(playerMarker === "O"){
      evt.target.innerHTML = `<img src="./assets/img/o-marker.png" alt="o-marker">`;
    }

    if (status.winStatus === true) {
      const winCells = status.winCase;
      const cellsArray = Array.from(cells);

      switch (playerMarker) {
        case "X":
          winCells.forEach(
            (cellIndex) =>
              (cellsArray[cellIndex].style.backgroundColor = "#22c55e")
          );
          break;

        case "O":
          winCells.forEach(
            (cellIndex) =>
              (cellsArray[cellIndex].style.backgroundColor = "#f43f5e")
          );
          break;
      }
    }
  }

  function updateBoard(evt,currentPlayer) {
    const cellIndex = evt.target.getAttribute("data-index");
    const playermarker = currentPlayer.getMarker();
    gameBoard.setBoardValueIndex(cellIndex, playermarker);
  }

  function checkWinner(currentPlayer) {
    const currentBoard = gameBoard.getBoard();
    const currentMarker = currentPlayer.getMarker();
    const isPopulated = currentBoard.every((cell) => cell !== undefined);
    let isWin = false;

    const winCases = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const winCase of winCases) {
      let winCaseWithMarker = winCase.map(
        cellIndex => currentBoard[cellIndex]
        );

      isWin = winCaseWithMarker.every(marker => marker === currentMarker);

      if(isWin === true) {
        console.log(`player ${currentMarker} wins`);
        return { currentPlayer, winStatus: isWin, winCase: winCase };
      }
    }

    if (isWin === false && isPopulated === true) {
      console.log("tie");
    }
    return { currentPlayer, winStatus: isWin, winCase: null };
  }

  function resetGame() {
    const cellArray = Array.from(cells);
    cellArray.forEach(cell => {
      cell.innerHTML = "";
      cell.style.backgroundColor = "#e2e8f0";
    });
    gameBoard.setBoardDefault();
  }

  //* change marker
  Array.from(markers).forEach(marker => {
    marker.addEventListener("click", (evt)=>{
      changeMarker(evt);
    });
  });

  //* replay
  replayBtn.addEventListener("click", resetGame);

  //* playGame
  Array.from(cells).forEach(cell => {
    cell.addEventListener("click", (evt) => {
      // prevent player click already taken spot
      if(cell.hasChildNodes() === true) {
        return;
      }

      let currentPlayer = getCurrentPlayer();

      updateBoard(evt,currentPlayer);
      const status = checkWinner(currentPlayer);
      renderMarkerStatus(currentPlayer);
      renderCellMarker(evt,currentPlayer, status);
    })
  })
})()
