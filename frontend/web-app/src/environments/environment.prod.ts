export const environment = {
  production: true,
  apiUrl: '/api',
  authUrl: '/api/auth',
  keycloak: {
    url: '/keycloak',
    realm: 'pdi-platform',
    clientId: 'pdi-web-app'
  },
  gisUrl: '/api/gis',
  chatbotUrl: '/api/chatbot',
  minio: {
    endpoint: '',
    port: 9000,
    bucket: 'pdi-documents'
  }
};
