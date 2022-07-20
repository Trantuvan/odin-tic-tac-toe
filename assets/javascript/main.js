// Utility functions (sending events through modules)
const events = (() => {
  const events = {};

  function on(eventName, callback) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(callback);
  }

  function off(eventName, callback) {
    if (events[eventName]) {
      for (let i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] === callback) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  function emit(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach((callback) => callback(data));
    }
  }

  return { on, off, emit };
})();

const player = function (marker) {
  const moves = [];
  const playerMaker = marker;

  function updateMove() {}

  function render() {}

  return { moves, playerMaker, updateMove, render };
};


const gameBoard = (function () {
  const cells = [];
  let player1;
  let player2;

  //* Cache Dom
  const wrapper = document.querySelector(".wrapper");
  const markers = wrapper.querySelectorAll(".marker");

  //* Initialize
  Array.from(markers).forEach((marker) => {
    marker.addEventListener("click", (evt) => {
      const playerMarker = setCurrentMarker(evt);
      events.emit("markerChanged", playerMarker);
    });
  });

  //* Bind Events
  events.on("markerChanged", createPlayers);

  function setCurrentMarker(evt) {
    return evt.target.getAttribute("data-marker");
  }

  function createPlayers(marker) {
    const player2Marker = marker === "X" ? "O" : "X";
    player1 = player(marker);
    player2 = player(player2Marker);

    events.off("markerChanged", createPlayers);
  }
})();

