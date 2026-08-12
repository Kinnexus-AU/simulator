FROM node:24-slim

RUN yarn global add serve \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn*
RUN mkdir /app
COPY /build /app
WORKDIR /app
USER node

EXPOSE 5000
ENV PORT="5000"
CMD serve -s -n -l tcp://0.0.0.0:5000
