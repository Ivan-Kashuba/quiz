import { io } from 'socket.io-client';
import { LocalStorageKey } from '../localstorage';

const userCode = JSON.parse(
  localStorage.getItem(LocalStorageKey.currentPlayer) || '{}'
)?.code;

console.log('userCode:', userCode);

export const socket = io('http://localhost:8080/quiz-game', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000,
  auth: {
    token: userCode,
  },
});

socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export enum GameSocketEvents {
  GetCurrentGameDetails = 'GetCurrentGameDetails',
  AnswerTheQuestion = 'AnswerTheQuestion',
  UpdateTheQuestion = 'UpdateTheQuestion',
  DeleteTheQuestion = 'DeleteTheQuestion',
}
