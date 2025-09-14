import { Alert } from "react-native";
import { ValidationResult } from "../types";

export const MIN_PASSWORD_LENGTH = 6;
const DATE_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const FIXED_SCHEDULES_REGEX =
  /^(?:[01]\d|2[0-3]):[0-5]\d(?:\s*,\s*(?:[01]\d|2[0-3]):[0-5]\d)*$/;

export const validateRequired = (
  value: string,
  fieldName: string
): ValidationResult => {
  if (!value?.trim()) {
    return {
      isValid: false,
      message: `${fieldName} é obrigatório`,
    };
  }
  return { isValid: true };
};

export const validateNumber = (
  value: number,
  fieldName: string
): ValidationResult => {
  if (!value || value <= 0) {
    return {
      isValid: false,
      message: `${fieldName} deve ser maior que 0`,
    };
  }
  return { isValid: true };
};

export const validateDateFormat = (
  dateString: string,
  fieldName: string
): ValidationResult => {
  if (!DATE_REGEX.test(dateString)) {
    return {
      isValid: false,
      message: `${fieldName} deve estar no formato dd/mm/aaaa`,
    };
  }
  return { isValid: true };
};

export const validateTimeFormat = (
  timeString: string,
  fieldName: string
): ValidationResult => {
  if (!TIME_REGEX.test(timeString)) {
    return {
      isValid: false,
      message: `${fieldName} deve estar no formato HH:MM`,
    };
  }
  return { isValid: true };
};

export const validateFixedSchedules = (
  fixedSchedules: string
): ValidationResult => {
  if (
    !fixedSchedules?.trim() ||
    fixedSchedules.trim().split(",").length === 0
  ) {
    return {
      isValid: false,
      message: "Horários fixos são obrigatórios quando ativados",
    };
  }
  return { isValid: true };
};

export const validateFixedSchedulesFormat = (
  fixedSchedules: string
): ValidationResult => {
  if (!FIXED_SCHEDULES_REGEX.test(fixedSchedules)) {
    return {
      isValid: false,
      message: "Formato dos horários fixos inválido. Use HH:MM,HH:MM",
    };
  }
  return { isValid: true };
};

export const showValidationError = (message: string) => {
  Alert.alert("Erro", message);
};
