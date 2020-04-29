FROM node:12-alpine as builder

WORKDIR /home/kf

COPY *.json /home/kf/
RUN npm i
COPY src src
RUN npm run compile

#######################################
FROM node:12-alpine as dist
LABEL maintainer="eterna2 <eterna2@hotmail.com>"

WORKDIR /home/kf

RUN apk add su-exec --no-cache

COPY --from=builder /home/kf/*.json /home/kf/
COPY --from=builder /home/kf/dist dist
RUN chmod +x /home/kf/dist/index.js
RUN npm i --production

ENV PUID=1000
ENV PGID=1000

ENTRYPOINT ["/bin/entrypoint.sh"]
CMD [ "node", "/home/kf/dist/index.js" ]