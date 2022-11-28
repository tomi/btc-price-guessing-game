import React from "react";
import * as playerApiClient from "../apiClients/playersApiClient";

const STORAGE_TOKEN_KEY = "TOKEN";

type AuthState = {
  accessToken: string | null;
};
type AuthContextState = [AuthState, React.Dispatch<React.SetStateAction<AuthState>>];

export const AuthContext = React.createContext<AuthContextState | null>(null);

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = React.useState({
    accessToken: loadAuthToken(),
  });

  const value = React.useMemo<AuthContextState>(() => [authState, setAuthState], [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const [authState, setAuthState] = context;

  const register = React.useCallback(async (playerName: string) => {
    const accessToken = await playerApiClient.register(playerName);

    persistAccessToken(accessToken);
    setAuthState({ accessToken });
  }, []);

  const logout = () => {
    removeAccessToken();
    setAuthState({
      accessToken: null,
    });
  };

  return {
    register,
    logout,
    isAuthenticated: !!authState.accessToken,
    accessToken: authState.accessToken,
  };
};

export const useSignedInAuth = () => {
  const { accessToken, logout } = useAuth();

  return {
    accessToken,
    logout,
  };
};

function persistAccessToken(token: string) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

function loadAuthToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

function removeAccessToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}
