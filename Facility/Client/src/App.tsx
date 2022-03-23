import React from "react";
import keycloak from "./keycloak";
import { useAppDispatch } from "./app/hook";
import { login } from "./features/auth/authSlice";
import axios from "axios";
// routes
import Router from "./routes";
//components
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useAppDispatch();
  keycloak
    .init({ onLoad: "login-required" })
    .success((auth) => {
      if (!auth) {
        window.location.reload();
      } else {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + keycloak.token;
        console.log(keycloak.token)
        if (keycloak.token !== undefined) {
          dispatch(
            login({
              id: "123",
              type: "admin",
              name: keycloak.tokenParsed
                ? keycloak.tokenParsed.given_name
                : "No Name",
              token: keycloak.token ? keycloak.token : "",
            })
          );
        }
      }

      // setTimeout(() => {
      //   keycloak
      //     .updateToken(70)
      //     .success((refreshed) => {
      //       if (refreshed) {
      //         console.debug("Token refreshed" + refreshed);
      //       } else {
      //         console.warn(
      //           "Token not refreshed, valid for " +
      //             Math.round(
      //               keycloak.tokenParsed.exp +
      //                 keycloak.timeSkew -
      //                 new Date().getTime() / 1000
      //             ) +
      //             " seconds"
      //         );
      //       }
      //     })
      //     .error(() => {
      //       console.error("Failed to refresh token");
      //     });
      // }, 60000);
    })
    .error(() => {
      console.error("Authenticated Failed");
    });
  return (
    <>
      <ScrollToTop />
      <Router />
    </>
  );
}

export default App;
