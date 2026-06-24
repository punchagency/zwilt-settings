export const hourFormatter = (h: any) => {
  if (h === 0) return "12:00AM";
  if (h < 12) return `${h}:00AM`;
  if (h === 12) return `${h}:00PM`;
  if (h > 12) return `${h - 12}:00PM`;
};

export function doubleDigit(digit: number) {
  if (!digit) return '00'
  return digit < 10 ? `0${digit}` : digit;
}

export function displayTime(totalSeconds: number, format?: "digit" | "string") {
  if (!totalSeconds) {
    return format === "digit" ? `00:00:00` : `0h 0min`;
  }

  const totalHrs = Math.floor(totalSeconds / 3600); // Calculate full hours
  const totalMins = Math.floor((totalSeconds % 3600) / 60); // Calculate remaining minutes
  const totalSecs = totalSeconds % 60; // Calculate remaining seconds

  return format && format === "digit"
    ? `${doubleDigit(totalHrs)}:${doubleDigit(totalMins)}:${doubleDigit(
      totalSecs
    )}`
    : `${totalHrs}h ${totalMins}min`;
}

export function formatTime(seconds: number) {
  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Construct the formatted string with proper pluralization
  const hoursStr = hours === 1 ? `${hours} hour` : `${hours} hours`;
  const minutesStr = minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
  const secondsStr =
    remainingSeconds === 1
      ? `${remainingSeconds} second`
      : `${remainingSeconds} seconds`;

  // Handle different cases: no hours, no minutes, or all units present
  if (hours === 0 && minutes === 0) {
    return secondsStr;
  } else if (hours === 0) {
    return `${minutesStr} and ${secondsStr}`;
  } else if (minutes === 0) {
    return `${hoursStr} and ${secondsStr}`;
  } else {
    return `${hoursStr}, ${minutesStr}, and ${secondsStr}`;
  }
}

export default function colorRender(avgProductivity: any) {
  return avgProductivity > 69.9
    ? "#BFE2B1"
    : avgProductivity > 33.3 && avgProductivity < 70
    ? "#F9D77A"
    : "#F79A7C";
}

export const starttime = (a: any, timezone: any): any => {
  if (!a) return 'No value'
  const h = a[0]?.hour + timezone;
  const mL = a[0]?.minutes?.length;
  let time;
  const min = mL ? a[0]?.minutes?.[0]?.minute * 10 : `${0}0`;
  if (h > 12) {
    time = `${h - 12}:${min}pm`;
  } else if (h == 12) {
    time = `${h}:${min}pm`;
  } else if (h >= 0 && h < 12) {
    time = `${h}:${min}am`;
  } else if (h < 0) {
    time = `time not available on the current date`;
  } else {
    time = `No value`;
  }
  return time;
};

export const endtime = (a: any, timezone: any): any => {
  if (!a) return 'No value'
  const lasth = a?.length - 1;
  const j = a[lasth];
  const h = j?.hour + timezone;
  const mL = j?.minutes?.length;
  let time;
  const min = j?.minutes[mL - 1]?.minute * 10;
  if (h > 12) {
    time = `${h - 12}:${min}pm`;
  } else if (h == 12) {
    time = `${h}:${min}pm`;
  } else if (h >= 0 && h < 12) {
    time = `${h}:${min}am`;
  } else if (h < 0) {
    time = `time not available on the current date`;
  } else {
    time = `No value`;
  }
  return time;
};

export function removeDuplicates(arr: string[]) {
  return arr.filter(
    (item: string, index: number) => arr.indexOf(item) === index
  );
}
