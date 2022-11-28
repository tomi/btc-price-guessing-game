import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Direction } from "../../apiClients/guessesApiClient";
import { useMakeGuessMutation, useStateQuery } from "../../state";

export interface GuessButtonsProps {}

export const GuessButtons: React.FC<GuessButtonsProps> = ({}) => {
  const stateQuery = useStateQuery();
  const makeGuessMutation = useMakeGuessMutation();
  const [secondsSinceGuessed, setSecondsSinceGuessed] = React.useState(0);

  const { activeGuess } = stateQuery.data ?? {};
  const hasActiveGuess = !!activeGuess;
  const buttonsDisabled = hasActiveGuess || makeGuessMutation.isLoading;

  const onGuessDown = () => {
    makeGuessMutation.mutateAsync(Direction.Down);
  };
  const onGuessUp = () => {
    makeGuessMutation.mutateAsync(Direction.Up);
  };

  React.useEffect(() => {
    if (!activeGuess) return;

    const updateTimer = () => {
      const now = Date.now();
      const guessMade = new Date(activeGuess.createdAt).getTime();
      const elapsedSeconds = Math.floor((now - guessMade) / 1000);
      setSecondsSinceGuessed(elapsedSeconds);
    };

    const timerId = setInterval(updateTimer, 1000);

    return () => {
      setSecondsSinceGuessed(0);
      clearInterval(timerId);
    };
  }, [activeGuess, setSecondsSinceGuessed]);

  return (
    <Box sx={{}}>
      <Typography mb={2} align="center">
        {hasActiveGuess ? (
          <>
            You guessed that the price goes {activeGuess.direction}.<br />
            Fingers crossed 🤞 <br />
            {secondsSinceGuessed} s elapsed since the guess
          </>
        ) : (
          <>
            Is the price going up or down?
            <br />
            Make a guess!
          </>
        )}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{
            width: 120,
            marginRight: 2,
          }}
          variant="contained"
          color="error"
          disabled={buttonsDisabled}
          onClick={onGuessDown}
        >
          Down
        </Button>

        <Button
          sx={{
            width: 120,
          }}
          variant="contained"
          color="success"
          disabled={buttonsDisabled}
          onClick={onGuessUp}
        >
          Up
        </Button>
      </Box>
    </Box>
  );
};
