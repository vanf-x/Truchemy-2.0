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
  getData();
  document.querySelector("#reset-btn").addEventListener("click", resetCart);
  document
    .querySelector("#search-button")
    .addEventListener("click", searchCourse);
});
//
//FUNCTIONS
//
//brings data from URL, using AXIOS library
async function getData() {
  try {
    let res = await axios.get("../js/courses.json");
    let json = await res.data;
    fillCoursesArray(json);
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
  showCourses(coursesArray);
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
  selectCourse();
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
            showCoursesInCart();
            return;
          }

          notification("Curso agregado con éxito", 1);
          showCoursesInCart();
          return;
        }
      });
    });
  });
  setTotalAmmount();
}
//
//deletes course with the trash-bin button
function deleteCourse() {
  $deleteCourseButton.forEach((el) => {
    el.addEventListener("click", (e) => {
      cart = cart.filter((el) => el[0].id != e.target.parentElement.dataset.id);
      showCoursesInCart();
    });
  });

  setTotalAmmount();
}
//
//Add HTML to cart
function showCoursesInCart() {
  const coursesList = document.querySelector("#courses-list");
  clearHTML(coursesList);
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
  coursesList.appendChild($fragment);
  $deleteCourseButton = document.querySelectorAll(".delete-course-button");
  deleteCourse();
  showPayButton();
}
//
//Prevets HTML multiplication
function clearHTML(value) {
  while (value.firstChild) {
    value.firstChild.remove();
  }
}
//
//Shows a message
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
  totalAmmount = 0;
  setTotalAmmount();
  showCoursesInCart();
}
//
//sets and shows the total ammount in cart
function setTotalAmmount() {
  totalAmmount = 0;
  cart.forEach((el) => {
    totalAmmount += el[0].offer;
  });
  document.querySelector("#total").textContent = totalAmmount;
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
//
function searchCourse() {
  const $coursesContainer = document.querySelector(".courses-container");
  const $searchResult = document.querySelector("#search");
  let filteredCourse = coursesArray.filter((course) =>
    course.name
      .toLowerCase()
      .trim()
      .includes($searchResult.value.toLowerCase().trim())
  );

  if (filteredCourse.length === 0) {
    notification("No se encontró ningún curso con ese nombre", 2);
    return;
  }

  if(filteredCourse.length === 1){
    notification(`Se encontró ${filteredCourse.length} resultado`, 1);
    clearHTML($coursesContainer);
    showCourses(filteredCourse);
    restoreCourses($coursesContainer);
    return;
  }

  notification(`Se encontraron ${filteredCourse.length} resultados`, 1);
  clearHTML($coursesContainer);
  showCourses(filteredCourse);
  restoreCourses($coursesContainer);
}
//
//
function restoreCourses(value) {
  const $coursesContainer = document.querySelector(".courses-container");
  const div = document.createElement("div");
  div.innerHTML = `
      <button class="restore-courses-buton" id="restore-courses-button">Volver atrás</button>
  `;
  value.appendChild(div);
  document
    .querySelector("#restore-courses-button")
    .addEventListener("click", () => {
      clearHTML(value);
      showCourses(coursesArray);
    });
}
//
//
