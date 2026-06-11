import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "./frontend/components";
import App from "./frontend/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
