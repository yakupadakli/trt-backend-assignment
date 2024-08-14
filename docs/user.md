# User API

Register and login users.

### Register

#### Request

```http request
POST /api/v1/users/register/ HTTP/1.1
Host: 127.0.0.1:8080
Content-Type: application/json

{
    "name": "John",
    "surname": "Doe",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "password": "12345"
}
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/users/register/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "John",
    "surname": "Doe",
    "username": "john.doe",
    "email": "john.doe@example.com",
    "password": "12345"
}'
```

#### Response

```http request
HTTP/1.1 201 Created
```

```json
{
  "success": true,
  "result": {
    "username": "john.doe",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "password": "$2b$10$K/W6fgsJ3bvGFR361HXg0OKBGiMmFMJGlsYGK/0JedfDMr3i39dai",
    "_id": "66ba880e30cadc3a68a58774",
    "createdAt": "2024-08-12T22:09:18.503Z",
    "updatedAt": "2024-08-12T22:09:18.503Z",
    "id": "66ba880e30cadc3a68a58774"
  }
}
```

### Login

#### Request

```http request
POST /api/v1/users/login/ HTTP/1.1
Host: 127.0.0.1:8080
Content-Type: application/json

{
    "email": "john.doe@gmail.com",
    "password": "12345"
}
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/users/login/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john.doe@gmail.com",
    "password": "12345"
}'
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

### Profile

#### Request

```http request
GET /api/v1/users/profile/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/users/profile/' \
--header 'Authorization: Bearer <token>'
```

#### Response

```http request
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "result": {
    "_id": "66bbee95834f903af1cdf5bf",
    "username": "john.doe",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "password": "$2b$10$IHu4RJa39I/uQZdJpteArOLJ33O0e60ohzzwpFcAF4GqoVKypksoy",
    "createdAt": "2024-08-13T23:39:01.357Z",
    "updatedAt": "2024-08-13T23:39:12.008Z",
    "id": "66bbee95834f903af1cdf5bf"
  }
}
```

### Change Password

#### Request

```http request
PATCH /api/v1/users/change-password/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>

{
    "oldPassword": "1234",
    "newPassword": "12345",
    "newPasswordConfirmation": "12345"
}
```

```shell
curl --location --request PATCH 'http://127.0.0.1:8080/api/v1/users/change-password/' \
--header 'Authorization: Bearer <token>' \
--data '{
    "oldPassword": "1234",
    "newPassword": "12345",
    "newPasswordConfirmation": "12345"
}'
```

#### Response

```http request
{
    "success": true,
    "result": {
        "token": "<token>",
        "expiresIn": "1d",
        "tokenType": "Bearer"
    }
}
```
