# --- Stage 1: The "Builder" Stage-----
# We start with a base image that has Java and Maven installed
# This stage is like a temporary "workshop" to build our application.
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set the working directory inside the container
WORKDIR /app


# Copy the Maven project definition files
COPY pom.xml .

# Copy the entire source code
COPY src ./src


# Run the Maven command to build the application and create the .jar file.
# We use -DskipTests to Speed up the build process for Docker.
RUN mvn clean package -DskipTests


# --- Stage 2: The "Final" stage ---
# Now we start fresh with a much smaller, more secure base image.
# This image ONLY has the Java Runtime Environment, not the full development kit.
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the .jar file that we created in the "builder" stage into our final lunchbox.
# We give it a simple name, app.jar.

COPY --from=builder /app/target/*.jar app.jar

# This tells Docker what command to run when the container starts.
# It's the same command you would use to run the app from your terminal.
ENTRYPOINT ["java","-jar","app.jar"]
