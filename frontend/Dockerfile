## Install server dependencies (only when needed)
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


## Compile the React website
FROM node:16-alpine AS build-react
ARG ORCID_CLIENT_ID
ARG ORCID_CLIENT_SECRET
ARG FRONTEND_URL
ARG API_URL
ENV FRONTEND_URL=$FRONTEND_URL

# Install the react-taggy lib from git to get latest fixes:
RUN apk add git
WORKDIR /opt
RUN git clone --branch add-onclick-callback https://github.com/vemonet/react-taggy.git
WORKDIR /opt/react-taggy
RUN yarn

# Compile the frontend
COPY app /app
WORKDIR /app
RUN yarn install

RUN echo "CHECK FRONTEND_URL"
RUN echo $FRONTEND_URL

RUN FRONTEND_URL=$FRONTEND_URL API_URL=$API_URL yarn build


## Add the React website to the NodeJS server and run
FROM node:16-alpine AS runner

ENV NODE_ENV production
ENV API_URL=http://localhost:8000
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY server.ts package.json yarn.lock ./
RUN chown -R nodejs:nodejs /app

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build-react --chown=nodejs:nodejs /app/web-build ./public
COPY --from=build-react --chown=nodejs:nodejs /opt/react-taggy /opt/react-taggy

USER nodejs

EXPOSE 4000
CMD ["yarn", "serve"]
