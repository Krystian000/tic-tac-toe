import React from 'react';
import Game from './components/Game';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #121212;
    color: #e0e0e0;
    font-family: Arial, sans-serif;
  }
`;

const Header = styled.header`
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 15px 20px;
  text-align: center;
  font-size: 2em;
  border-bottom: 2px solid #333;
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />

      <Header>Tic-Tac-Toe</Header>

      <Game />
    </div>
  );
}

export default App;
