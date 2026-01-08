import { defineFunction } from '@aws-amplify/backend';

export const gameManager = defineFunction({
  name: 'game-manager',
  entry: './handler.ts',
  timeoutSeconds: 60,
  memoryMB: 512,
});