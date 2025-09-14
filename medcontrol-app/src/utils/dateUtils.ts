export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
};

export const getRelativeDate = (dateString: string): string => {
  return formatDate(dateString);
};

export const extractTimeFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const convertDateToISO = (
  dateString: string,
  timeString: string
): string => {
  const [day, month, year] = dateString.split("/");
  const [hours, minutes] = timeString.split(":");

  const brasiliaISOString = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00.000-03:00`;

  const utcDate = new Date(brasiliaISOString);
  return utcDate.toISOString();
};

export const formatDateWhileTyping = (text: string): string => {
  const numbers = text.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
  }
};

export const formatTimeWhileTyping = (text: string): string => {
  const numbers = text.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
  }
};

export const isDosagePending = (status: string): boolean => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "pending";
};

export const isDosageTaken = (status: string): boolean => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "taken" || normalizedStatus === "late";
};

export const isDosageMissed = (status: string): boolean => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "missed";
};
