import { createActor } from 'xstate';
import TicTacToeMachine from '../components/TicTacToeMachine';

describe('TicTacToeMachine', () => {
  let actor;

  beforeEach(() => {
    actor = createActor(TicTacToeMachine).start();
  });

  it('should start in the idle state', () => {
    expect(actor.getSnapshot().matches('idle')).toBe(true);
  });

  it('should transition to playing state on START_GAME', () => {
    actor.send({ type: 'START_GAME' });
    expect(actor.getSnapshot().matches('playing')).toBe(true);
  });

  it('should make a move and switch player', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 });
    expect(actor.getSnapshot().context.board[0]).toBe('O');
    expect(actor.getSnapshot().context.currentPlayer).toBe('X');
  });

  it('should detect a winner', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 3 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 1 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 4 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 2 }); // O
    expect(actor.getSnapshot().matches('winner')).toBe(true);
  });

  it('should detect a draw', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 1 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 2 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 4 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 3 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 5 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 7 }); // O
    actor.send({ type: 'MAKE_MOVE', index: 6 }); // X
    actor.send({ type: 'MAKE_MOVE', index: 8 }); // O
    expect(actor.getSnapshot().matches('draw')).toBe(true);
  });

  it('should reset the game', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 });
    actor.send({ type: 'RESET' });
    expect(actor.getSnapshot().matches('playing')).toBe(true);
    expect(actor.getSnapshot().context.board).toEqual(Array(9).fill(null));
    expect(actor.getSnapshot().context.currentPlayer).toBe('O');
  });

  it('should not allow a move on a non-empty cell', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 });
    actor.send({ type: 'MAKE_MOVE', index: 0 });
    expect(actor.getSnapshot().context.board[0]).toBe('O');
    expect(actor.getSnapshot().context.currentPlayer).toBe('X');
  });

  it('should switch player after a valid move', () => {
    actor.send({ type: 'START_GAME' });
    actor.send({ type: 'MAKE_MOVE', index: 0 });
    expect(actor.getSnapshot().context.currentPlayer).toBe('X');
    actor.send({ type: 'MAKE_MOVE', index: 1 });
    expect(actor.getSnapshot().context.currentPlayer).toBe('O');
  });
});
