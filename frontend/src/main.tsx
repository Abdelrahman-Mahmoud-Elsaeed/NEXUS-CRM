import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "@app/App";
import { StoreProvider } from "./app/store/StoreProvider";
import { store } from "./app/store";
import { injectStore } from "@/lib/axios";

injectStore(store);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
);
