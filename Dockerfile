FROM node:24-slim

RUN apt-get update && apt-get -y upgrade && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /usr/local/share/.config/yarn/global \
    && echo '{"resolutions":{"compression":"1.8.2"}}' > /usr/local/share/.config/yarn/global/package.json \
    && yarn global add serve \
    && yarn cache clean \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn*
RUN mkdir /app
COPY /build /app
WORKDIR /app
USER node

EXPOSE 5000
ENV PORT="5000"
CMD serve -s -n -l tcp://0.0.0.0:5000
