//CLASS
class Course {
  constructor(id, picture, name, tutor, stars, price, offer) {
    this.id = id;
    this.picture = picture;
    this.name = name;
    this.tutor = tutor;
    this.stars = stars;
    this.price = price;
    this.offer = offer;
  }
}
//
//CONST
const $coursesList = document.querySelector("#courses-list");
const $confirmCoursesList = document.querySelector(
  "#confirm-left-courses-list"
);
const $userName = document.querySelector("#user-name");
const $userMail = document.querySelector("#user-mail");
const $confirmPaymentButton = document.querySelector("#confirm-payment-button");
//
//LET
let $addToCartButton;
let $deleteCourseButton;
let totalAmmount = 0;
//
//ARRAY
let cart = [];
let coursesArray = [];
//
//EXECUTION STARTS
window.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  showCoursesInCart($coursesList);// to 166
  showCoursesInCart($confirmCoursesList);

  getData();//to 64

  document.querySelector("#reset-btn").addEventListener("click", resetCart);//to 215

  document
    .querySelector("#search-button")
    .addEventListener("click", searchCourse);//to 247

  document.querySelector("#facebook-button").addEventListener("click", (e) => {
    e.preventDefault();
  });

  document.querySelector("#google-button").addEventListener("click", (e) => {
    e.preventDefault();
  });

  $confirmPaymentButton.addEventListener("click", (e) => {
    e.preventDefault();
    checkConfirmation();//to 310
  });
});
//
//FUNCTIONS
//
//brings data from URL, using AXIOS library
async function getData() {
  try {
    let res = await axios.get("../js/courses.json");
    let json = await res.data;
    fillCoursesArray(json);//to 75
  } catch (err) {
    console.log(err);
  }
}
//
//fill coursesArray with json value
function fillCoursesArray(value) {
  value.forEach((el) => {
    const { id, picture, name, tutor, stars, price, offer } = el;
    const course = new Course(id, picture, name, tutor, stars, price, offer);
    coursesArray = [...coursesArray, course];
  });
  showCourses(coursesArray);//to 85
}
//
//creates HTML for the courses in coursesArray
function showCourses(value) {
  const $fragment = document.createDocumentFragment();
  value.forEach((el) => {
    const { id, picture, name, tutor, stars, price, offer } = el;
    const div = document.createElement("div");
    div.classList.add("courses-card");
    div.innerHTML = `
                    <div class="picture">
                        <img src="${picture}" alt="curso${id}">
                    </div>

                    <div class="courses-card-info">
                        <h3>${name}</h3>
                        <h4>${tutor}</h4>
                        <img src="${stars}" alt="stars">
                        <div class="courses-card-info-price">
                            <p>$${price}</p> <h3>$${offer}</h3>
                        </div>
                        <button class="add-to-cart-button" data-id="${id}">Agregar</button>
                    </div>
        `;
    $fragment.appendChild(div);
  });
  document.querySelector(".courses-container").appendChild($fragment);
  $addToCartButton = document.querySelectorAll(".add-to-cart-button");
  selectCourse();//to 114
}
//
//Add a course to the cart
function selectCourse() {
  let selectedCourse;
  let n = 0;
  $addToCartButton.forEach((el) => {
    el.addEventListener("click", (e) => {
      coursesArray.forEach((el) => {
        selectedCourse = coursesArray.filter(
          (course) => course.id == e.target.dataset.id
        );
      });

      n = 0;
      cart = [...cart, selectedCourse];

      cart.forEach((el) => {
        if (el[0].name.includes(selectedCourse[0].name)) {
          n++;

          if (n > 1) {
            cart.pop();
            notification("Ya has agregado este curso", 2);
            showCoursesInCart($coursesList);//to 166
            showCoursesInCart($confirmCoursesList);//to 166
            return;
          }

          notification("Curso agregado con éxito", 1);
          showCoursesInCart($coursesList);//to 166
          showCoursesInCart($confirmCoursesList);//to 166
          setLocalStorage();//to 305
          return;
        }
      });
    });
  });
  setTotalAmmount();//to 227
}
//
//deletes course with the trash-bin button
function deleteCourse() {
  $deleteCourseButton.forEach((el) => {
    el.addEventListener("click", (e) => {
      cart = cart.filter((el) => el[0].id != e.target.parentElement.dataset.id);
      showCoursesInCart($coursesList);//to 166
      showCoursesInCart($confirmCoursesList);//to 166
    });
  });
  setLocalStorage();//to 305
  setTotalAmmount();//to 227
}
//
//Add HTML to cart
function showCoursesInCart(value) {
  //

  clearHTML(value);
  // clearHTML($confirmCoursesList);

  const $fragment = document.createDocumentFragment();

  cart.forEach((el) => {
    const { id, picture, name, tutor, stars, price, offer } = el[0];
    const tr = document.createElement("tr");
    tr.innerHTML = `
                <td><img src="${picture}"></td>
                <td>${name}</td>
                <td>$${offer}</td>
                <td><button class="delete-course-button" data-id="${id}"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
    $fragment.appendChild(tr);
  });
  value.appendChild($fragment);
  $deleteCourseButton = document.querySelectorAll(".delete-course-button");
  deleteCourse();//to 153
  showPayButton();//to 237
}
//
//Prevets HTML multiplication
function clearHTML(value) {
  while (value.firstChild) {
    value.firstChild.remove();
  }
}
//
//Shows a message. success or error, acording to value
function notification(message, value) {
  const $notification = document.getElementById("notification");
  const p = document.createElement("p");
  p.textContent = message;

  if (value == 1) p.classList.add("toast", "success", "show-up-toast");
  if (value == 2) p.classList.add("toast", "error", "show-up-toast");

  $notification.appendChild(p);

  setTimeout(() => {
    p.remove();
  }, 1500);
}
//
//
function resetCart() {
  if (cart.length > 0) notification("El carrito ha sido vaciado", 1);
  cart = [];
  setLocalStorage();//to 305
  totalAmmount = 0;
  setTotalAmmount();//to 227
  checkConfirmation();//to 310
  showCoursesInCart($coursesList);//to 166
  showCoursesInCart($confirmCoursesList);//to 166
}
//
//sets and shows the total ammount in cart
function setTotalAmmount() {
  totalAmmount = 0;
  cart.forEach((el) => {
    totalAmmount += el[0].offer;
  });
  document.querySelector("#total").textContent = totalAmmount;
  document.querySelector("#confirm-total").textContent = totalAmmount;
}
//
//if cart has 1 or more courses, shows payment button
function showPayButton() {
  const $paybutton = document.querySelector("#pay-btn");
  if (cart.length === 0) {
    $paybutton.style.display = "none";
    return;
  }
  $paybutton.style.display = "flex";
}
//
//searches courses by name
function searchCourse() {
  const $coursesContainer = document.querySelector(".courses-container");
  const $searchResult = document.querySelector("#search");
  //filter by name
  let filteredCourse = coursesArray.filter((course) =>
    course.name
      .toLowerCase()
      .trim()
      .includes($searchResult.value.toLowerCase().trim())
  );

  if ($searchResult.value.toLowerCase().trim() === "") {
    notification("No se ha ingresado ningún nombre", 2);//to 199
    $searchResult.value = "";
    return;
  }

  if (filteredCourse.length === 0) {
    notification("No se encontró ningún curso con ese nombre", 2);//to 199
    $searchResult.value = "";
    return;
  }

  if (filteredCourse.length === 1) {
    notification(`Se encontró ${filteredCourse.length} resultado`, 1);//to 199
    clearHTML($coursesContainer);//to 192
    showCourses(filteredCourse);//to 85
    restoreCourses($coursesContainer);//to 287
    $searchResult.value = "";
    return;
  }

  notification(`Se encontraron ${filteredCourse.length} resultados`, 1);//to 199
  clearHTML($coursesContainer);//to 192
  showCourses(filteredCourse);//to 85
  restoreCourses($coursesContainer);//to 287
  $searchResult.value = "";
}
//
//restore courses after search
function restoreCourses(value) {
  const div = document.createElement("div");

  div.innerHTML = `
      <button class="restore-courses-buton" id="restore-courses-button">Mostrar todos</button>
  `;

  value.appendChild(div);

  document
    .querySelector("#restore-courses-button")
    .addEventListener("click", () => {
      clearHTML(value);//to 192
      showCourses(coursesArray);//to 85
    });
}
//
//
function setLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
//
//checks if user name and mail are ok, and cart has at least 1 article
function checkConfirmation() {
  let uMail = false;
  let uName = false;

  const $userNameConfirmation = document.querySelector(
    "#user-name-confirmation"
  );
  const $userMailConfirmation = document.querySelector(
    "#user-mail-confirmation"
  );
  const $cartMessage = document.querySelector("#cart-message");

  const userName = /^[a-zA-Z0-9\_\-]{4,16}$/;
  const userMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  uName = userName.test($userName.value);
  uMail = userMail.test($userMail.value);

  if (!uName) {
    userError($userNameConfirmation);//to 394
    return;
  }
  console.log("1");
  $userNameConfirmation.classList.add("d-n");

  if (!uMail) {
    userError($userMailConfirmation);//to 394
    return;
  }
  $userMailConfirmation.classList.add("d-n");

  if (cart.length == 0){
    userError($cartMessage);//to 394
    return;
  } 

  finalMessage();//to 350
}
//
//Confirmation message. End of purchase
function finalMessage() {
  const $done = document.querySelector(".done");

  document.querySelector("main").style.display = "none";
  document.querySelector(".nav-search").style.display = "none";
  $done.classList.remove("d-n");

  spinner($done);//to 373

  const p = document.createElement("p");
  p.innerHTML = `
      Gracias, <span>${$userName.value}</span>! Estarás recibiendo la factura en tu correo <span>${$userMail.value}</span>.
  `;

  setTimeout(() => {
    $done.firstChild.remove();
    $done.appendChild(p);
    resetUser();//to 388
    resetCart();//to 215
  }, 2000);
}
//
//creates a spinner
function spinner(element) {
  const div = document.createElement("div");
  div.classList.add("sk-chase");
  div.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
  `;
  element.appendChild(div);
}
//
//reset user's info
function resetUser() {
  $userMail.value = "";
  $userName.value = "";
}
//
//user verification error
function userError(value){
  value.classList.remove("d-n");
  setTimeout(()=>{
    value.classList.add("d-n");
  }, 1500)
}