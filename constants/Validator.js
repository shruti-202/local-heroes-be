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
  const gibberishRegex = /(.)\1{2,}/; 
  if (gibberishRegex.test(title)) {
    return false; 
  }
  const titleRegex = /^(?:[A-Z][a-z]*|[A-Z]+)(?:\s(?:[A-Z][a-z]*|[A-Z]+|[a-z]+))*$/
  return titleRegex.test(title);
};

const descriptionValidator = (description) => {
  const gibberishRegex = /(.)\1{3,}/; 
  if (gibberishRegex.test(description)) {
    return false; 
  }
  const descriptionRegex = /^(?:[A-Z][a-z]*|[A-Z]+)(?:\s(?:[A-Z][a-z]*|[A-Z]+|[a-z]+|\d+))*$/
  return /\b[A-Z][a-z]*\b/.test(description) && descriptionRegex.test(description);
};

const pinCodeValidator = (pinCode) => {
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  return pinCodeRegex.test(pinCode);
};

const addressValidator = (addressLineOne) => {
  const gibberishRegex = /(.)\1{2,}/; 
  if (gibberishRegex.test(addressLineOne)) {
    return false; 
  }
  const addressValidator  = /^(?:[A-Z][a-z]*|[A-Z]+)(?:\s(?:[A-Z][a-z]*|[A-Z]+|[a-z]+|\d+))*$/
  return addressValidator.test(addressLineOne);
};

const stateValidator = (state) => {
  const gibberishRegex = /(.)\1{2,}/; 
  if (gibberishRegex.test(state)) {
    return false; 
  }
  const stateValidator  =  /^(?:[A-Z][a-z]*|[A-Z]+)(?:\s(?:[A-Z][a-z]*|[A-Z]+|[a-z]+))*$/
  return stateValidator.test(state);
};

const cityValidator = (city) => {
  const gibberishRegex = /(.)\1{2,}/; 
  if (gibberishRegex.test(city)) {
    return false; 
  }
  const cityValidator =  /^(?:[A-Z][a-z]*|[A-Z]+)(?:\s(?:[A-Z][a-z]*|[A-Z]+|[a-z]+))*$/
  return cityValidator.test(city);
};


module.exports = { nameValidator, emailValidator, usernameValidator, titleValidator, passwordValidator, descriptionValidator, pinCodeValidator, addressValidator, stateValidator, cityValidator    };
