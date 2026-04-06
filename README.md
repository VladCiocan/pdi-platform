# Platforma Digitală Integrată (PDI) - Comuna Nucet

## Prezentare Generală

Platforma Digitală Integrată (PDI) este un sistem informatic modern pentru digitalizarea serviciilor publice al Comunei Nucet, Județul Dâmbovița. Platforma este dezvoltată în cadrul Programului Regional Sud-Muntenia 2021-2027, Obiectivul Specific RSO 1.2.

## Arhitectura Sistemului

### Backend (Java/Kotlin)
- **Auth Service** (Kotlin) - Serviciu de autentificare și autorizare
- **Tax Service** (Java) - Gestionare taxe și impozite
- **Urbanism Service** (Java) - Certificate și autorizații de urbanism
- **Agriculture Service** (Java) - Registru agricol
- **Infrastructure Service** (Java) - Management infrastructură
- **DMS Service** (Java) - Management documente
- **ERP Suite** (Java) - Sistem integrat contabilitate bugetară
- **Chatbot AI** (Python) - Asistent virtual
- **GIS Service** (Java + PostGIS) - Sistem informație geografică

### Frontend
- **Angular 18** - Aplicație web PWA
- **Android (Kotlin)** - Aplicație mobilă pentru cartare
- **iOS (Swift)** - Aplicație mobilă pentru notificări

### Infrastructură
- **Docker/Kubernetes** - Containerizare
- **PostgreSQL 15 + PostGIS** - Bază de date spațială
- **Redis** - Cache și sesiuni
- **Kong** - API Gateway
- **Prometheus + Grafana** - Monitorizare
- **ELK Stack** - Logging centralizat

## Cerințe de Sistem

### Dezvoltare Locală
- Java 17
- Node.js 18+
- Docker Desktop
- Maven 3.9+
- PostgreSQL 15

### Producție
- Minim 32 GB RAM
- SSD pentru stocare rapidă
- Kubernetes cluster

## Setup Dezvoltare

### 1. Clonare și Configurare

```bash
# Clone repository
git clone https://github.com/your-org/pdi-platform.git
cd pdi-platform
```

### 2. Configurare Variabile de Mediu

Creați un fișier `.env` în rădăcina proiectului:

```env
# Database
PDI_DB_NAME=pdi
PDI_DB_USER=pdi_user
PDI_DB_PASSWORD=your_secure_password
PDI_DB_HOST=localhost
PDI_DB_PORT=5432

# Redis
PDI_REDIS_HOST=localhost
PDI_REDIS_PORT=6379
PDI_REDIS_PASSWORD=

# JWT
PDI_JWT_SECRET=your_secure_jwt_secret_min_32_chars

# CORS
PDI_CORS_ORIGINS=http://localhost:4200,http://localhost:8080
```

### 3. Pornire Servicii Docker

```bash
cd infrastructure/docker
docker-compose up -d
```

Aceasta va porni:
- PostgreSQL cu PostGIS
- Redis
- Kong API Gateway
- Prometheus
- Grafana
- Elasticsearch + Kibana

### 4. Build Backend

```bash
cd backend

# Build toate modulele
mvn clean install

# Sau porni un serviciu specific
cd auth-service
mvn spring-boot:run
```

### 5. Build Frontend

```bash
cd frontend/web-app

# Instalează dependențele
npm install

# Pornește în mod development
npm start
```

Aplicația va fi disponibilă la `http://localhost:4200`

### 6. Credentiale Default

După prima pornire, utilizați:

- **Email:** admin@pdi.ro
- **Parolă:** admin123

⚠️ **Schimbați parola în producție!**

## Structura Proiectului

```
pdi-platform/
├── backend/
│   ├── common/              # Module comune
│   │   ├── common-model/
│   │   ├── common-security/
│   │   ├── common-exception/
│   │   └── common-utils/
│   ├── gateway/            # Kong API Gateway
│   ├── auth-service/       # Autentificare
│   ├── tax-service/        # Taxe și impozite
│   ├── urbanism-service/   # Urbanism
│   ├── agriculture-service/# Agricultură
│   ├── infrastructure-service/
│   ├── dms-service/        # Documente
│   ├── erp-suite/          # Contabilitate
│   ├── gis-service/        # GIS
│   └── chatbot-ai/         # Chatbot
├── frontend/
│   ├── web-app/           # Angular PWA
│   ├── android/           # Android app
│   └── ios/               # iOS app
├── infrastructure/
│   ├── docker/            # Docker configs
│   ├── kubernetes/        # K8s manifests
│   └── monitoring/        # Prometheus, Grafana
├── scripts/
│   └── database/          # DB migrations
└── documentation/
```

## API-uri Disponibile

După pornire, documentația API este disponibilă:

- Auth Service: http://localhost:8081/swagger-ui.html
- Tax Service: http://localhost:8082/swagger-ui.html
- API Gateway: http://localhost:8000

## Comenzi Utile

```bash
# Rulare teste
mvn test

# Rulare cu profil specific
mvn -Pdev spring-boot:run

# Build Docker imagini
docker build -t pdi-auth-service:latest ./backend/auth-service

# Logs
docker-compose logs -f postgres
```

## Deploy Producție

Consultați documentația de deployment pentru instrucțiuni complete de producție.

## Contribuitori

- PDI Development Team

## Licență

Proprietate Comuna Nucet - Toate drepturile rezervate