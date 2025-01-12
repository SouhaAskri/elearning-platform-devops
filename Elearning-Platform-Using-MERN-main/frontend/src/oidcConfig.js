export const oidcConfig = {
    authority: "http://192.168.209.161:8080/admin/master/console/#/elearning", // URL de votre serveur Keycloak
    client_id: "elearning-client",
    redirect_uri: "http://localhost:3000",
    response_type: "code", // ou "token id_token" pour le flux implicite
    scope: "openid profile email", // Scopes nécessaires
  };
  