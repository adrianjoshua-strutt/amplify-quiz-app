import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // User Profile with stats
  UserProfile: a
    .model({
      id: a.id(),
      username: a.string().required(),
      email: a.email().required(),
      crowns: a.integer().default(0),
      totalScore: a.integer().default(0),
      gamesPlayed: a.integer().default(0),
      gamesWon: a.integer().default(0),
      friends: a.string().array(),
      isAdmin: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Question categories and difficulties
  QuestionCategory: a
    .model({
      id: a.id(),
      name: a.string().required(),
      description: a.string(),
      isActive: a.boolean().default(true),
      questions: a.hasMany('Question', 'categoryId'),
      lobbies: a.hasMany('GameLobby', 'categoryId'),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'update', 'delete']),
    ]),

  // Questions catalog
  Question: a
    .model({
      id: a.id(),
      question: a.string().required(),
      options: a.string().array().required(),
      correctAnswer: a.integer().required(),
      difficulty: a.enum(['EASY', 'MEDIUM', 'HARD']),
      categoryId: a.id(),
      category: a.belongsTo('QuestionCategory', 'categoryId'),
      points: a.integer().default(100),
      isActive: a.boolean().default(true),
      createdBy: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.group('admins').to(['create', 'update', 'delete']),
    ]),

  // Game lobbies
  GameLobby: a
    .model({
      id: a.id(),
      name: a.string().required(),
      hostId: a.string().required(),
      players: a.string().array(),
      maxPlayers: a.integer().default(8),
      isActive: a.boolean().default(true),
      gameState: a.enum(['WAITING', 'STARTING', 'IN_PROGRESS', 'FINISHED']),
      currentQuestionIndex: a.integer().default(0),
      questions: a.string().array(),
      categoryId: a.id(),
      category: a.belongsTo('QuestionCategory', 'categoryId'),
      sessions: a.hasMany('GameSession', 'lobbyId'),
      events: a.hasMany('GameEvent', 'lobbyId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
      allow.ownerDefinedIn('hostId').to(['update', 'delete']),
    ]),

  // Game sessions and scoring
  GameSession: a
    .model({
      id: a.id(),
      lobbyId: a.id().required(),
      lobby: a.belongsTo('GameLobby', 'lobbyId'),
      playerId: a.string().required(),
      playerUsername: a.string().required(),
      score: a.integer().default(0),
      answers: a.json(),
      buzzerTimes: a.json(),
      isWinner: a.boolean().default(false),
      completedAt: a.datetime(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
      allow.ownerDefinedIn('playerId').to(['update']),
    ]),

  // Real-time game events
  GameEvent: a
    .model({
      id: a.id(),
      lobbyId: a.id().required(),
      lobby: a.belongsTo('GameLobby', 'lobbyId'),
      eventType: a.enum(['PLAYER_JOINED', 'PLAYER_LEFT', 'QUESTION_STARTED', 'BUZZER_PRESSED', 'ANSWER_REVEALED', 'GAME_ENDED']),
      playerId: a.string(),
      playerUsername: a.string(),
      data: a.json(),
      timestamp: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
    ]),

  // Friend requests
  FriendRequest: a
    .model({
      id: a.id(),
      fromUserId: a.string().required(),
      fromUsername: a.string().required(),
      toUserId: a.string().required(),
      toUsername: a.string().required(),
      status: a.enum(['PENDING', 'ACCEPTED', 'DECLINED']),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create']),
      allow.ownerDefinedIn('fromUserId').to(['update', 'delete']),
      allow.ownerDefinedIn('toUserId').to(['update']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});