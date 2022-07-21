
// player factory: Properties => name, marker
// to define inside Player factory: getname, getMarker, setNamen, setMarker (return these 4)
const player = (name, marker) =>{
  const getName = () => playerName;
  const getMarker = () => playerMarker;
  const setName = (value) => value = name;
  const setMarker = (value) => value = marker;

  return {getName, getMarker, setName, setMarker};
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

  const getBoardValue = (index) => board[index];
  const setBoardValue = (index, value) => board[index] = value;
  const getBoard = () => [...board];

  return { getBoard, getBoardValue, setBoardValue };
}

// and finally, an IIFE. This is where you define your game logic. Here you define players, define a function that will define which player is
// the current player, the clear function, checkWinner function, and you attach event listeners to divs. Once you defined all of the above, this part should
// not be too complicated. In this event listener, what you want is to actually tie your state of the board with the DOM. Dom should be used only to display
// our data, it should not be our primary source of data. There you go. I go back you can ask questions in discord

(() => {
  const gameBoard = board();
  const player1 = player("test1", "X");
  const player2 = player("test2", "O");

  //* cache dom
  const wrapper = document.querySelector(".wrapper");
  const cells = wrapper.querySelectorAll("#game-board cell");
})()
