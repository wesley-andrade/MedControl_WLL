export const successResponse = (data: any, message?: string) => ({
  success: true,
  data,
  message: message || "Operação realizada com sucesso",
});
