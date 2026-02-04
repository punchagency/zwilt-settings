export function calculatePxToPercentage(
    size: number): any {
    const actualVal = (size / 1920) * 100;
    return `${actualVal}vw`;
}
