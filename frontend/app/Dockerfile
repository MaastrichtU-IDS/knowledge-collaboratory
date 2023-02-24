FROM node:18-alpine

# NOT USED in prod, only used for development with hot reload

WORKDIR /webapp
ARG ORCID_CLIENT_ID
ARG ORCID_CLIENT_SECRET
ARG FRONTEND_URL
ARG API_URL

# Install the react-taggy lib from git to get latest fix:
WORKDIR /opt
RUN git clone --branch add-onclick-callback https://github.com/vemonet/react-taggy.git
WORKDIR /opt/react-taggy
RUN yarn
# RUN yarn build

# Only install NPM packages if package.json or yarn.lock change
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .

# Build in /web-build folder
RUN yarn build

## Serving directly does not work with router:
# expo web --no-dev

EXPOSE 5000

ENTRYPOINT [ "yarn", "serve" ]
