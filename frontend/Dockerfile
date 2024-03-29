FROM node:18-alpine AS base

# INSTALL DEPENDENCIES only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app

COPY package.json yarn.lock* ./
# RUN yarn --frozen-lockfile
RUN yarn


# BUILD + RUN
FROM base AS runner
# FROM node:18-alpine AS runner
WORKDIR /app
# RUN apk add --no-cache libc6-compat git

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# RUN corepack enable && \
#     corepack prepare yarn@stable --activate

ARG ORCID_CLIENT_ID
ARG FRONTEND_URL
ARG API_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$FRONTEND_URL
ENV NEXT_PUBLIC_API_URL=$API_URL
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# COPY package.json ./
# RUN yarn

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .
# COPY . .

RUN yarn build

# RUN npm install
# RUN npm run build

EXPOSE 4000
ENV PORT 4000

CMD ["yarn", "start"]
# CMD ["npm", "run", "start"]
