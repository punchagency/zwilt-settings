function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export const convertSeconds = (seconds: number) => {
  // console.log(seconds, "seconds conversion init val");
  // let seconds = Math.floor(seconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    Number(seconds.toFixed(2))
  )}`;
};

export const convertToHoursAndMins = (seconds: number) => {
  let hrs = seconds / 3600;
  let remainder = hrs - Math.floor(hrs);
  let mins = remainder * 60;
  // mins = mins - Math.floor(mins);
  console.log(seconds, hrs, remainder, remainder * 60, "time conversion");
  return padTo2Digits(Math.floor(hrs)) + ":" + padTo2Digits(Math.floor(mins));
};
// console.log(convertToHoursAndMins(5400), "time conversion");

export const convertTimeToSeconds = (
  hrs: number,
  mins: number,
  secs: number
) => {
  let seconds = secs;
  seconds += mins * 60;
  seconds += hrs * 60 * 60;
  return seconds;
};

export const getBeginningOfDay = (date?: any) => {
  if (date) {
    return new Date(new Date(date).setUTCHours(0, 0, 0, 0)).toUTCString();
  }
  return new Date(new Date().setUTCHours(0, 0, 0, 0)).toUTCString();
};
