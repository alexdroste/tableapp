# Development

## Prerequisites 

#### Tools 

Install the following tools:

* node
* yarn

#### Install dependencies

In order to run a project you need to install the dependencies (node_modules). This can be done by *`cd`-ing* into the project directory (`client`, `backend` or `client_desktop`). Each directory must include a file called `package.json`.

To install the `node_modules` execute: `yarn install` (inside the project-directory).

## Backend

#### Start

You can run the backend in two different ways.

* Start node directly by executing: `yarn start` (inside `backend`-dir)
* Start nodemon that restarts the node app automagically everytime the source-files change (really helpful during development) by executing: `yarn nodemon` (inside `backend`-dir)

## (Web-)Client

#### Start

Execute `yarn start` (inside `client`-dir). The app will be served (by default) at http://localhost:3000.

## Desktop-Client

#### Start

Start the (Web-)Client (make sure it started on http://localhost:3000) and execute `yarn start` (inside `client_desktop`-dir).