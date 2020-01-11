/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */





/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

class Game {
  constructor(HEIGHT, WIDTH, p1Player, p2Player) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH
    this.currPlayer = p1Player; // active player: 1 or 2
    this.p1Player = p1Player;
    this.p2Player = p2Player;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.makeBoard();
    this.makeHtmlBoard();
    this.startGame();
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }


  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {

    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of this.board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer === this.p1Player ? this.p1Player.returnColor() : this.p2Player.returnColor();
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    setTimeout(() => {
      alert(msg);
      let restartButton = document.getElementById('start');
      restartButton.classList.remove('hide');
    }, 750)
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell

    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)

    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in this.board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.currPlayer === this.p1Player ? this.endGame("Player 1 wins!") : this.endGame("Player 2 wins!")
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.p1Player ? this.p2Player : this.p1Player;
  }

  /** checkForWin: check this.board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match this.currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  startGame() {
    let startButton = document.getElementById('start');
    startButton.addEventListener('click', () => {
      console.log("THIS", this);
      this.board = [];
      this.currPlayer = 1;
      const htmlBoard = document.getElementById('board');
      htmlBoard.remove();
      let newBoard = document.createElement('table');
      newBoard.id = 'board'
      let game = document.getElementById('game');
      game.appendChild(newBoard);
      this.makeBoard();
      this.makeHtmlBoard();
    });
  }


}

class Player {
  constructor(color) {
    this.color = color;
    this.submitColorForm();
  }

  returnColor() {
    return this.color;
  }

  loadDom() {
    document.addEventListener("DOMContentLoaded", () => { });
  }

  submitColorForm() {
    let colorFormSubmit = document.getElementById('submit-form');

    colorFormSubmit.addEventListener('click', () => {
      let p1Color = document.getElementById('p1').value;
      let p2Color = document.getElementById('p2').value;

      // Initialize players
      let p1Player = new Player(p1Color);
      let p2Player = new Player(p2Color);

      // Start Game
      new Game(6, 7, p1Player, p2Player)

    })

  }
}

let start = new Player();
