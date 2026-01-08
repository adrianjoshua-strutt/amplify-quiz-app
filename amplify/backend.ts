import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { gameManager } from './functions/game-manager/resource';

export const backend = defineBackend({
  auth,
  data,
  gameManager,
});

// Grant the game manager function access to the data resources
backend.gameManager.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'appsync:GraphQL',
    ],
    resources: [
      backend.data.resources.graphqlApi.arn + '/*',
    ],
  })
);

// Create admin group for question management
backend.auth.resources.userPool.addGroup('admins', {
  description: 'Admin users who can manage questions and categories',
});