# Bitcoin price guessing game

## Local development

`npm run dev` starts the build watch process for the backend and the dev server for the frontend.

## Environment variables

Following environment variables are required **during build or development**:

- `VITE_API_BASE_URL`: The base url of the API

## Deployment

## Deploying the backend

The backend is deployed with SAM.

1. Install and configure [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
2. Run `sam deploy --guided`

## Deploying the frontend

The frontend is deployed with AWS Amplify.

1. Install and configure [Amplify CLI](https://docs.amplify.aws/cli/start/install/)
2. Initialize the project with `amplify init`
   1. Change the `Distribution Directory Path` to `dist`
   2. Change the `Build Command` to `npm run build`
3. Add hosting to the amplify project with `amplify add hosting`
   1. Choose `Amazon CloudFront and S3`
   2. Environment setup can be either DEV or PROD
4. Set the required environment variables for the build
5. Publish the frontend with `amplify publish`

## Built with

- React
- Vite
- react-query
