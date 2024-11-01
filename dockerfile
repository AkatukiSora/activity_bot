FROM ubuntu:22.04 AS base
RUN apt-get update && \
    apt-get upgrade --no-install-recommends -y && \
    apt-get install --no-install-recommends -y curl ca-certificates dumb-init && \
    curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s lts && \
    apt-get purge -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM base AS builder 
RUN npm install -g yarn
RUN mkdir /builder
WORKDIR /builder
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
RUN mkdir -p /builder/dist
WORKDIR /builder/dist
RUN cp ../package.json ./ && \
    cp ../yarn.lock ./ && \
    yarn install --production
WORKDIR /builder
COPY ./ ./
RUN yarn build
WORKDIR /builder/dist


FROM base AS app
ENV NODE_ENV=production
RUN groupadd -g 1234 node && \
    useradd -m -u 1234 -g node node
COPY --from=builder --chown=node:node /builder/dist /app
USER node
WORKDIR /app
#CMD ["dumb-init", "node", "index.js"]
CMD ["dumb-init", "node", "dbtest.js"]