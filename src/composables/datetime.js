import { ref } from 'vue';

export const formattedTime = ref('');
export const currentDayOfWeek = ref('');
export const currentDayOfMonth = ref('');
export const currentMonth = ref('');

export function setCurrentTime() {
  const currentDate = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const currentMonthIndex = currentDate.getMonth();
  const currentMonthName = monthNames[currentMonthIndex];
  const currentDayIndex = currentDate.getDay();
  const currentDayOfWeekName = dayNames[currentDayIndex];
  const currentDay = currentDate.getDate();
//   const currentYear = currentDate.getFullYear();
  const hours = currentDate.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2 });
  const minutes = currentDate.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2 });
  const seconds = currentDate.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2 });

  formattedTime.value = `${hours}:${minutes}:${seconds}`;
  currentDayOfWeek.value = `${currentDayOfWeekName}`;
  currentDayOfMonth.value = `${currentDay}`;
  currentMonth.value = currentMonthName;
}

export function startDateTimeInterval() {
  setCurrentTime();

  return setInterval(() => {
    setCurrentTime();
  }, 1000);
}
