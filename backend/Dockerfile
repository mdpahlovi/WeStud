# syntax=docker/dockerfile:1

# --- Build stage: install all deps and compile TS + admin panel ---
FROM node:alpine AS build
WORKDIR /opt/app

# libc6-compat: required by some native deps on Alpine
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=build
RUN npm run build

# --- Runtime stage: production deps + compiled output only ---
FROM node:alpine AS runtime
WORKDIR /opt/app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node .env ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node --from=build /opt/app/dist ./dist
COPY --chown=node:node --from=build /opt/app/public ./public
COPY --chown=node:node --from=build /opt/app/database ./database
COPY --chown=node:node favicon.png ./

# Drop privileges; app only needs write access to uploads
RUN mkdir -p public/uploads && chown node:node public/uploads
USER node

EXPOSE 1337

CMD ["npm", "run", "start"]
