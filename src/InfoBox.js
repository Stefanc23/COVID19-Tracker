import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import "./InfoBox.css";

function InfoBox({ title, cases, active, total, ...props }) {
  const prettyPrintStat = stat =>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${title}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infoBox__cases">{prettyPrintStat(cases)}</h2>
        <Typography className="infoBox__total" color="textSecondary">
          {numeral(total).format()} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
