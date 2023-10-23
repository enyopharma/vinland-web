# Stage 1 - build a new artifact
FROM node:14.19.0 as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci && npm audit fix
COPY . ./
RUN npm run build

# Stage 2 - copy the artifact and serve it with nginx
FROM nginx:1.17
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
