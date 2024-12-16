export const convertISODurationToMinutes = (isoDuration?: string | number): number => {
  if (!isoDuration) return 0;
  if (typeof isoDuration === 'number') return isoDuration;
  const hoursMatch = isoDuration.match(/(\d+)H/);
  const minutesMatch = isoDuration.match(/(\d+)M/);
  
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  
  return (hours * 60) + minutes;
};



export function formatDuration(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes === 0) return '0 minutes';
  
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);
  
  if (hours === 0) return `${remainingMinutes} minutes`;
  if (remainingMinutes === 0) return `${hours} hours`;
  return `${hours} hours ${remainingMinutes} minutes`;
}