import { Typography } from "@mui/material";
import React from "react";

import { useStateQuery } from "../../state";

export interface PlayerTitleProps {}

export const PlayerTitle: React.FC<PlayerTitleProps> = ({}) => {
  const stateQuery = useStateQuery();

  const { player } = stateQuery.data ?? {};

  return (
    <Typography align="center" variant="h5">
      Hello, {player?.name ? player.name : "anonymous"} 👋
    </Typography>
  );
};
