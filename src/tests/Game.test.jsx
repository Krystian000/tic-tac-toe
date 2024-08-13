import React from 'react';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('App', () => {
    test('renders the game header', () => {
        act(() => {
            render(<App />);
        });
        const headerElement = screen.getByText(/tic-tac-toe/i);
        expect(headerElement).toBeInTheDocument();
    });

    test('renders the start game button', () => {
        act(() => {
            render(<App />);
        });
        const startButton = screen.getByText('Start Game');
        expect(startButton).toBeInTheDocument();
    });

    test('renders the game borad', () => {
        act(() => {
            render(<App />);
        });
        const startButton = screen.getByText('Start Game');
        act(() => {
            startButton.click()
        });
        const board = screen.getByTestId('board');
        expect(board).toBeInTheDocument();
    });

    test('renders the game borad cells', () => {
        act(() => {
            render(<App />);
        });
        const startButton = screen.getByText('Start Game');
        act(() => {
            startButton.click()
        });
        const cells = screen.getAllByTestId('cell');
        expect(cells).toHaveLength(9);
    });

    test('renders new game button after winning', () => {
        act(() => {
            render(<App />);
        });
        const startButton = screen.getByText('Start Game');
        act(() => {
            startButton.click()
        });
        const cells = screen.getAllByTestId('cell');
        act(() => {
            cells[0].click()
            cells[3].click()
            cells[1].click()
            cells[4].click()
            cells[2].click()
        });
        const newGameButton = screen.getByText('New Game');
        expect(newGameButton).toBeInTheDocument();
    });
});
