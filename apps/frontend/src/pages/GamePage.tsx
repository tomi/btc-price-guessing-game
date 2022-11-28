import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { PriceCard } from "../components/PriceCard";
import { ScoreCard } from "../components/ScoreCard";
import { GuessButtons } from "../components/GuessButtons";
import { PlayerTitle } from "../components/PlayerTitle";

export interface GamePageProps {}

export const GamePage: React.FC<GamePageProps> = ({}) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PlayerTitle />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ScoreCard />
          </Grid>

          <Grid item xs={12} sm={6}>
            <PriceCard />
          </Grid>

          <Grid item xs={12}>
            <GuessButtons />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
