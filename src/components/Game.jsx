import React from 'react';
import { useMachine } from '@xstate/react';
import TicTacToeMachine from './TicTacToeMachine';
import styled from 'styled-components';

// Styled components
const GameContainer = styled.div`
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 120px);
  grid-template-rows: repeat(3, 120px);
  border: 2px solid #333;
  background-color: #1e1e1e;
  margin-bottom: 20px;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 80px);
    grid-template-rows: repeat(3, 80px);
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(3, 60px);
    grid-template-rows: repeat(3, 60px);
  }
`;

const Cell = styled.button`
  width: 120px;
  height: 120px;
  font-size: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
  background-color: #282828;
  color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #383838;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
    font-size: 2em;
  }

  @media (max-width: 400px) {
    width: 60px;
    height: 60px;
    font-size: 1.5em;
  }
`;

const MessageContainer = styled.div`
  height: 60px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Message = styled.p`
  font-size: 1.5em;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 1.2em;
  }

  @media (max-width: 400px) {
    font-size: 1em;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2em;
  border: 2px solid #e0e0e0;
  background-color: #333;
  color: #e0e0e0;
  cursor: pointer;
  border-radius: 0.5em;

  &:hover {
    background-color: #444;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 1em;
  }

  @media (max-width: 400px) {
    padding: 6px 12px;
    font-size: 0.8em;
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
  }

  .shake {
    animation: shake 0.5s;
  }
`;

// Check if the environment is test
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

// Game component
const Game = () => {
  // Use the TicTacToeMachine
  const [state, send] = useMachine(TicTacToeMachine);

  // Event handlers
  const handleStart = () => {
    send({ type: 'START_GAME' }); // Send the START_GAME event
  };

  const handleMove = (index) => {
    if (state.matches('idle')) {
      // Make animation on start game button
      document.getElementById('startGame').style.animation = 'shake 0.5s';
      setTimeout(() => {
        document.getElementById('startGame').style.animation = '';
      }, 500);
      return;
    }

    if (state.matches('winner') || state.matches('draw')) {
      // Make animation on start game button
      document.getElementById('newGame').style.animation = 'shake 0.5s';
      setTimeout(() => {
        document.getElementById('newGame').style.animation = '';
      }, 500);
      return;
    }

    send({ type: 'MAKE_MOVE', index }); // Send the MAKE_MOVE event with the index
  };

  const handleReset = () => {
    send({ type: 'RESET' }); // Send the RESET event
  };

  return (
    <>
      <GameContainer>
        
        <Board
          style={{
            opacity: state.matches('playing') ? 1 : 0.5, // Dim the board if not playing
            transform: state.matches('playing') ? 'scale(1)' : 'scale(0.9)', // Scale the board if not playing
          }}
          {...(isTestEnv ? { 'data-testid': 'board' } : {})}
        >
          {state.context.board.map((cell, index) => (
            <Cell
              key={index}
              onClick={() => handleMove(index)}
              {...(isTestEnv ? { 'data-testid': 'cell' } : {})}
            >
              {cell}
            </Cell>
          ))}
        </Board>

        <MessageContainer>
          {/* Display messages based on the state */}
          {state.matches('winner') && <Message>Winner: {state.context.currentPlayer}</Message>}
          {state.matches('draw') && <Message>It's a draw!</Message>}
        </MessageContainer>

        <ButtonContainer>
          {/* Display buttons based on the state */}
          {state.matches('idle') && <Button id='startGame' onClick={handleStart}>Start Game</Button>}
          {(state.matches('winner') || state.matches('draw')) && (
            <Button id='newGame' onClick={handleReset}>New Game</Button>
          )}
        </ButtonContainer>
        
      </GameContainer>
    </>
  );
};

export default Game;
