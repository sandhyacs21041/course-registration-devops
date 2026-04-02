# ---- Build Stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Run Stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
<<<<<<< HEAD
COPY --from=build /app/target/course-registration-1.0.0.jar app.jar
EXPOSE 8080
=======
COPY --from=build /app/target/*.jar app.jar
EXPOSE 9090
>>>>>>> f69bbc1253168534ba9dcff2f2c158e8927c2c5b
ENTRYPOINT ["java", "-jar", "app.jar"]
