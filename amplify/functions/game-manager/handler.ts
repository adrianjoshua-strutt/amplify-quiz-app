import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('Game Manager Function called', event);
  
  const { httpMethod, pathParameters, body } = event;
  const action = pathParameters?.action;
  
  try {
    switch (action) {
      case 'start-game':
        return await startGame(JSON.parse(body || '{}'));
      case 'process-buzzer':
        return await processBuzzer(JSON.parse(body || '{}'));
      case 'next-question':
        return await nextQuestion(JSON.parse(body || '{}'));
      case 'end-game':
        return await endGame(JSON.parse(body || '{}'));
      default:
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('Game Manager Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function startGame(data: any) {
  // Game start logic
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Game started',
      gameState: 'IN_PROGRESS'
    }),
  };
}

async function processBuzzer(data: any) {
  // Buzzer processing logic
  const { lobbyId, playerId, questionIndex, buzzerTime } = data;
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Buzzer processed',
      buzzerTime,
      playerId
    }),
  };
}

async function nextQuestion(data: any) {
  // Next question logic
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Next question loaded'
    }),
  };
}

async function endGame(data: any) {
  // End game logic
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      success: true, 
      message: 'Game ended'
    }),
  };
}