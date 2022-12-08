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





// validate inputs function
const validateInputs = (data) => {
  let error = [];

  inputs.forEach((input) => {
    const { name, message, pattern } = input;
    $(`label[for=${name}]`).classList.remove("error");
    $(`#${name}Container  .errorMessage`).classList.add("hide");
    $(`#${name}Container .errorMessage`).textContent = "";

    if (pattern.test(data[name]) === false) {
      $(`label[for=${name}]`).classList.add("error");
      $(`#${name}Container .errorMessage`).classList.remove("hide");
      $(`#${name}Container .errorMessage`).textContent = message;
      error.push(true);
    }
  });
  if (data.password !== data.password_confirmation) {
    $(`label[for=password]`).classList.add("error");
    $(`#passwordContainer .errorMessage`).classList.remove("hide");
    $(`#passwordContainer .errorMessage`).textContent =
      "Passwords do not match";
    error.push(true);
  }
  if (error.length > 0 && error.every((e) => e === true)) return true;

  return false;
};




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
        $(`label[for=${key}]`).classList.add("error");
        $(`#${key}Container .errorMessage`).classList.remove("hide");
        $(`#${key}Container .errorMessage`).textContent = value[0];
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
