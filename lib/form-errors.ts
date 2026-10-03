import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly string[],
) {
  if (
    !axios.isAxiosError<{ errors?: { path: string; message: string }[] }>(error)
  )
    return;
  if (error.response?.status === 409 && fields.includes("email")) {
    setError("email" as Path<T>, {
      type: "server",
      message: "This email already exists",
    });
  }
  if (error.response?.status === 400) {
    error.response.data.errors?.forEach(({ path, message }) => {
      if (fields.includes(path))
        setError(path as Path<T>, { type: "server", message });
    });
  }
}
