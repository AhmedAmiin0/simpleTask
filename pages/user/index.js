const user = localStorage.getItem("user");
if(!user || user === "undefined" || user.length === 0){
  window.location.href = window.location.pathname.replace("user", "register");
}

document.getElementById("user").textContent = user;
