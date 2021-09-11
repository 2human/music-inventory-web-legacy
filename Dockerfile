From openjdk:8
copy ./target/music-entries-web.jar music-entries-web.jar
CMD ["java","-jar","music-entries-web.jar"]