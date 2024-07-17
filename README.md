# socket.io
in this project i created two sides of the project(backend and frontend) to have a better and deeper understanding in web-sockets woth socket.io. also i need to mention that i used other tools which hepls me to develop this project better ,such as webpack and my beloved typescript .


## Features
- able to send messages in a public chat 
- able to send messages to private chats or private users
- able to join a room or create a room for private conversation
- able to reply others while chating inside a room 

Getting Started

## Installation 
for starting both client and server you need to go to each file and install all required dependencies :

for client:
```bash
cd client
npm install -y
npm run dev
```

for server:
```bash
cd server
npm install -y
tsc // compile all typescript files to a javascript file to
    // run it in server
npm run dev
```

and at the end you can open the index.html file and run a live server .
and yes ,you did it .




## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## Appendix

some of the important files are elaborated down below:

## `Client/dist/main.ts`  
A real-time chat application built using Socket.IO, allowing users to send messages to each other in public or private rooms.

#### Features
- Real-time messaging using Socket.IO
- Public and private messaging
- Room support for private conversations
- Error handling for connection errors and disconnections
- Automatic scrolling to the bottom of the chat container 
#### Components
- ChatInputComponent: Handles user input and sends messages to the server
- MessageComponent: Displays individual messages in the chat container
- Header: Displays the chat header with the user's ID and connection status
#### Socket Events
- `connect` : Establishes a connection to the server
- `recieve-message`: Receives messages from the server and displays them in the chat container
- `chat-header`: Updates the chat header with the current room and connection status
- `error`: Handles error messages from the server
- `disconnect`: Handles disconnections from the server
- `offline`: Handles offline events from the server
- `connect_error`: Handles connection errors from the server
#### Functions
- `displayMessage`: Displays a message in the chat container and sends it to the server if necessary
- `displayChatHeader`: Displays the chat header with the user's ID and connection status
 
## `Server/dist/server.ts`

A real-time chat server built using Socket.IO, allowing users to send messages to each other in public or private rooms.

#### Features
- Real-time messaging using Socket.IO
- Public and private messaging
- Room support for private conversations
- Error handling for connection errors and disconnections

#### Socket Events
- `public-message`: Sends a message to all connected clients
- `join-room`: Joins a client to a specific room
- `leave-room`: Leaves a client from a specific room
- `room-message`: Sends a message to all clients in a specific room
- `private-message`: Sends a private message to a specific client
Functions
- `displayMessage`: Displays a message in the chat container and sends it to the server if necessary
- `displayChatHeader`: Displays the chat header with the user's ID and connection status

## Contributing 
 
Contributions are welcome! Please open a pull request to contribute to the project.

## Issues
If you encounter any issues, please open an issue on GitHub.
