## Demo

## Installing the API Locally

- Download or clone the project, access the project folder with the terminal and execute the CLI <code>npm install</code>
- Create a .env file same as .env-sample / or change constants to your database options.
- Run the server <code>npm start</code>
- Alternatively, you can run the server in development mode <code>npm run dev</code>
- The server will be running on port 8080 or 5000
- Access <a href="http://localhost:8080/api/">http://localhost:8080/api/v1</a> in your browser

```bash
$ npm install
$ npm start
$ npm run dev
```

### Docker

code to run the docker container

```code
$ docker-compose up --build
$ docker-compose down
```

### Test and Coverage

- To run all tests at once `npm run test`
- To run coverage `npm run coverage`

```bash
$ npm run test
$ npm run coverage
```

## Formatting and Linting

- To run eslint `npm run lint`
- To run prettier `npm run format`

```bash
$ npm run lint
$ npm run format
```

## Hooks

### Pre-commit

- To run pre-commit `npm run pre-commit`

```bash
$ npm run pre-commit
```

### Pre-push

- To run pre-push `npm run pre-push`

```bash
$ npm run pre-push
```

### Example .env

.env should provide

    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_URL=your_db_url
    DB_NAME=your_db_name
    DB_OPTION=your_db_option
    MONGO_URI_PREFIX=your_mongo_uri_prefix
    PORT=your_port

    TOKEN_SECRET=your_token_secret
    TOKEN_EXPIRE_IN=your_token_expire_in

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=your_google_redirect_uri

    LOG_LEVEL=your_log_level
    LOG_FILE_DIR=your_log_file_dir

### API Documentation

## User API

[README](docs/user.md)

## Auth API

[README](docs/auth.md)

## Task API

[README](docs/task.md)
