FROM node
WORKDIR /app-node
ARG PORT_BUILD=9999
ENV PORT=$PORT_BUILD
EXPOSE $PORT_BUILD

COPY --chown=node:node package.json ./

RUN yarn 

COPY --chown=node:node . .

RUN yarn prebuild && yarn build

ENTRYPOINT yarn start
