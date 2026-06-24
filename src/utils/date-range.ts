export const generateHeaders = (start: string, end: string) => {
  //   let { startDate, endDate } = getDateRange();
  let startDate = new Date(start);
  let endDate = new Date(end);

  let headers = [];
  let day = startDate.getDate();
  for (let i = day; startDate <= endDate; i++) {
    headers.push(startDate.toDateString());
    startDate.setDate(startDate.getDate() + 1);
  }
  return headers;
};

interface Time {
  hours: number | string;
  minutes: number | string;
  seconds: number;
}

interface TimeEntry {
  time: Time;
  date: string;
}

export function sumTimeValuesByDay(inputArray: TimeEntry[]): number[] {
  const daysOfWeek: string[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  const result: number[] = [0, 0, 0, 0, 0, 0, 0];

  for (const item of inputArray) {
    const day: string = item?.date?.split(" ")[0];
    const timeInHours: number =
      Number(item?.time?.hours) +
      Number(item?.time?.minutes) / 60 +
      item?.time?.seconds / 3600;

    const dayIndex = daysOfWeek?.indexOf(day);
    if (dayIndex !== -1) {
      result[dayIndex] += timeInHours;
    }
  }

  // Keep the values in one decimal place
  for (let i = 0; i < result?.length; i++) {
    result[i] = parseFloat(result[i]?.toFixed(1));
  }

  return result;
}

export const removeTimeValue = (dateString: string) => {
  let start = "";
  let stringArray = dateString?.replace(",", "").split(" ");
  let hold = stringArray[2];
  stringArray[2] = stringArray[1];
  stringArray[1] = hold;
  stringArray.forEach((item, i) => (i < 4 ? (start += " " + item) : ""));
  return start.replace(",", "").replace(" ", "");
};
