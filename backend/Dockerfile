# Backend Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy parent POM and install to local repo
COPY pom.xml .
RUN mvn install -N -B -DskipTests -Dspring-boot.repackage.skip=true

# Copy common module POMs and install
COPY common/common-model/pom.xml common/common-model/
COPY common/common-security/pom.xml common/common-security/
COPY common/common-exception/pom.xml common/common-exception/
COPY common/common-utils/pom.xml common/common-utils/

WORKDIR /app/common/common-model
RUN mvn install -N -B -DskipTests -Dspring-boot.repackage.skip=true

WORKDIR /app/common/common-security  
RUN mvn install -N -B -DskipTests -Dspring-boot.repackage.skip=true

WORKDIR /app/common/common-exception
RUN mvn install -N -B -DskipTests -Dspring-boot.repackage.skip=true

WORKDIR /app/common/common-utils
RUN mvn install -N -B -DskipTests -Dspring-boot.repackage.skip=true

# Copy service POMs
WORKDIR /app
COPY auth-service/pom.xml auth-service/
COPY tax-service/pom.xml tax-service/
COPY urbanism-service/pom.xml urbanism-service/
COPY agriculture-service/pom.xml agriculture-service/
COPY infrastructure-service/pom.xml infrastructure-service/
COPY erp-service/pom.xml erp-service/
COPY dms-service/pom.xml dms-service/
COPY gis-service/pom.xml gis-service/
COPY project-service/pom.xml project-service/

# Download dependencies
RUN mvn dependency:go-offline -B -pl auth-service,tax-service,urbanism-service,agriculture-service,infrastructure-service,erp-service,dms-service,gis-service,project-service -am || true

# Copy source code
COPY common common
COPY auth-service/src auth-service/src
COPY tax-service/src tax-service/src
COPY urbanism-service/src urbanism-service/src
COPY agriculture-service/src agriculture-service/src
COPY infrastructure-service/src infrastructure-service/src
COPY erp-service/src erp-service/src
COPY dms-service/src dms-service/src
COPY gis-service/src gis-service/src
COPY project-service/src project-service/src

# Build all services (will fail on some if dependencies missing, but build what we can)
RUN mvn package -DskipTests -B -pl auth-service,tax-service,urbanism-service,agriculture-service -am || mvn package -DskipTests -B -pl auth-service -am

# Runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy auth service jar (main entry point)
COPY --from=builder /app/auth-service/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]