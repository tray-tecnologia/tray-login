FROM node:10.15.1-alpine

# Install "libraries", "Software's"
RUN apk update && \
    apk add --no-cache bash \
    git \
    curl \
    vim \
    nano

# Set default work directory
WORKDIR /var/www

RUN yarn

EXPOSE 8080
