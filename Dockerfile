##### BASE
FROM node:16-bullseye-slim as base

# install open ssl for prisma
RUN apt-get update && apt-get install -y openssl

RUN npm i -g pnpm

##### BUILD
FROM base as build

# you can set the value using --build-arg
ARG env_file=.docker.env

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .
COPY ${env_file} .env

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN pnpm build
# Remove devDependencies
RUN pnpm prune --prod


##### FINAL
FROM base

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

ENV PORT 8080
EXPOSE 8080

CMD ["pnpm", "start"]
