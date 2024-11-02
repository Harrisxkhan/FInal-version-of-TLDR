import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./main.css";

import { router } from "./Routes/router.jsx";
import { GlobalProvider } from "./Providers/GlobalProvider.jsx";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>
);
