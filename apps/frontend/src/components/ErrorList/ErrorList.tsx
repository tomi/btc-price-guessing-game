import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import React from "react";
import { useErrors } from "../../state";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface ErrorListProps {}

export const ErrorList: React.FC<ErrorListProps> = ({}) => {
  const { activeError, clearError } = useErrors();

  if (!activeError) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={clearError}
      TransitionProps={{ onExited: clearError }}
    >
      <Alert key={activeError.id} severity="error" onClose={clearError}>
        {activeError.message}
      </Alert>
    </Snackbar>
  );
};
