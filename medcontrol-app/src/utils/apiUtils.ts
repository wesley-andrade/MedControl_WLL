import { ApiResponse } from "../types";

export const handleApiResponse = async <T>(
  response: Response,
  errorMessage: string
): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || errorMessage);
  }

  const apiResponse: ApiResponse<T> = await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || errorMessage);
  }

  return apiResponse.data;
};

export const apiGet = async <T>(
  url: string,
  token: string,
  errorMessage: string
): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse<T>(response, errorMessage);
};

export const apiPost = async <T>(
  url: string,
  token: string,
  body: any,
  errorMessage: string
): Promise<T> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleApiResponse<T>(response, errorMessage);
};

export const apiPut = async <T>(
  url: string,
  token: string,
  body: any,
  errorMessage: string
): Promise<T> => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return handleApiResponse<T>(response, errorMessage);
};

export const apiDelete = async <T>(
  url: string,
  token: string,
  errorMessage: string
): Promise<T> => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse<T>(response, errorMessage);
};
