import React from "react";
import "./App.css";
import * as Keycloak from "keycloak-js";
const axios = require("axios");
//keycloak init options

let initOptions = {
  url: "http://172.19.100.120:8080/auth",
  realm: "IFM",
  clientId: "front",
  onLoad: "login-required",
};

let keycloak = Keycloak(initOptions);

keycloak
  .init({ onLoad: initOptions.onLoad })
  .success((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      console.info("Authenticated");
    }

    setTimeout(() => {
      keycloak
        .updateToken(70)
        .success((refreshed) => {
          if (refreshed) {
            console.debug("Token refreshed" + refreshed);
          } else {
            console.warn(
              "Token not refreshed, valid for " +
                Math.round(
                  keycloak.tokenParsed.exp +
                    keycloak.timeSkew -
                    new Date().getTime() / 1000
                ) +
                " seconds"
            );
          }
        })
        .error(() => {
          console.error("Failed to refresh token");
        });
    }, 60000);
  })
  .error(() => {
    console.error("Authenticated Failed");
  });

function Auth() {
  async function getToken(method, facilityid) {
    //let token = await localStorage.getItem("react-token");
    let token = keycloak.token;
    console.log(token);
    if (facilityid) {
      const res = await axios.get(
        "http://localhost:3001/facility/" + facilityid,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert(JSON.stringify(res));
    } else {
      if (method == "get") {
        const res = await axios.get("http://localhost:3001/facility/", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        alert(JSON.stringify(res));
      } else if (method == "post") {
       
        const config = {
          headers: { Authorization: "Bearer " + token },
        };

        const dto = {
          facility_name: "string",
          brand_name: "string",
          type_of_facility: "string",
          classification_of_facility: "string",
          label: ["string"],
          country: "string",
          city: "string",
          address: "string",
        };

        axios
          .post("http://localhost:3001/facility/", dto, config)
          .then(console.log)
          .catch(console.log);
      }
    }
  }
  async function logout() {
    console.log("çıkış yapıldı");
    await keycloak.logout();
    await window.location.reload();
  }
  return (
    <div className="App">
      <button
        style={{ height: 30, width: 100 }}
        onClick={() => {
          getToken("get", null);
        }}
      >
        All Facilities
      </button>
      <button
        style={{ height: 30, width: 100 }}
        onClick={() => {
          getToken("get", "62189993b023539b3e96ef59");
        }}
      >
        Get Facility
      </button>
      <button
        style={{ height: 30, width: 100 }}
        onClick={() => {
          getToken("post", null);
        }}
      >
        Create facility
      </button>
      <br></br>
      <br></br>
      <button
        style={{ height: 30, width: 100 }}
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
export default Auth;
