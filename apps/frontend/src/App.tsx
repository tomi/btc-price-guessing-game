import React from "react";

import { useAuth } from "./state";
import { GamePage } from "./pages/GamePage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  const { isAuthenticated } = useAuth();

  return <div>{isAuthenticated ? <GamePage /> : <RegisterPage />}</div>;
}

export default App;
