import React, { useEffect, useState } from "react";
import Keycloak from "keycloak-js"; // Assurez-vous que Keycloak est importé correctement
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginFetch } from "../Redux/UserReducer/action";
import { Button, Spinner, Heading } from "@chakra-ui/react";

const Login = () => {
  const [keycloak, setKeycloak] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.UserReducer);

  // Initialisation de Keycloak
  useEffect(() => {
    const client = new Keycloak({
      url: "http://192.168.209.161:8080/auth", // URL mise à jour
      realm: "elearning",
      clientId: "elearning-client",
    });

    client.init({ onLoad: "login-required" }).then((authenticated) => {
      if (authenticated) {
        setKeycloak(client); // Si l'utilisateur est authentifié, on stocke le client Keycloak
        console.log("Keycloak Authenticated!");
      } else {
        // Si l'utilisateur n'est pas authentifié, on redirige vers Keycloak
        client.login();
      }
    }).catch((error) => {
      console.error("Keycloak initialization failed", error);
    });
  }, []);

  // Gestion de la redirection après connexion
  useEffect(() => {
    if (userStore.isAuth) {
      if (userStore?.role === "user") {
        navigate("/home");
      } else if (userStore?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userStore?.role === "teacher") {
        navigate("/TeacherDashboard");
      }
    }
  }, [userStore?.isAuth, userStore?.role, navigate]);

  // Fonction de connexion au backend après que Keycloak a authentifié l'utilisateur
  const handleLogin = () => {
    if (keycloak) {
      const token = keycloak.token; // Vous récupérez le token de l'utilisateur
      dispatch(loginFetch({ token })).then((res) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.message) {
          console.log("Login successful");
        } else {
          console.error(userStore?.isError);
        }
      });
    }
  };

  return (
    <div>
      <Heading>Login</Heading>
      {/* Affichage de l'état de la connexion */}
      {keycloak ? (
        <Button onClick={handleLogin}>
          {userStore.loading ? <Spinner color="white" /> : "Login"}
        </Button>
      ) : (
        <Spinner color="blue" />
      )}
    </div>
  );
};

export default Login;
