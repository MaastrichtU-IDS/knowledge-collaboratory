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
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs
ARG ORCID_CLIENT_ID
ARG FRONTEND_URL
ARG API_URL
ENV FRONTEND_URL=$FRONTEND_URL
ENV API_URL=$API_URL
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY . .

RUN yarn build

EXPOSE 4000
ENV PORT 4000

CMD ["yarn", "start"]
