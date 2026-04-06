export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  authUrl: 'http://localhost:8000/api/v1/auth',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'pdi-platform',
    clientId: 'pdi-web-app'
  },
  gisUrl: 'http://localhost:8000/geoserver',
  chatbotUrl: 'http://localhost:8000/api/v1/chatbot',
  minio: {
    endpoint: 'localhost',
    port: 9000,
    bucket: 'pdi-documents'
  }
};