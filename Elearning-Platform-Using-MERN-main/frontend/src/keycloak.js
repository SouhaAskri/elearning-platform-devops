import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://192.168.209.161:8080/", // URL de votre serveur Keycloak
  realm: "elearning", // Nom de votre Realm
  clientId: "elearning-client", // ID du client dans Keycloak
});

export default keycloak;
