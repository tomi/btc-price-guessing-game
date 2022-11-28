import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { useFlashOnChange } from "../../hooks/useColorChange";
import { useStateQuery } from "../../state";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "medium",
  hour12: false,
});

export interface PriceCardProps {}

export const PriceCard: React.FC<PriceCardProps> = ({}) => {
  const stateQuery = useStateQuery();

  const { price } = stateQuery.data ?? {};
  const priceValue = price?.value;
  const colorStyle = useFlashOnChange(priceValue ?? 0);

  return (
    <Card>
      <CardContent
        sx={{
          minHeight: 100,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Price
        </Typography>

        <Typography variant="h4" component="div" mt={2} style={colorStyle}>
          {priceValue ? currencyFormatter.format(priceValue) : ""}
        </Typography>

        <Typography variant="subtitle2" mt={1}>
          {price ? `Updated ${timeFormatter.format(new Date(price.updatedAt))}` : ""}
        </Typography>
      </CardContent>
    </Card>
  );
};
