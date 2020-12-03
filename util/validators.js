const validateRegisterUsername = (username) => {
  if(username.trim() === ''){
    return 'Username must not be empty';
  }
  if(username.length > 30) {
    return 'Username must not be more than 30 characters';
  }
  return '';
};

const validateRegisterEmail = (email) => {
  if(email.trim() === ''){
    return 'Email must not be empty';
  }

  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if(!email.match(regEx)){
    return 'Email must be a valid email address';
  }
  return '';
}

const validateRegisterPassword = (password, confirmPassword) => {
  if (password === '') {
    return 'Password must not be empty';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  const lowersRegex = /[a-z]/;
  const capitalsRegex = /[A-Z]/;
  const numbersRegex = /[0-9]/;
  if (password.length < 20 && (!password.match(lowersRegex) || !password.match(capitalsRegex) || !password.match(numbersRegex))) {
    return 'Password must be at least 20 characters or use lower case, capital letters, and numbers'
  }

  if(password !== confirmPassword){
    return 'Passwords must match';
  }

  return '';
}

const checkEmpty = (value) => {
  return value.trim().length === 0;
}


module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  const usernameError = validateRegisterUsername(username);
  if (usernameError.length > 0) {
    errors.username = usernameError;
  }

  const emailError = validateRegisterEmail(email);
  if (emailError.length > 0) {
    errors.email = emailError;
  }

  const passwordError = validateRegisterPassword(password, confirmPassword);
  if (passwordError.length > 0) {
    errors.password = passwordError;
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};



module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if(checkEmpty(username)){
    errors.username = 'Username must not be empty';
  }
  if(checkEmpty(password)){
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

module.exports.validateRecoInput = (text, link, tag) => {
  const errors = {};

  if (checkEmpty(text)) {
    errors.text = 'Recommendation must not be empty'
  }
  if (checkEmpty(tag)) {
    errors.tag = 'Must contain one category'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
