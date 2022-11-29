import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { useFlashOnChange } from "../../hooks/useColorChange";
import { useStateQuery } from "../../state";

export interface ScoreCardProps {}

export const ScoreCard: React.FC<ScoreCardProps> = ({}) => {
  const stateQuery = useStateQuery();
  const { player } = stateQuery.data ?? {};
  const score = player?.score ?? 0;
  const colorStyle = useFlashOnChange(score);

  return (
    <Card>
      <CardContent
        sx={{
          minHeight: 128,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Score
        </Typography>

        <Typography
          variant="h4"
          component="div"
          mt={2}
          style={colorStyle}
          data-testid="player-score"
        >
          {score}
        </Typography>
      </CardContent>
    </Card>
  );
};
