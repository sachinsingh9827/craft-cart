import React from "react";
import { createRoot } from "react-dom/client"; // ✅ New import for React 18
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // optional if you use one

const container = document.getElementById("root");
const root = createRoot(container); // ✅ createRoot for React 18

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
