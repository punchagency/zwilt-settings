export const calculatePxToPercentage = (size: number) => {
  const actualVal = (size / 1920) * 100;
  return `${actualVal}vw`;
};
