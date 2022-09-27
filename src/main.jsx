import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProfileProvider } from "./contexts/profileContext";
import { SessionProvider } from "./contexts/sessionContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { PromosProvider } from "./contexts/promosContext";
import { FlavorsProvider } from "./contexts/flavorsContext";
import { NicotineProvider } from "./contexts/nicotineContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <ProfileProvider>
          <PromosProvider>
            <FlavorsProvider>
              <NicotineProvider>
                <App />
              </NicotineProvider>
            </FlavorsProvider>
          </PromosProvider>
        </ProfileProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
