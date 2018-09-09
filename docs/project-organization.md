# Project Organization

The project is organized into the following five components:

- Backend
- Database
- (Web-)Client
- Desktop-Client (Electron)
- Docs

## Backend

The backend is a node.js-app that runs as service on a central server.

The backend must be able to connect to the universities authentication service (ldap) and to the applications database.

Its task is to listen for clients connecting via websockets and to offer them a message-based API. This API is used by the clients to request any data (events, entries, comments, …) and to receive data-updates in real-time. The connection is hereby stateful and bidirectional. Data is queried from and written to the connected mongo-database.

## Database

The database is a noSQL mongoDB that runs on a db/central server.

It stores all of the apps/platforms persistent data.

## (Web-)Client

The (Web-)Client is a reactjs-app that runs inside the users browser.

It must be able to connect to the backend (websocket-API).

All user-interaction with the platform is managed by the client. Data must be presented (in a meaningful/visually appealing way) to the user. 

## Desktop-Client (Electron)

The Desktop-Client is a electron-app that wraps the (Web-)Client and is meant to be used by the lecturer/presenter during the lecture/presentation.

The electron-app is targetted cross-platform. It opens a chrome-rendering context and loads the reactjs-webclient. During load the webclient recognizes the electron context and enables special features. 

The Desktop-Client allows lecturers to create interval-based screencaptures of the presentation-PC (during the lecture) and submit these to the backend (broadcast to currently active users). The slightly different UI also enables the lecturer to keep track of incoming questions and to answer them (in front of the students).

## Docs

The Docs (documentation) are static and consist of two parts:

* handwritten docs (like this part) and
* generated code-docs (look for "… Code Docs" in the sidebar).