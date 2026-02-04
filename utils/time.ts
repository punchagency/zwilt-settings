import { format, parseISO } from 'date-fns';

export function formatTimestamp(timestamp: any) {
  const date = parseISO(timestamp);
  const formattedDate = format(date, "dd MMM, yyyy 'at' hh:mmaaa");
  return formattedDate;
} // Output: 21 Jun, 2024 at 10:43am