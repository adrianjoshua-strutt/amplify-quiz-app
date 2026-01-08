# Quiz Battle Arena

A real-time multiplayer quiz application built with AWS Amplify Gen2, React, and TypeScript.

## Features

### 🎮 Core Gameplay
- **Real-time Multiplayer**: Join lobbies and compete with friends
- **Buzzer System**: Press the buzzer to answer questions first
- **Scoring System**: Earn points based on speed and accuracy
- **Crown System**: Winners earn crowns for their profile
- **10-Question Rounds**: Fast-paced quiz sessions

### 👥 Social Features
- **User Profiles**: Unique usernames and friend systems
- **Friend Management**: Add friends and challenge them
- **Leaderboards**: Global rankings by crowns, points, and wins
- **Achievement System**: Unlock achievements as you play

### 🎯 Question Management
- **Category System**: Organize questions by topics
- **Difficulty Levels**: Easy, Medium, and Hard questions
- **Admin Panel**: Manage questions and categories
- **AI Generation**: Use AWS Bedrock to generate questions automatically

### 🔧 Technical Features
- **AWS Amplify Gen2**: Modern serverless backend
- **Real-time Updates**: Live game state synchronization
- **Responsive Design**: Works on desktop and mobile
- **Type Safety**: Full TypeScript implementation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management

### Backend
- **AWS Amplify Gen2** with TypeScript
- **Amazon Cognito** for authentication
- **AWS AppSync** with GraphQL
- **Amazon DynamoDB** for data storage
- **AWS Lambda** for game logic
- **Amazon Bedrock** for AI question generation

### UI/UX
- **Responsive Design** with mobile-first approach
- **Dark Theme** with gradient accents
- **Smooth Animations** and transitions
- **Accessible Components** following WCAG guidelines

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Amplify CLI installed globally

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy the Amplify backend**
   ```bash
   npx amplify sandbox
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Initial Setup

1. **Create an account** using the authentication flow
2. **Set up admin access** (optional):
   - Update your user profile in the database to set `isAdmin: true`
   - Access the admin panel to manage questions and categories

3. **Create question categories**:
   - Go to Admin → Categories
   - Add categories like "Science", "History", "Sports", etc.

4. **Add questions**:
   - Use the manual form or AI generation
   - Ensure questions have 4 options with one correct answer

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BuzzerButton.tsx
│   ├── QuestionDisplay.tsx
│   ├── ScoreBoard.tsx
│   └── ...
├── contexts/           # React contexts for state management
│   ├── AuthContext.tsx
│   └── GameContext.tsx
├── pages/              # Main application pages
│   ├── HomePage.tsx
│   ├── GamePage.tsx
│   ├── AdminPage.tsx
│   └── ...
├── lib/                # Utilities and configurations
│   ├── amplify.ts
│   └── utils.ts
└── styles/             # Global styles and themes

amplify/
├── auth/               # Authentication configuration
├── data/               # GraphQL schema and resolvers
├── functions/          # Lambda functions
└── backend.ts          # Main backend configuration
```

## Game Flow

1. **Authentication**: Users sign up/login with email
2. **Lobby Creation**: Host creates a lobby with category selection
3. **Player Joining**: Friends join using lobby codes
4. **Game Start**: Host starts when ready (min 2 players)
5. **Question Phase**: Display question for 30 seconds
6. **Buzzer Phase**: First to buzz gets to answer
7. **Answer Phase**: Player selects answer, points awarded
8. **Results**: After 10 questions, show winner and stats
9. **Crown Award**: Winner gets a crown added to profile

## Admin Features

### Question Management
- Create, edit, and delete questions
- Organize by categories and difficulty
- Set point values for questions
- Bulk import/export capabilities

### AI Question Generation
- Integration with AWS Bedrock
- Generate questions by category and difficulty
- Automatic formatting and validation
- Review and edit generated content

### User Management
- View user statistics
- Manage admin privileges
- Monitor game activity

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### AWS Deployment
The app is designed to be deployed using AWS Amplify Hosting:

1. Connect your repository to Amplify Console
2. Configure build settings (auto-detected)
3. Deploy with automatic CI/CD

## Environment Variables

The app uses Amplify's automatic configuration through `amplify_outputs.json`. No manual environment variables needed.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the GitHub Issues
- Review the AWS Amplify documentation
- Contact the development team

---

Built with ❤️ using AWS Amplify Gen2 and React