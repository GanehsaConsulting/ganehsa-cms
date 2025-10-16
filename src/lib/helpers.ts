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

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

export const calculateOriginalPrice = (discountedPrice: number, discountPercentage:number) => {
  if (discountPercentage === 0 || discountedPrice === 0) return 0;

  const originalPrice = discountedPrice / (1 - discountPercentage / 100);

  return Math.round(originalPrice / 1000) * 1000;
};
