import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { addDays } from "date-fns";
import { Box, styled } from "@mui/material";

const DatePicker: React.FC = () => {
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
        // onChange={item => setState(item)}
        // showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction='horizontal'
      />
    </DateWrapper>
  );
};

export default DatePicker;

const DateWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%", // Set the width to cover the entire parent container
  position: "relative", // Change 'absolute' to 'relative',
  zIndex: 999,
}));
