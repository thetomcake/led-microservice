FROM node:12
ENV HTTP_AUTH_SECRET=ineedchanging
ENV LOG_LEVEL=info
ENV BOARD_PORT=/dev/ttyACM0
ENV NUM_STRIP_LEDS=60
COPY . /app
WORKDIR /app
RUN npm install
ENTRYPOINT ["node", "index.js"]