# Auth API

Google OAuth is used for authentication.

You need to provide `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in the `.env` file.

You need to make a get request to `/api/v1/auth/google` to authenticate with Google via browser and then when you give permission to the app, you will be redirected to `/api/v1/auth/google/redirect` with the token.

## Auth Google

Make get request from browser to authenticate with Google.

### Request

```http request
GET /api/v1/auth/google HTTP/1.1
Host: 127.0.0.1:8080
```

### Response

```http request
HTTP/1.1 302 Found
```

## Redirect from Google

#### Request

```http request
GET /api/v1/auth/google/redirect HTTP/1.1
Host: 127.0.0.1:8080
```

#### Response

```http request
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "result": {
    "token": "<token>",
    "expiresIn": "1d",
    "tokenType": "Bearer"
  }
}
```
