import React from "react";
import { createRoot } from "react-dom/client";
import OxyONEDemo from "./OxyONEDemo";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <React.StrictMode>
    <OxyONEDemo />
  </React.StrictMode>
);
