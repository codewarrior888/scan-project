import { useState } from "react";
import {
  loginValidator,
  passwordValidator,
} from "./validators";

interface FormState {
  login: string;
  password: string;
}

interface FieldError {
  dirty: boolean;
  error: boolean;
  message: string;
}

interface Errors {
  login: FieldError;
  password: FieldError;
}

interface ValidateFormParams {
  form: FormState;
  errors: Errors;
  field?: keyof FormState;
  forceTouchErrors?: boolean;
}

const touchErrors = (errors: Errors): Errors => {
  return Object.entries(errors).reduce((acc, [field, fieldError]) => {
    acc[field as keyof Errors] = {
      ...fieldError,
      dirty: true,
    };
    return acc;
  }, {} as Errors);
};

export const useLoginFormValidator = (form: FormState) => {
  const [errors, setErrors] = useState<Errors>({
    login: { dirty: false, error: false, message: "" },
    password: { dirty: false, error: false, message: "" },
  });

  const validateForm = ({
    form,
    field,
    errors,
    forceTouchErrors = false,
  }: ValidateFormParams) => {
    let isValid = true;
    let nextErrors = JSON.parse(JSON.stringify(errors)) as Errors;

    if (forceTouchErrors) {
      nextErrors = touchErrors(errors);
    }

    const { login, password } = form;

    if (nextErrors.login.dirty && (field ? field === "login" : true)) {
      const loginMessage = loginValidator(login);
      nextErrors.login.error = !!loginMessage;
      nextErrors.login.message = loginMessage;
      if (!!loginMessage) isValid = false;
    }

    if (nextErrors.password.dirty && (field ? field === "password" : true)) {
      const passwordMessage = passwordValidator(password);
      nextErrors.password.error = !!passwordMessage;
      nextErrors.password.message = passwordMessage;
      if (!!passwordMessage) isValid = false;
    }

    setErrors(nextErrors);

    return { isValid, errors: nextErrors };
  };

  const onBlurField = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof FormState;
    const fieldError = errors[field];
    if (fieldError.dirty) return;

    const updatedErrors = {
      ...errors,
      [field]: {
        ...errors[field],
        dirty: true,
      },
    };

    validateForm({ form, field, errors: updatedErrors });
  };

  return {
    validateForm,
    onBlurField,
    errors,
  };
};