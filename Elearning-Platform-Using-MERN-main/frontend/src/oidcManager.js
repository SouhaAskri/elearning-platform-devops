import { UserManager } from "@authts/oidc-client";
import { oidcConfig } from "./oidcConfig";

const userManager = new UserManager(oidcConfig);

export const login = async () => {
  try {
    await userManager.signinRedirect(); // Redirige l'utilisateur vers Keycloak
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const logout = async () => {
  try {
    await userManager.signoutRedirect(); // Déconnecte l'utilisateur
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    return await userManager.getUser(); // Récupère les informations de l'utilisateur
  } catch (error) {
    console.error("Error getting user:", error);
  }
};
