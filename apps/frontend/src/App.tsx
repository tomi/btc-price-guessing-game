import React from "react";

import { useAuth } from "./state";
import { GamePage } from "./pages/GamePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ErrorList } from "./components/ErrorList";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? <GamePage /> : <RegisterPage />}
      <ErrorList />
    </div>
  );
}

export default App;
