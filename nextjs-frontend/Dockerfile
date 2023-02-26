FROM node:18-alpine AS base

# INSTALL DEPENDENCIES only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git
WORKDIR /app

COPY package.json yarn.lock* ./
# RUN yarn --frozen-lockfile
RUN yarn


# BUILDER and RUNNER image to build the source code only when needed
FROM base AS runner
ARG ORCID_CLIENT_ID
ARG FRONTEND_URL
ARG API_URL
# Next.js collects completely anonymous telemetry data about general usage: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

USER nextjs

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY . .

RUN yarn build

EXPOSE 4000

ENV PORT 4000

CMD ["yarn", "start"]




# RUNNER image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# # Automatically leverage output traces to reduce image size:  https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# CMD ["node", "server.js"]