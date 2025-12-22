import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SmoothScrollProvider } from "./components/SmoothScrollProvider";

// Render app
createRoot(document.getElementById("root")).render(
  <SmoothScrollProvider>
    <App />
  </SmoothScrollProvider>
);
