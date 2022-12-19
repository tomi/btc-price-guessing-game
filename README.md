# Bitcoin price guessing game

A monorepo where the backend is located in `apps/backend` and frontend in `apps/frontend`

## Local development

`npm run dev` does the following:

- starts the build watch process for the backend
- starts the dev server for backend
- starts the backend database (in docker)
- starts the build watch process for the frontend
- starts the dev server for frontend

The backend can also be ran in synced mode in AWS with `sam sync --stack-name <name-for-the-cf-stack> --watch`.

## Environment variables

There's a `.env-example` file which contains the required env variables and local dev values for these. To use it run:

```bash
cp .env-example .env
source .env
```

## Tests

Backend contains some unit tests, while frontend contains tests that test the whole app end-to-end. Both frontend and backend tests can be run with `npm test`.

## Deployment

### Bootstrapping

Deploy the backend

1. Make sure you have
   1. [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
   2. [Amplify CLI](https://docs.amplify.aws/cli/start/install/) installed
   3. A working [AWS profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)
2. Register and acquire an API key to the CoinGecko's API [here](https://rapidapi.com/coingecko/api/coingecko/). Store the API key to the secret manager with name `btcApiKey`:

```bash
aws secretsmanager create-secret --name btcApiKey --secret-string <api_key_here>
```

3. Build & deploy the backend `cd apps/backend && npm run deploy`
4. Note the `ApiBaseUrl` from the deploy output. This is the backend base URL, which needs to be configured for the frontend with `VITE_API_BASE_URL` env variable

Deploy the frontend:

1. Change directory `cd apps/frontend`
2. Initialize the project with `amplify init`
   1. Change the `Distribution Directory Path` to `dist`
   2. Change the `Build Command` to `npm run build`
3. Add hosting to the amplify project with `amplify add hosting`
   1. Choose `Amazon CloudFront and S3`
   2. Environment setup can be either DEV or PROD
4. Publish the frontend with `npm run deploy`

### Subsequent deploys

`npm run deploy-backend` and `npm run deploy-frontend`

## Architecture

![Emissions calculation overview](./docs/architecture.drawio.svg)

## Further development

- CI/CD pipelines
- Alarms & monitoring & logging
- Better secret management
- Use Lambda layers
- Real-time UI updated e.g. with websockets
