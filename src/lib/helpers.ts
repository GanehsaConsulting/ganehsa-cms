"use client"

export const combineDateAndTime = (
  selectedDate: Date,
  selectedTime: string
) => {
  if (!selectedDate) return undefined;

  const [hours, minutes, seconds] = selectedTime.split(":").map(Number);
  const combinedDate = new Date(selectedDate);
  combinedDate.setHours(hours, minutes, seconds || 0, 0);

  return combinedDate.toISOString();
};


export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}
