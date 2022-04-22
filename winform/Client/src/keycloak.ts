import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'http://172.19.100.120:8080/auth',
  realm: 'IFM',
  clientId: 'front',
});

// let initOptions = {
//   url: "http://172.19.100.120:8080/auth",
//   realm: "IFM",
//   clientId: "front",
//   onLoad: "login-required",
// };

export default keycloak;
