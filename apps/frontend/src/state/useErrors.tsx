import React from "react";
import { generateId } from "./common";

export interface ErrorItem {
  id: string;
  message: string;
}

type ErrorsState = {
  activeError: ErrorItem | null;
};
type ErrorsContextState = [ErrorsState, React.Dispatch<React.SetStateAction<ErrorsState>>];

export const ErrorsContext = React.createContext<ErrorsContextState | null>(null);

export interface ErrorsProviderProps {
  children?: React.ReactNode;
}

export const ErrorsProvider: React.FC<ErrorsProviderProps> = ({ children }) => {
  const [errorsState, setErrorsState] = React.useState<ErrorsState>({
    activeError: null,
  });

  const value = React.useMemo<ErrorsContextState>(
    () => [errorsState, setErrorsState],
    [errorsState],
  );

  return <ErrorsContext.Provider value={value}>{children}</ErrorsContext.Provider>;
};

export const useErrors = () => {
  const context = React.useContext(ErrorsContext);
  if (!context) {
    throw new Error("useAuth must be used within ErrorsProvider");
  }

  const [errorsState, setErrorsState] = context;

  const setError = React.useCallback(
    (message: string) => {
      const error: ErrorItem = {
        id: generateId(),
        message,
      };

      setErrorsState((prevState) => ({
        ...prevState,
        activeError: error,
      }));
    },
    [setErrorsState],
  );

  const clearError = React.useCallback(() => {
    setErrorsState((prevState) => ({
      ...prevState,
      activeError: null,
    }));
  }, [setErrorsState]);

  return {
    setError,
    clearError,
    ...errorsState,
  };
};
