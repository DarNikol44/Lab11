let form = document.querySelector("#form");
let log = document.querySelector("#username");
let phone = document.querySelector("#phone");
let email = document.querySelector("#email");
let site = document.querySelector("#site");
const tbody = document.querySelector("tbody");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let inputs = document.querySelectorAll("input");
  let valid = true;
  removeValidation();

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() === "") {
      valid = false;
      inputs[i].parentNode.appendChild(ErrorMsg());
    }
  }

  if (validateEmail() === false) {
    valid = false;
  }

  if (validatePhone() === false) {
    valid = false;
  }

  if (valid) {
    let req = {
      username: log.value,
      phone: phone.value,
      email: email.value,
      website: site.value,
    };
    CreateUser(req);
  }
});

function ErrorMsg() {
  let errorMessage = document.createElement("p");
  errorMessage.className = "error";
  errorMessage.textContent = "Заполните поле";
  errorMessage.style.margin = 0;
  errorMessage.style.color = "red";
  return errorMessage;
}

function removeValidation() {
  let errors = form.querySelectorAll(".error");

  for (var i = 0; i < errors.length; i++) {
    errors[i].remove();
  }
}
function validateEmail() {
  let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  let address = email.value;
  if (reg.test(address) == false) {
    alert("Ваш email не проходит валидацию, проверьте правильность ввода");
    return false;
  }
}

function validatePhone() {
  let reg = /^(\+7)+([0-9]){10}$/;
  let number = phone.value;
  if (reg.test(number) == false) {
    alert("Ваш номер телефона не проходит валидацию, проверьте правильность ввода");
    return false;
  }
}

async function GetUsers() {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: {Accept: "application/json"},
  });
  if (response.ok === true) {
    const users = await response.json();
    users.forEach((user) => {
      tbody.append(row(user));
    });
  }
}

async function CreateUser(data) {
  const response = await fetch("api/users", {
    method: "POST",
    headers: {Accept: "application/json", "Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
  if (response.ok === true) {
    const user = await response.json();
    form.reset();
    tbody.append(row(user));
  }
}

async function DeleteUser(id) {
  const response = await fetch("/api/users/" + id, {
    method: "DELETE",
    headers: {Accept: "application/json"},
  });
  if (response.ok === true) {
    const user = await response.json();
    document.querySelector(`tr[data-id="${user._id}"]`).remove();
  }
}

function row(user) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", user._id);

  const tdName = document.createElement("td");
  tdName.append(user.name);
  tr.append(tdName);

  const tdPhone = document.createElement("td");
  tdPhone.append(user.phone);
  tr.append(tdPhone);

  const tdMail = document.createElement("td");
  tdMail.append(user.email);
  tr.append(tdMail);

  const tdSite = document.createElement("td");
  tdSite.append(user.website);
  tr.append(tdSite);

  const linkTd = document.createElement("td");
  const removeLink = document.createElement("button");
  removeLink.setAttribute("data-id", user._id);
  removeLink.append("Удалить");
  removeLink.addEventListener("click", (e) => {
    e.preventDefault();
    DeleteUser(user._id);
  });

  linkTd.append(removeLink);
  tr.appendChild(linkTd);

  return tr;
}

GetUsers();