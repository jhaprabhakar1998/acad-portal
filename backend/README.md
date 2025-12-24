# A Node+Express Service
A sample containerized node service which can run on any server.

## Pre-Requisite
Nvm should be installed so as to run the code using specified node version in .nvmrc file. Docker should also be installed to test that how code will behave in a production environment.

## Repo Structure
- `.github` folder contains things related to actions and other stuff and is not needed for local or production run time. It's for ease of CI/CD process
- `src` folder contains the core logic and code
- `tests` folder contains the test

## CI / CD 
We are using `github actions` to build and push artifactory to  `google cloud artifact registry` and from there we can deploy it. We can even look into `Jenkins` to automate CI/CD but that would lead to more infra maintainance and additional cost for running jenkins server. Github actions serve the purpose without requiring any maintainance efforts.

### Current CI Workflows
1. Basic project build and test - This will be triggered whenever a new PR/commit is pushed into master branch.
2. Create Docker image and push to GCP - This will only triggered when there is a new commit into master and not on PR to save cost. 

## Forking this repo to create service
1. Make sure to check that github workflows variables are changed like dockerimagename, project etc.
2. Configure secrets into your new repository
3. Make sure node version meet your requirement

## Running in Local environment
- `nvm use` - To read node version from .nvmrc file
- `npm i` - To install node packages
- `npm run dev` - To start the local server on port specified in .env.local file
- `curl --location --request GET 'http://127.0.0.1:30000/health'` - Check that service health check is working
- `curl --location --request GET 'http://127.0.0.1:30000/api/v1/students'` - Check that db connection is ok (If not, then docker mongodb may not have started and we need manually start docker containers using `sudo docker-compose up -d`)

We have also added a docker-compose.yaml file which starts local mongodb server, so you don't need to install mongodb separately. In  package.json we have added `sudo docker-compose up -d` command to start the mongodb serve. If your docker is not installed in your root namespace you can remove `sudo` from it.

## Running in Prod environment
The .env files should contain all environment variables. It would run as an container in prod environment. We have one `.env.defaults` file which loads all default environment value unless overridden by different .env file and another `.env.schema` file which mentions all environment variables present and their schemas.

- `NODE_ENV` - Specifies the environment. Can take 3 values `production`, `development` and `test`
- `APP_ENV` - Specifies the environment file that will be used. If `NODE_ENV` is prod environment it will read `.env.[APP_ENV]` file. It can also take 2 values staging, and production.

`npm run start` - To start the server on port specified in zone specific .env file.

When we are running in production environment, we will be reading .env.production file from our image but we don't keep credentials and secrets directly exposed in our image. So we can keep file in our host system and mount it in image using `docker run -v [Host file path for env.production]:/usr/src/app/.env.production -dp 30000:30000 [IMAGE_NAME]`

## Running container locally in prod environment (Docker)
You can run your container locally as well by simulating the prod environment.
- `docker build -f dev.Dockerfile -t test:1.0.0 .` - Build docker image using dev.Dockerfile
- `docker run -dp 30000:30000 test:1.0.0 ` - Run docker image and specify ports accordingly
