# Deployment

## Prerequisites

#### Tools

Install the following tools:

- node
- yarn
- docker (optional)
- docker-compose (optional)

#### Install dependencies

In order to build/deploy/run a project you need to install the dependencies (node_modules). This can be done by *`cd`-ing* into the project directory (`client` and`backend`). Each directory must include a file called `package.json`.

To install the `node_modules` execute: `yarn install` (inside the project-directory).

#### Configure Backend / Client

See: [Configuration](configuration.md).

---

## Database

### Method 1: Docker-Compose (recommended)

This method requires a docker-compose configuration like the [Single-Server Docker Configuration](#single-server-docker-configuration).

#### Start

Execute `docker-compose up -d mongo`.

### Method 2: Manual (not recommended)

Install and run a mongodb instance somewhere. Read the mongodb docs. If neccessary read the docker manual too.

---

## Backend

### Method 1: Docker-Compose (recommended)

This method requires a docker-compose configuration like the [Single-Server Docker Configuration](#single-server-docker-configuration).

#### Build

You need to build a Docker-Image of the Backend. In order to build the image you simply execute a command like `docker-compose build --no-cache`. The command depends on your docker-compose configuration.

#### Start

Execute `docker-compose up -d backend`.

### Method 2: Docker (not recommended)

#### Build

First you must build the docker-image (of the Backend) by executing something like `docker build -t backend .` (inside the `backend`-dir). Read the docker manual for further information.

#### Start

Execute a command like `docker run -d backend`. Not testet, read the docker manual.

### Method 3: Direct (not recommended)

#### Start

Execute `yarn start-production` (inside `backend`-dir).

---

## (Web-)Client

#### Build

Build the client by executing `yarn build` (inside `client`-dir). This process will create a folder inside the `client`-dir called `build`.

#### Serve 

Serve the contents of the `build`-directory with a Web-Server like nginx or apache.

A simple example-config for nginx would be `table.conf`:

```
server {
  listen 80;
  server_name _;
  root /var/www/tableapp;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
}
```

The `try_files` directive is important because routing is done inside the app. This directive ensures that static files in the root-dir can be queried and served correctly.

Please look at the [Single-Server Docker Configuration](#single-server-docker-configuration).

---

## Desktop-Client

#### Build (macOS only atm)

* Make sure that the `client_desktop` and `client` folders are next to each other. Also ensure that the `client` is prepared to get build.
* Build the Client that gets wrapped by the Desktop-App by executing: `yarn prebuild`
* Build the app by executing: `yarn dist`
* The ready to ship app hides inside the `dist`-directory.

---

## Single-Server Docker Configuration

The easiest way to setup the app is to create a `docker-compose.yml`. The config should look like this:

```yaml
version: '2.1'
services:

    nginx:
        restart: always
        image: nginx
        container_name: nginx
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - /opt/nginx/config/conf.d:/etc/nginx/conf.d:ro
            - /etc/ssl:/etc/ssl:ro
            - /var/www:/var/www


    mongo:
        restart: always
        image: mongo
        container_name: mongo
        volumes:
            - /opt/mongo/data:/data/db


    backend:
        restart: always
        build: ./tableapp/backend
        container_name: backend
        ports:
            - "4898:4898"

```

Make sure you prepare the configured data-folders (like in this example `/opt/nginx/config/conf.d` or `opt/mongo/data`).

With this config it is easy build everything by executing `docker-compose build --no-cache` and to start everything by executing `docker-compose up -d`. Keep in mind that with this configuration the built Webclient must be copied to `/var/www` and nginx needs a config file like the one described in [(Web-)Client#serve](#serve).