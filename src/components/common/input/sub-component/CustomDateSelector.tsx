import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { addDays } from "date-fns";
import { Box, Button, Popover, styled } from "@mui/material";

const CustomDateSelector: React.FC = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  return (
    <DateWrapper>
      {/* @ts-ignore */}
      <DateRangePicker
        onChange={(item) => console.log("The selection:::: ", item)}
        // showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction='horizontal'
      />
    </DateWrapper>
  );
};

export default CustomDateSelector;

const DateWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  zIndex: 999,
}));