FROM debian:stable-slim

RUN apt update -y \
  && apt clean \
  && apt install bash curl unzip -y

RUN curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh -s v1.4.6
RUN export DENO_INSTALL="/root/.local"
RUN export PATH="$DENO_INSTALL/bin:$PATH"
COPY . denon
RUN deno install -qAfr --unstable denon/denon.ts
