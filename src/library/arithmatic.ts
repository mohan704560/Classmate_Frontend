export const CalculatePercentage = (
  mark: string | number,
  totalMark: string | number
): number => {
  return parseFloat(
    ((parseFloat(`${mark}`) / parseFloat(`${totalMark}`)) * 100).toFixed(2)
  );
};
