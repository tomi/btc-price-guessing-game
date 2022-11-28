# Bitcoin price guessing game

## Prerequisites

- Node.js 18
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- [Amplify CLI](https://docs.amplify.aws/cli/start/install/)

## Local development

`npm run dev` starts the build watch process for the backend and the dev server for the frontend. The backend

## Environment variables

Following environment variables are required **during build or development**:

- `VITE_API_BASE_URL`: The base url of the API

## Deployment

### Deploying the backend

The backend is deployed with SAM.

1. Install and configure [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
2. Change directory `cd apps/backend`
3. Build the backend `npm run build`
4. Build the SAM template `sam build`
5. Deploy the backend `npm run deploy`
6. Note the `ApiBaseUrl` from the deploy output. This is the backend base URL, which is configured for the frontend with `VITE_API_BASE_URL` env variable

### Deploying the frontend

The frontend is deployed with AWS Amplify.

1. Install and configure [Amplify CLI](https://docs.amplify.aws/cli/start/install/)
2. Change directory `cd apps/frontend`
3. Initialize the project with `amplify init`
   1. Change the `Distribution Directory Path` to `dist`
   2. Change the `Build Command` to `npm run build`
4. Add hosting to the amplify project with `amplify add hosting`
   1. Choose `Amazon CloudFront and S3`
   2. Environment setup can be either DEV or PROD
5. Set the required environment variables for the build
6. Publish the frontend with `npm run deploy`
