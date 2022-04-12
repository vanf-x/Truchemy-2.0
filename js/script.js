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

//
//ARRAY
let cart = [];
let coursesArray = [];
let addToCartButton;
//
//EXECUTION STARTS
window.addEventListener("DOMContentLoaded", () => {
  getData();
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
  //   coursesArray.forEach((el) => console.log(el));
  showCourses();
}
//
//creates HTML for the courses in coursesArray
function showCourses() {
  const $fragment = document.createDocumentFragment();
  coursesArray.forEach((el) => {
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
  addToCartButton = document.querySelectorAll(".add-to-cart-button");
  selectCourse();
}

//Add a course to the cart
function selectCourse() {
  let selectedCourse;
  addToCartButton.forEach((el) => {
    el.addEventListener("click", (e) => {
      // xd();
      coursesArray.forEach((el) => {
        selectedCourse = coursesArray.filter(
          (course) => course.id == e.target.dataset.id
        );
      });
      cart = [...cart, selectedCourse];
      showCoursesInCart();
    });
  });
}
//
//Add HTML to cart
function showCoursesInCart() {
  const coursesList =   document.querySelector("#courses-list");
  clearHTML(coursesList);
  const $fragment = document.createDocumentFragment();
  cart.forEach((el) => {
    const { id, picture, name, tutor, stars, price, offer } = el[0];
    const tr = document.createElement("tr");
    tr.innerHTML = `
                <td><img src="${picture}"></td>
                <td>${name}</td>
                <td>$${offer}</td>
                <td><button><i class="fa-solid fa-trash-can"></i></button></td>
        `;
    $fragment.appendChild(tr);
  });
  coursesList.appendChild($fragment);
}
//
//Prevets HTML multiplication
function clearHTML(value) {
  while (value.firstChild) {
    value.firstChild.remove();
  }
}
