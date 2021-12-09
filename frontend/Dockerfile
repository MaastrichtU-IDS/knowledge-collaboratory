## Install server dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


## Build React website
FROM node:16-alpine AS build-react
COPY app /app
ARG ORCID_CLIENT_ID
ARG ORCID_CLIENT_SECRET
ARG OAUTH_REDIRECT_FRONTEND
ENV API_URL=http://localhost
WORKDIR /app
RUN yarn install --frozen-lockfile
RUN yarn build-prod


## Build and run the server
FROM node:16-alpine AS runner

ENV NODE_ENV production
ENV API_URL=http://localhost
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY server.ts package.json yarn.lock ./ 
RUN chown -R nodejs:nodejs /app

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build-react --chown=nodejs:nodejs /app/web-build ./public


USER nodejs

EXPOSE 4000
CMD ["yarn", "serve"]
