# PDI Platform - Docker Quick Start

## Credențiale Default

| Tip Utilizator | Email | Parolă | Rol |
|----------------|-------|--------|-----|
| **Admin** | admin@pdi.ro | Password123! | ADMIN |
| **Angajat** | ion.popescu@primarianucet.ro | Password123! | EMPLOYEE |
| **Contabil** | elena.stancu@primarianucet.ro | Password123! | ACCOUNTANT |
| **Urbanism** | maria.iliescu@primarianucet.ro | Password123! | URBANISM |
| **Agricultură** | george.dumitrescu@primarianucet.ro | Password123! | AGRICULTURE |
| **Cetățean** | default@citizen.ro | Password123! | CITIZEN |
| **Cetățean Demo** | vasile.ion@example.com | Password123! | CITIZEN |

## Pornire Rapidă

```bash
# Din directorul infrastructure/docker
cd pdi-platform/infrastructure/docker

# Pornește toate serviciile
docker-compose -f docker-compose.full.yml up -d

# Sau pentru dezvoltare (doar DB + Redis)
docker-compose up -d
```

## Servicii

| Serviciu | Port | URL |
|----------|------|-----|
| **Frontend Angular** | 4200 | http://localhost:4200 |
| **API Gateway** | 80 | http://localhost/api |
| **Auth Service** | 8081 | http://localhost:8081 |
| **PostgreSQL** | 5432 | jdbc:postgresql://localhost:5432/pdi |
| **Redis** | 6379 | localhost:6379 |

## Variabile de Mediu

Creează fișierul `.env`:

```env
PDI_DB_NAME=pdi
PDI_DB_USER=pdi_user
PDI_DB_PASSWORD=pdi_pass_2024
JWT_SECRET=pdi_jwt_secret_key_2024_very_long_and_secure
```

## Construire și Rulare Manuală

### Backend
```bash
cd pdi-platform/backend
docker build -f Dockerfile.services -t pdi-backend .
```

### Frontend
```bash
cd pdi-platform/frontend/web-app
docker build -t pdi-frontend .
```

## Note

- Toate parolele sunt hash-ate cu bcrypt
- Parola originală pentru toate conturile: `Password123!`
- DB se initializează automat cu scriptul din `database/init/01-init.sql`