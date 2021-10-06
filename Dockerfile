FROM openjdk:8
ADD target/music-entries-web.jar music-entries-web.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","music-entries-web.jar"]