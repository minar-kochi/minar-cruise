export function filterDatesArrayToFormattedDateString<T>(dayArr: T[]) {
  const FilteredDays = dayArr.filter(
    (date, index, self) => self.indexOf(date) === index,
  );
  return FilteredDays
}
