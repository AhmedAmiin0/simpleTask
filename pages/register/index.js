const $ = (el) => document.querySelector(el);
const url = "https://goldblv.com/api/hiring/tasks/register";
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
    name: "confirm_password",
    message: "Passwords do not match",
    pattern: /^.{8,}$/,
    type: "password",
  },
];

const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  let error = [];
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
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
  if (data.password !== data.confirm_password) {
    $(`label[for=password]`).classList.add("error");
    $(`#passwordContainer .errorMessage`).classList.remove("hide");
    $(`#passwordContainer .errorMessage`).textContent =
      "Passwords do not match";
    error.push(true);
  }
  if (error.length > 0 && error.every((e) => e === true)) return;

  localStorage.setItem("user", data.email);


  // the url end point returns 304 status code and get blocked by the browser
  // const response = await fetch(url, {
  //   method: "POST",
  //   body: JSON.stringify(data),
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //   },
  //   mode: "no-cors",
  // });

  // await response.json();
  
  window.location.href = window.location.pathname.replace("register", "user");
};
$("#registerForm").addEventListener("submit", async (e) => handleSubmit(e));
