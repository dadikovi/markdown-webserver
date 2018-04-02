FROM node:alpine
MAINTAINER Dávid Kovács "dadikovi@gmail.com"
 
ENV SERVER_HOME="/opt/app"
ENV VERSION="1.2.0"
ENV GIT_CLONE_URL=""
ENV APP_NAME=""
 
# Install the necessary softwares.
 
RUN apk add --update unzip
RUN apk add git
RUN apk add curl
RUN apk add openssh
 
# Create application directory.
 
RUN mkdir -p $SERVER_HOME
WORKDIR $SERVER_HOME
 
# Download and build application source.
 
RUN curl -Lk -o markdown-webserver.zip https://github.com/dadikovi/markdown-webserver/archive/$VERSION.zip
RUN unzip markdown-webserver.zip -d $SERVER_HOME
 
WORKDIR $SERVER_HOME/markdown-webserver-$VERSION
RUN npm install
 
# Add starter script
ADD run.sh $SERVER_HOME/markdown-webserver-$VERSION/run.sh
RUN chmod 700 $SERVER_HOME/markdown-webserver-$VERSION/run.sh
   
# Run app.
 
EXPOSE 80
CMD [ "./run.sh" ]
 
#Example execution:
# docker run -P -e "GIT_CLONE_URL=http://<user>:<password>@<url>:80/<repo name>" -e "APP_NAME=<reponame>" markdown-webserver