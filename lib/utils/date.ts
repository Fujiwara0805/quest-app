export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

export function formatDate(date: Date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = days[date.getDay()];
  return {
    day: date.getDate(),
    weekday,
    isToday: isSameDay(date, new Date()),
    isSaturday: date.getDay() === 6,
    isSunday: date.getDay() === 0
  };
}

export function getDaysUntilEndOfMarch(): number {
  const today = new Date();
  const endOfMarch = new Date(today.getFullYear(), 2, 31);
  
  if (today > endOfMarch) {
    endOfMarch.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = endOfMarch.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}