export interface ICustomSpacing {
    px: (...val: number[]) => string;
    rem: (...val: number[]) => string;
}

export const getSpacingInPxRem = (factor: number[], unit: string): string => {
    return factor.reduce((sum, cur) => {
        const multiplier = unit === 'px' ? 10 : 0.625;
        const increment = `${multiplier * cur}${unit}`;
        return sum ? `${sum} ${increment}` : increment;
    }, '');
};

const customSpacing: ICustomSpacing = {
    px: (...args: number[]) => getSpacingInPxRem(args, 'px'),
    rem: (...args: number[]) => getSpacingInPxRem(args, 'rem'),
};

export default customSpacing;
