export const loginValidator = (login: string): string => {
  if (!login) {
    return "Логин обязателен";
  }

  // Если логин начинается с '+', проверяем формат телефона
  if (login.startsWith("+")) {
    // Разрешить пробелы и дефисы после знака +
    if (!/^\+[\d\s-]+$/.test(login)) {
      return "Неправильный формат телефона";
    }

    // Проверить, что телефон содержит только цифры
    const cleanedPhone = login.replace(/[\s-]/g, '');
    if (!/^\+\d{1,14}$/.test(cleanedPhone)) {
      return "Неправильный формат телефона";
    }
  } 
 else {
    // Разрешить латинские буквы, цифры и спецсимволы без пробелов
    if (!/^[\w@.\-!$%&'*~]+$/.test(login)) {
      return "Только латинские буквы, цифры и спецсимволы, без пробелов";
    }
  }

  return "";
};

export const passwordValidator = (password: string): string => {
  if (!password) {
    return "Пароль обязателен";
  } else if (password.length < 5) {
    return "Пароль должен содержать не менее 5 символов";
  }
  return "";
};