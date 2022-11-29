import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

import { useAuth } from "../state";
import { Typography } from "@mui/material";

export interface RegisterPageProps {}

export const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
  const { register } = useAuth();
  const [name, setName] = React.useState("");

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onStart = () => {
    register(name);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          flex: 1,
        }}
        variant="h3"
        component="h1"
        align="center"
        mb={4}
      >
        Bitcoin price <br />
        guessing game
      </Typography>

      <Typography variant="h6" align="center">
        Rules:
      </Typography>
      <Typography align="center" mb={4}>
        <br /> Guess whether the price will go up or down after one minute.
        <br />
        If guessed right, you'll score one point. Otherwise you'll lose one point.
      </Typography>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <Typography align="center">Give a name to get started</Typography>

        <TextField id="playerName" label="Name" variant="outlined" onChange={onNameChange} />
        <Button variant="contained" disabled={!name} onClick={onStart}>
          Start
        </Button>
      </Box>
    </Container>
  );
};
