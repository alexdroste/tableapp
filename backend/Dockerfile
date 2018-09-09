FROM node:9

RUN mkdir /app
WORKDIR /app
COPY ["package*.json", "npm-shrinkwrap.json*", "yarn.lock", "./"]
ENV NODE_ENV production
RUN yarn install --production=true
COPY ./src ./src
EXPOSE 4898
CMD ["yarn", "start"]