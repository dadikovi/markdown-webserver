FROM node:alpine
MAINTAINER Dávid Kovács "dadikovi@gmail.com"
 
ARG GIT_REPO_ARG=""
ARG GIT_URL_ARG=""
 
ENV SERVER_HOME="/opt/app"
ENV VERSION="1.1.0"
ENV GIT_REPO=$GIT_REPO_ARG
ENV GIT_URL=$GIT_URL_ARG
 
# Install the necessary softwares.
 
RUN apk add --update unzip
RUN apk add git
RUN apk add curl
RUN apk add openssh
 
# Create application directory.
 
RUN mkdir -p $SERVER_HOME
WORKDIR $SERVER_HOME
 
# Checkout GIT repository.
 
ADD id_rsa /root/.ssh/id_rsa
ADD known_hosts /root/.ssh/known_hosts
RUN chmod 700 /root/.ssh/id_rsa
RUN chown -R root:root /root/.ssh
RUN git clone $GIT_URL $SERVER_HOME/$GIT_REPO
 
# Download and build application source.
 
RUN curl -Lk -o markdown-webserver.zip https://github.com/dadikovi/markdown-webserver/archive/$VERSION.zip
RUN unzip markdown-webserver.zip -d $SERVER_HOME
 
WORKDIR $SERVER_HOME/markdown-webserver-$VERSION
RUN npm install
   
# Run app.
 
EXPOSE 80
CMD [ "sh", "-c", "node index.js -p ../${GIT_REPO}" ]