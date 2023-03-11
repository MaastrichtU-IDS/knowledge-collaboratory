
FROM node:18-alpine AS builder

RUN apk add --no-cache libc6-compat git
WORKDIR /app

COPY package.json yarn.lock* ./
# RUN yarn --frozen-lockfile
RUN yarn

ARG FRONTEND_URL
ARG API_URL
ENV PUBLIC_FRONTEND_URL=$FRONTEND_URL
ENV PUBLIC_API_URL=$API_URL
ENV NODE_ENV production

COPY . .

RUN yarn build

# In case someone want to use this docker image for development
CMD ["yarn", "dev"]


FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
