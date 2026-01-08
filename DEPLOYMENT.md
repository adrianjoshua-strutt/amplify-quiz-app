# Quiz Battle Arena - Deployment Guide

This guide will help you deploy the Quiz Battle Arena application to AWS using Amplify Gen2.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js 18+** and npm
4. **Git** for version control

## Step-by-Step Deployment

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd quiz-app

# Install dependencies
npm install
```

### 2. Configure AWS CLI

```bash
# Configure AWS CLI with your credentials
aws configure

# Verify configuration
aws sts get-caller-identity
```

### 3. Deploy Amplify Backend

```bash
# Start Amplify sandbox for development
npx amplify sandbox

# Or deploy to a specific environment
npx amplify deploy --branch main
```

This will:
- Create Cognito User Pool for authentication
- Set up AppSync GraphQL API
- Create DynamoDB tables
- Deploy Lambda functions
- Configure IAM roles and policies

### 4. Seed Initial Data

After the backend is deployed, seed some initial data:

```bash
# Run the seeding script (you'll need to implement this)
npm run seed-data
```

### 5. Deploy Frontend

#### Option A: Amplify Hosting (Recommended)

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git repository

2. **Configure Build Settings**:
   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: dist
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```

3. **Environment Variables**:
   - No manual environment variables needed
   - Amplify automatically provides `amplify_outputs.json`

#### Option B: Manual Deployment

```bash
# Build the application
npm run build

# Deploy to S3 + CloudFront (manual setup required)
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 6. Post-Deployment Setup

#### Create Admin User

1. **Sign up** through the application
2. **Update user profile** in DynamoDB:
   ```bash
   # Use AWS CLI or Console to update the UserProfile table
   # Set isAdmin: true for your user
   ```

#### Add Question Categories

1. **Login as admin**
2. **Go to Admin Panel**
3. **Create categories**:
   - General Knowledge
   - Science & Technology
   - History
   - Sports & Entertainment
   - Geography

#### Generate Questions

1. **Use the AI generation feature** in the admin panel
2. **Or manually add questions** using the form
3. **Test the questions** by creating a lobby and playing

## Environment Configuration

### Development
```bash
# Start development server
npm run dev

# Start Amplify sandbox
npx amplify sandbox
```

### Staging
```bash
# Deploy to staging branch
npx amplify deploy --branch staging
```

### Production
```bash
# Deploy to production
npx amplify deploy --branch main
```

## Monitoring and Maintenance

### CloudWatch Logs
- Monitor Lambda function logs
- Check API Gateway logs
- Review Cognito authentication logs

### Performance Monitoring
- Use AWS X-Ray for tracing
- Monitor DynamoDB metrics
- Check AppSync query performance

### Cost Optimization
- Review DynamoDB read/write capacity
- Monitor Lambda execution time
- Optimize GraphQL queries

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check Cognito User Pool configuration
   - Verify redirect URLs
   - Check user pool client settings

2. **GraphQL API Errors**:
   - Review AppSync schema
   - Check authorization rules
   - Verify DynamoDB table permissions

3. **Lambda Function Errors**:
   - Check CloudWatch logs
   - Verify IAM permissions
   - Review function timeout settings

4. **Frontend Build Errors**:
   - Check TypeScript compilation
   - Verify all dependencies are installed
   - Review Vite configuration

### Debug Commands

```bash
# Check Amplify status
npx amplify status

# View Amplify logs
npx amplify console

# Test GraphQL API
npx amplify api gql-compile

# Reset Amplify environment (careful!)
npx amplify delete
```

## Security Considerations

### Authentication
- Enable MFA for admin users
- Configure password policies
- Set up account lockout policies

### API Security
- Review GraphQL authorization rules
- Implement rate limiting
- Monitor for suspicious activity

### Data Protection
- Enable DynamoDB encryption at rest
- Use HTTPS for all communications
- Implement proper CORS policies

## Scaling Considerations

### Database
- Monitor DynamoDB capacity
- Consider Global Tables for multi-region
- Implement proper indexing

### API
- Use AppSync caching
- Implement pagination
- Optimize resolver performance

### Frontend
- Enable CloudFront caching
- Optimize bundle size
- Implement lazy loading

## Backup and Recovery

### Database Backups
- Enable DynamoDB point-in-time recovery
- Set up automated backups
- Test restore procedures

### Code Backups
- Use Git for version control
- Tag releases properly
- Maintain deployment documentation

## Support and Maintenance

### Regular Tasks
- Update dependencies monthly
- Review security patches
- Monitor performance metrics
- Update documentation

### Emergency Procedures
- Have rollback plan ready
- Know how to scale quickly
- Maintain contact information

---

For additional support, refer to:
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS AppSync Documentation](https://docs.aws.amazon.com/appsync/)
- [Project README](./README.md)