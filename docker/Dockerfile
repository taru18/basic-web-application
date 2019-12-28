FROM ubuntu:18.04

RUN set -xe \
    && apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y apt-utils \
    && apt-get install -y git curl grep sed unzip bzip2 bash git ssh \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && git --version && bash --version && ssh -V && npm -v && node -v

# Set timezone
ENV TZ=Europe/Helsinki
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

#Set locale
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i fi_FI -c -f UTF-8 -A /usr/share/locale/locale.alias fi_FI.UTF-8 \
    && apt-get clean
ENV LANG fi_FI.utf8

# Create app directory
WORKDIR /usr/src/tema

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Default to production environment
# Set this to development during build time if you want to use the image in development
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "nodemon" ]
