import { createMachine, assign } from 'xstate';

const TicTacToeMachine = createMachine({
  id: 'TicTacToe', // Machine identifier
  initial: 'idle', // Initial state
  context: {
    board: Array(9).fill(null), // Board cells
    currentPlayer: 'O', // Player 'O' always starts
  },
  // All possible states
  states: {
    // Idle state, waiting for the game to start
    idle: { 
      on: {
        START_GAME: [ 
          {
            target: 'playing' // If the event is START_GAME, transition to the 'playing' state
          }
        ]
      }
    },
    // Playing state, where the game is ongoing
    playing: {
      on: {
        // When a player makes a move
        MAKE_MOVE: [
          {
            guard: 'isCellEmpty', // Only allow the move if the cell is empty
            actions: 'makeMove', // Update the board with the new move
            target: 'checkWinner' // After making a move, check if there's a winner
          }
        ],
        // Reset the game
        RESET: {
          target: 'playing', // Transition back to the 'playing' state
          actions: 'resetGame' // Reset the game
        }
      }
    },
    // Check if there's a winner or a draw
    checkWinner: {
      always: [
        { guard: 'hasWinner', target: 'winner' }, // If there's a winner, transition to the 'winner' state
        { guard: 'isDraw', target: 'draw' }, // If it's a draw, transition to the 'draw' state
        { target: 'playing', actions: 'switchPlayer' } // Otherwise, continue playing and switch players
      ]
    },
    // Winner state
    winner: {
      on: {
        // Reset the game
        RESET: {
          target: 'playing', // Transition back to the 'playing' state
          actions: 'resetGame' // Reset the game
        }
      }
    },
    // Draw state
    draw: {
      on: {
        // Reset the game
        RESET: {
          target: 'playing', // Transition back to the 'playing'
          actions: 'resetGame' // Reset the game
        }
      }
    }
  }
}, {
  // Guards are used to determine if a transition should be taken
  guards: {
    // Check if the cell is empty
    isCellEmpty: (action) => {
      return action.context.board[action.event.index] === null;
    },

    // Check if there's a winner
    hasWinner: (action) => {
      const { board } = action.context;
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      return lines.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
    },

    // Check if it's a draw
    isDraw: (action) => action.context.board.every(cell => cell !== null)
  },
  // Actions are used to update the context
  actions: {
    // Update the board with the new move
    makeMove: assign({
      board: (action) => {
        const newBoard = [...action.context.board];
        newBoard[action.event.index] = action.context.currentPlayer;
        return newBoard;
      }
    }),

    // Switch the current player
    switchPlayer: assign({
      currentPlayer: (action) => action.context.currentPlayer === 'X' ? 'O' : 'X'
    }),

    // Reset the game
    resetGame: assign({
      board: () => Array(9).fill(null),
      currentPlayer: () => 'O'
    })
  }
});

export default TicTacToeMachine;