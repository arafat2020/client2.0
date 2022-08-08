import React from "react";
import { UserProvider } from "../state/stateprovider";
import "../styles/globals.css";
import Notify from "../components/Notify";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <UserProvider>
        <Component {...pageProps} />
        <Notify/>
      </UserProvider>
    </React.Fragment>
  );
}

export default MyApp;
