const player = (marker) =>{
  const getMarker = () => marker;
  const setMarker = (value) => marker = value;

  return {getMarker, setMarker};
}

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

(() => {
  const gameBoard = board();
  const player1 = player("X");
  const player2 = player("O");
  let cpuPlayer;
  let player1Turns = true;

  //* cache dom
  const wrapper = document.querySelector(".wrapper");
  const markers = wrapper.querySelectorAll(".marker > img");
  const replayBtn = wrapper.querySelector(".action > .replay-btn");
  const currentMarker = wrapper.querySelector("#current-marker");
  const cells = wrapper.querySelectorAll("#game-board > .cell");
  const cpuBtn = wrapper.querySelector(".right-opponent");
  const modal = document.querySelector(".modal");
  const modalInfo = modal.querySelector(".modal-info");
  const modalReplayBtn = modal.querySelector(".modal-action > .btn");

  function changeMarker(evt) {
    const player1Marker = evt.target.getAttribute("data-marker");
    const player2Marker = player1Marker === "X" ? "O" : "X";
    player1.setMarker(player1Marker);
    player2.setMarker(player2Marker);

    if (cpuPlayer !== undefined) {
      cpuPlayer.setMarker(player2Marker);
    }
  }

  function  getCurrentPlayer() {
    if (player1Turns) {
      player1Turns = false;
      return player1;
    }

    player1Turns = true;

    if(cpuPlayer !== undefined) {
      return cpuPlayer;
    }

    return player2;
  }

  function renderMarkerStatus(currentPlayer) {
    let playerMarker = currentPlayer.getMarker();
    currentMarker.textContent = playerMarker === "X" ? "O" : "X";
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

  function renderCellMarkerByCpu(currentPlayer, status, cellIndex) {
    let playerMarker = currentPlayer.getMarker();

    if (playerMarker === "X") {
        Array.from(cells)[
          `${cellIndex}`
        ].innerHTML = `<img src="./assets/img/x-marker.png" alt="x-marker">`;
    }

    if (playerMarker === "O") {
      Array.from(cells)[`${cellIndex}`].innerHTML =
      `<img src="./assets/img/o-marker.png" alt="o-marker">`;
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

  function updateBoardByCpu(currentPlayer) {
    const cellIndex = gameBoard.getBoard().findIndex(cellValue => cellValue === undefined);
    const playermarker = currentPlayer.getMarker();
    gameBoard.setBoardValueIndex(cellIndex, playermarker);
    return cellIndex;
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
        return { currentPlayer, winStatus: isWin, winCase: winCase, isTie: false };
      }
    }

    if (isWin === false && isPopulated === true) {
      console.log("TIE");
      return { currentPlayer, winStatus: isWin, winCase: null, isTie: true };
    }
    return { currentPlayer, winStatus: isWin, winCase: null, isTie: false};
  }

  function renderModal(status) {
    if (status.winStatus === true) {
      const currentMarker = status.currentPlayer.getMarker();
      modal.classList.remove("deactivated");
      modalInfo.textContent = `${currentMarker} TAKES THE ROUND`;
    }
    if (status.isTie === true) {
      modal.classList.remove("deactivated");
      modalInfo.textContent = "ALL TIES";
    }
  }

  function resetGame() {
    const cellArray = Array.from(cells);
    cellArray.forEach(cell => {
      cell.innerHTML = "";
      cell.style.backgroundColor = "#e2e8f0";
    });
    gameBoard.setBoardDefault();

    if(modal.classList.contains("deactivated") === false) {
      modal.classList.add("deactivated");
    }

    player1.setMarker("X");
    player2.setMarker("O");
    player1Turns = true;
    currentMarker.textContent = "X";
  }

  //* cpu Player
  cpuBtn.addEventListener("click", () => cpuPlayer = player("O"));

  //* change marker
  Array.from(markers).forEach(marker => {
    marker.addEventListener("click", (evt)=>{
      changeMarker(evt);
    });
  });

  //* replay
  replayBtn.addEventListener("click", resetGame);
  modalReplayBtn.addEventListener("click", resetGame);

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
      renderModal(status);

      if(cpuPlayer !== undefined) {
        currentPlayer = getCurrentPlayer();
        const cpuIndex = updateBoardByCpu(currentPlayer);
        const status = checkWinner(currentPlayer);
        setTimeout(()=>{
          renderMarkerStatus.call(this,currentPlayer)
          renderCellMarkerByCpu.call(this, currentPlayer, status, cpuIndex)
        },
          1000);
        renderModal(status);
      }
    })
  });
})()
