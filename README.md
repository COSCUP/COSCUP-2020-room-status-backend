# Room Status Backend

A simple backend for COSCUP 2020 website to retrieve room status from google spreadsheet, and notify client to request api.

## Quick Start

1. Add environment variable `GOOGLE_SHEETS_API_KEY`
(Get API key from [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials))
  ```
  $ export GOOGLE_SHEETS_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXX
  ```

2. Install dependencies
  ```
  $ npm i
  ```

3. Start (listening on port 7788)
  ```
  $ npm run start
  ```

## Description
It's just a simple backend that retrieve data from google spreadsheet and cache the result each 5 seconds. If the data changed, it would notify clients through the sockets. (It would accept all CORS by default.)

(You need to connect socket to the server origin, Socket.io is used in both sides of server and client)

## API
There's only a single event `update` for socket and it would be without any payload.

There's only a single `GET` HTTP api.

- `GET` /api/rooms_status

  ```json
  {
    "roomsStatus": [
      {
        "id": String,
        "isFull": Boolean
      }
    ]
  }
  ```

## License
MIT