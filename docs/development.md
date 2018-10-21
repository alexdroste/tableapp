# Development

## Prerequisites 

#### Tools 

Install the following tools:

* node
* yarn

#### Install dependencies

In order to run a project you need to install the dependencies (node_modules). This can be done by *`cd`-ing* into the project directory (`client`, `backend` or `client_desktop`). Each directory must include a file called `package.json`.

To install the `node_modules` execute: `yarn install` (inside the project-directory).

#### Trust self-signed certificates (for SSL)

You need to fully trust the certificate `backend/localhost.crt`. If you do not trust the cert, your dev-client won't be able to connect to the backend.

**For macOS:** Open `Keychain Access`, add the `backend/localhost.crt` to the `login`-Keychain and select `Always Trust`.

**For other OS**: Google `trust self-signed cert <your os>`

If you use **Chrome** you will need to set the `chrome://flags/#allow-insecure-localhost` to `Enabled`.

## Backend

#### Start

You can run the backend in two different ways.

* Start node directly by executing: `yarn start` (inside `backend`-dir)
* Start nodemon that restarts the node app automagically everytime the source-files change (really helpful during development) by executing: `yarn nodemon` (inside `backend`-dir)

## (Web-)Client

#### Start

Execute `yarn start` (inside `client`-dir). The app will be served (by default) at https://localhost:3000.

## Desktop-Client

#### Start

Start the (Web-)Client (make sure it started on https://localhost:3000) and execute `yarn start` (inside `client_desktop`-dir).