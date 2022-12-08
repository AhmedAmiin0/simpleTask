const $ = (el) => document.querySelector(el);
const url = "https://goldblv.com/api/hiring/tasks/register";

// validation rules for inputs
const inputs = [
  {
    name: "username",
    message:
      "Username must be between 5 and 12 characters and cannot contain special characters or numbers",
    pattern: /^[a-zA-Z]{5,15}$/,
    type: "username",
  },
  {
    name: "email",
    message: "Please enter a valid email address",
    pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    type: "email",
  },
  {
    name: "password",
    message: "Password must be between 8",
    pattern: /^.{8,}$/,
    type: "password",
  },
  {
    name: "password_confirmation",
    message: "Passwords do not match",
    pattern: /^.{8,}$/,
    type: "password",
  },
];
// remove error message from the dom
function removeError(name) {
  $(`label[for=${name}]`).classList.remove("error");
  $(`#${name}Container .errorMessage`).classList.add("hide");
  $(`#${name}Container .errorMessage`).textContent = "";
}
// show error message on the dom
function showError(name, message) {
  $(`label[for=${name}]`).classList.add("error");
  $(`#${name}Container .errorMessage`).classList.remove("hide");
  $(`#${name}Container .errorMessage`).textContent = message;
}

// validate inputs function
const validateInputs = (data) => {
  let error = [];

  inputs.forEach((input) => {
    const { name, message, pattern } = input;
    removeError(name);

    if (pattern.test(data[name]) === false) {
      showError(name, message);
      error.push(true);
    }
  });
  if (data.password !== data.password_confirmation) {
    showError("password_confirmation", "Passwords do not match");
    error.push(true);
  }
  if (error.length > 0 && error.every((e) => e === true)) return true;

  return false;
};

function onChangeValidateInput(e) {
  const { name, value } = e.target;
  const input = inputs.find((input) => input.name === name);

  if (input.pattern.test(value) === false && name !== "password_confirmation") {
    showError(name, input.message);
  } else if (name === "password_confirmation") {
    checkConfirmPassword(e);
  } else {
    removeError(name);
  }
}
// check confirm password
function checkConfirmPassword(e) {
  const { name, value } = e.target;
  const input = inputs.find((input) => input.name === name);
  if (input.pattern.test(value) === false || value !== $("#password").value) {
    showError(name, input.message);
  } else {
    removeError(name);
  }
}

// submit form function
const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  let apiError = false;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (validateInputs(data)) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const res = await response.json();
    if (res.errors) {
      // errors is object with key value pairs we need to loop through
      const { errors } = res;
      for (const [key, value] of Object.entries(errors)) {
        showError(key, value[0]);
      }
      apiError = true;
    }

    if (apiError) return;

    localStorage.setItem("user", data.email);

    window.location.href = window.location.pathname.replace("register", "user");
  } catch (err) {
    console.log(err);
  }
};

$("#registerForm").addEventListener("submit", async (e) => handleSubmit(e));
$("#username").addEventListener("change", onChangeValidateInput);
$("#email").addEventListener("change", onChangeValidateInput);
$("#password").addEventListener("change", onChangeValidateInput);
$("#password_confirmation").addEventListener("change", onChangeValidateInput);
