# Task API

Create a task with the given content for user.

## Create Task

- Tasks status can be `Pending`, `In Progress`, `Completed`.

- Tasks due date must be 1 day after the creation date.

### Request

```http request
POST /api/v1/tasks/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
Content-Type: application/json
Content-Length: 143

{
    "title": "Sample Task 1",
    "description": "Sample Task 1 Description",
    "status": "Pending",
    "dueDate": "2024-12-01T10:00:00"
}
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/tasks/' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Sample Task 1",
    "description": "Sample Task 1 Description",
    "status": "Pending",
    "dueDate": "2024-12-01T10:00:00"
}'
```

### Response

```http request
HTTP/1.1 201 Created
```

```json
{
  "success": true,
  "result": {
    "title": "Sample Task 1",
    "description": "Sample Task 1 Description",
    "status": "Pending",
    "dueDate": "2024-12-01T10:00:00.000Z",
    "user": "66ba880e30cadc3a68a58774",
    "_id": "66ba8a8a30cadc3a68a5877c",
    "createdAt": "2024-08-12T22:19:54.938Z",
    "updatedAt": "2024-08-12T22:19:54.938Z",
    "id": "66ba8a8a30cadc3a68a5877c"
  }
}
```

## Get Tasks

Get all tasks with pagination and filter options.

- Default page is 1.

- Default limit is 10.

- Filter options are `status`, `startDate`, `endDate`.

  - dueDate is between `startDate` and `endDate`.

- Sort via `sortBy` and `sortOrder`.

  - sortOrder can be `asc` or `desc`.

### Request

```http request
GET /api/v1/tasks/?limit=3&page=1&status=Pending&startDate=2024-12-01T00:00:00&endDate=2024-12-02T00:00:00&sortBy=createdAt&sortOrder=asc HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/tasks/?limit=3&page=1&status=Pending&startDate=2024-12-01T00%3A00%3A00&endDate=2024-12-02T00%3A00%3A00&sortBy=createdAt&sortOrder=asc' \
--header 'Authorization: Bearer <token>'
```

### Response

```http request
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "totalCount": 1,
  "totalPages": 1,
  "currentPage": 1,
  "limit": 3,
  "result": [
    {
      "_id": "66ba8a8a30cadc3a68a5877c",
      "title": "Sample Task 1",
      "description": "Sample Task 1 Description",
      "status": "Pending",
      "dueDate": "2024-12-01T10:00:00.000Z",
      "user": "66ba880e30cadc3a68a58774",
      "createdAt": "2024-08-12T22:19:54.938Z",
      "updatedAt": "2024-08-12T22:19:54.938Z",
      "id": "66ba8a8a30cadc3a68a5877c"
    }
  ]
}
```

## Get Task

### Request

```http request
GET /api/v1/tasks/66ba8a8a30cadc3a68a5877c/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
```

```shell
curl --location 'http://127.0.0.1:8080/api/v1/tasks/66ba8a8a30cadc3a68a5877c/' \
--header 'Authorization: Bearer <token>'
```

### Response

```http request
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "result": {
    "_id": "66ba8a8a30cadc3a68a5877c",
    "title": "Sample Task 1",
    "description": "Sample Task 1 Description",
    "status": "Pending",
    "dueDate": "2024-12-01T10:00:00.000Z",
    "user": "66ba880e30cadc3a68a58774",
    "createdAt": "2024-08-12T22:19:54.938Z",
    "updatedAt": "2024-08-12T22:19:54.938Z",
    "id": "66ba8a8a30cadc3a68a5877c"
  }
}
```

## Update Task

Update task fields which are `title`, `description`, `status`, `dueDate`.

### Request

```http request
PATCH /api/v1/tasks/66ba8a8a30cadc3a68a5877c/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Sample Task 1 Update"
}
```

```shell
curl --location --request PATCH 'http://127.0.0.1:8080/api/v1/tasks/66ba8a8a30cadc3a68a5877c/' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \

--data '{
    "title": "Sample Task 1 Update"
}'
```

### Response

```http request
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "result": {
    "_id": "66ba8a8a30cadc3a68a5877c",
    "title": "Sample Task 1 Update",
    "description": "Sample Task 1 Description",
    "status": "Pending",
    "dueDate": "2024-12-01T10:00:00.000Z",
    "user": "66ba880e30cadc3a68a58774",
    "createdAt": "2024-08-12T22:19:54.938Z",
    "updatedAt": "2024-08-12T22:38:33.972Z",
    "id": "66ba8a8a30cadc3a68a5877c"
  }
}
```

## Delete Task

### Request

```http request
DELETE /api/v1/tasks/66ba8f8b30cadc3a68a58793/ HTTP/1.1
Host: 127.0.0.1:8080
Authorization: Bearer <token>
```

```shell
curl --location --request DELETE 'http://127.0.0.1:8080/api/v1/tasks/66ba8f8b30cadc3a68a58793/' \
--header 'Authorization: Bearer <token>'
```

### Response

```http request
HTTP/1.1 204 No Content
```
