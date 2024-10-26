FROM ubuntu:22.04 AS base
ENV NODE_ENV=production
RUN apt-get update && \
    apt-get install -y curl dumb-init && \
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
COPY ./ ./
RUN yarn build
WORKDIR /builder/dist
RUN cp ../package.json ./ && \
    cp ../yarn.lock ./ && \
    yarn install --production


FROM base AS app
RUN groupadd -g 1234 node && \
    useradd -m -u 1234 -g node node
COPY --from=builder --chown=node:node /builder/dist /app
USER node
WORKDIR /app
CMD ["dumb-init", "node", "index.js"]