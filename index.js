const prompt = require('prompt-sync')();

const scores = {X: 1, O: -1, tie: 0};

class Game {
    constructor() {
      this.board = new Array(9).fill(null);
      this.turn = "X";
    }

    playGame() {
      while(this.isInProgress()) {
        this.makeMoves();
        console.log(this.board);
      } 
    }
    
    nextTurn() {
      this.turn = this.turn === "X" ? "O" : "X"
    }

    //if we don't find a winning combination and there are possible turns
    isInProgress() {
      return !this.winningCombination(true) && this.board.includes(null);
    }
    
    emptyMoves() {
      return this.board.filter((i) => i === null);
    }
    
   playerSelection () {
      let tile = prompt("Player O, enter a number between 0 to 8: ");

      while(true) {
         if (tile > 8 || tile < 0) { //maybe use regex here 
            tile = prompt("You entered an invalid number, enter a number between 0 to 8: ");
        }  
         else if (this.board[tile] !== null) {
            tile = prompt("The cell you picked is already filled, please pick a new number: ");
        } 
        else break;
    } return Number(tile);
    }
    
    makeMoves() {
      let i;
       if (this.turn == "X") {
          i = this.computerSelection();
          this.board[i] = this.turn;
      } else if (this.turn == "O") {
          i = this.playerSelection();
          this.board[i] = this.turn;
      } 
      this.nextTurn();
    }
   
    computerSelection() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < 9; i++) {
        if (this.board[i] == null) {
            this.board[i] = "X";
            let score = this.minimax(0, false);
            this.board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      } return move;
    }

    minimax(depth, isMaximizing) {
      let result = this.winningCombination(false);

      if (result !== null) { // if we have a winning combination return the score of the winner 
        let winner = this.board[result[0]];
        // if maximizer wins subtract the depth from score, if minimizer wins add the depth to score
        // return winner === "X" ? scores[winner] - depth : scores[winner] + depth;
        return scores[winner];
      }

      if (isMaximizing) {
       let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (this.board[i] == null) {
             this.board[i] = "X";
             let score = this.minimax(depth + 1, false);
             this.board[i] = null;
             bestScore = Math.max(score, bestScore);
          }
        } return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (this.board[i] == null) {
             this.board[i] = "O";
             let score = this.minimax(depth + 1, true);
             this.board[i] = null;
             bestScore = Math.min(score, bestScore);
          }
        } return bestScore;
      } 
    }

    winningCombination(shouldLog = false) {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (this.board[a] && (this.board[a] === this.board[b] && this.board[a] === this.board[c])) {
          if (shouldLog) {
            console.log(`The winner is ${this.board[a]}`, combination);
          }
          return combination; // if we do have a match then place it
        }
      }
      return null; // if not return null 
    }
  }
  
  let g = new Game();
  g.playGame()
