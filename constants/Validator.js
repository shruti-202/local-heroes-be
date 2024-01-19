const nameValidator = (name) => {
  const nameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]*)?$/;
  return nameRegex.test(name);
};

const emailValidator = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const usernameValidator = (username) => {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
  return usernameRegex.test(username);
};

const passwordValidator = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const titleValidator = (title) => {
  const titleRegex = /^[A-Z][a-z]*(?: [A-Za-z][a-z]*)*$/;
  return titleRegex.test(title);
};

const descriptionValidator = (description) => {
  const descriptionRegex = /^[A-Z][a-z]*(?: [A-Za-z0-9][a-z0-9]*)*$/;
  return descriptionRegex.test(description);
};

const pinCodeValidator = (pinCode) => {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.match(pinCode);
};

module.exports = { nameValidator, emailValidator, usernameValidator, titleValidator, passwordValidator, descriptionValidator,pinCodeValidator };
