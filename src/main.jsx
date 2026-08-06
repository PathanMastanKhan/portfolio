import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import "./index.css";

// Prevent the browser from restoring an old scroll position, and strip
// any leftover #stats / #contact hash from earlier bookmarked/shared
// links so every fresh visit reliably starts at the very top.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
if (window.location.hash) {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </React.StrictMode>
);
