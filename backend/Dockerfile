
# Stage 1: Build Spring Boot bằng Gradle
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' ./gradlew
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Chạy ứng dụng
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/build/libs/Backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
