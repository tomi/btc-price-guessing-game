import React from "react";
import * as playerApiClient from "../apiClients/playersApiClient";
import { useErrors } from "./useErrors";

const STORAGE_TOKEN_KEY = "TOKEN";

type AuthState = {
  accessToken: string | null;
  isLoading: boolean;
};
type AuthContextState = [AuthState, React.Dispatch<React.SetStateAction<AuthState>>];

export const AuthContext = React.createContext<AuthContextState | null>(null);

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>({
    accessToken: loadAuthToken(),
    isLoading: false,
  });

  const value = React.useMemo<AuthContextState>(() => [authState, setAuthState], [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { setError: addError } = useErrors();
  const [authState, setAuthState] = context;

  const register = React.useCallback(async (playerName: string) => {
    try {
      setAuthState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      const accessToken = await playerApiClient.register(playerName);

      persistAccessToken(accessToken);
      setAuthState((prevState) => ({ ...prevState, accessToken }));
    } catch (err) {
      const error = err as Error;
      addError(`Registration failed: ${error.message}`);
    } finally {
      setAuthState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, []);

  const logout = () => {
    removeAccessToken();
    setAuthState((prevState) => ({
      ...prevState,
      accessToken: null,
      isLoading: false,
    }));
  };

  return {
    register,
    logout,
    isAuthenticated: !!authState.accessToken,
    ...authState,
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
