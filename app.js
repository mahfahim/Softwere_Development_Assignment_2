let count = 0;
const addedMeals = new Set();  

const search_Meal = () => {
  const query = document.getElementById("searchInput").value.trim();
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "";

  if (query === "") {
    alert("Please enter a search term");
    return;
  }

  fetch_Meals(query);
};

const fetch_Meals = (query) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then((response) => {
      if (!response.ok) {
        alert("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      display_meal(data);
    })
    .catch((error) => {
      alert(`Error fetching meal details: ${error.message}`);
    });
};

const display_meal = (data) => {
  const resultDiv = document.getElementById("result");

  if (!data || !data.meals) {
    resultDiv.innerHTML = `<p class='text-danger'> No meals found. Try a different search term.</p>`;
    return;
  }

  data.meals.forEach((meal) => {
    const mealCard = `
      <div class="col-sm-12 col-md-6 col-lg-4 mb-3">
        <div class="card p-2">
          <div class="row g-0">
            <div class="col-5 col-sm-4">
              <img 
                src="${meal.strMealThumb}" 
                class="img-fluid w-100 clickable-image" 
                alt="${meal.strMeal}" 
                data-id="${meal.idMeal}">
            </div>
            <div class="col-7 col-sm-8">
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>

                <button class="btn btn-warning">
                    <a href="${meal.strYoutube}" target="_blank" style="text-decoration: none; color: white;">
                      Watch
                    </a>
                </button>

                <button class="btn btn-warning text-white" id="addButton-${meal.idMeal}" 
                  onclick="handleAddToCart('${meal.strMealThumb}', '${meal.strMeal}', '${meal.idMeal}')">Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    resultDiv.innerHTML += mealCard;
  });

  document.querySelectorAll(".clickable-image").forEach((img) => {
    img.addEventListener("click", (event) => {
      const mealId = event.target.getAttribute("data-id");
      fetchMealDetails(mealId);
    });
  });
};

const handleAddToCart = (image, name, idMeal) => {
  const cartlist = document.getElementById("card-add");
  const addButton = document.getElementById(`addButton-${idMeal}`);


  if (addedMeals.has(idMeal)) {
    alert("Already added");
    return;
  }

  
  addedMeals.add(idMeal);

  if (!cartlist.querySelector("h3")) {
    cartlist.innerHTML += `<h3 class="text-center">Your Cart</h3>`;
  }

  count += 1;

  
  if (count > 11) {
    alert("You cannot add more than 11 items.");
    cartlist.innerHTML = "";
    search_Meal();
    count = 0;
    addedMeals.clear(); 
    return;
  }

  const cartitem = `
    <div class="card m-2">
      <div class="row g-0">
        <div class="col-5 col-sm-4">
          <img src="${image}" class="img-fluid" alt="${name}">
        </div>
        <div class="col-7 col-sm-8">
          <div class="card-body">
            <h5 class="card-title">Card-${count}</h5>
            <p class="card-text">${name}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  cartlist.innerHTML += cartitem;

  
  addButton.innerHTML = "Added";
  addButton.setAttribute("disabled", "true");  
};

const fetchMealDetails = (mealId) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => {
      if (!response.ok) {
        alert("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayMealDetails(data.meals[0]);
    })
    .catch((error) => {
      alert(`Error fetching meal details: ${error.message}`);
    });
};

const displayMealDetails = (meal) => {
  const modalBody = document.getElementById("mealModalBody");
  modalBody.innerHTML = `
    <div class="card">
      <img src="${meal.strMealThumb}" class="card-img-top img-fluid" alt="${meal.strMeal}">
      <div class="card-body">
        <h5 class="card-title">${meal.strMeal}</h5>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        <ul><strong>Ingredients:</strong>
          ${Object.keys(meal)
            .filter((key) => key.startsWith("strIngredient") && meal[key])
            .map((key) => `<li>${meal[key]}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
  `;

  const mealModal = new bootstrap.Modal(document.getElementById("mealModal"));
  mealModal.show();
};

document.getElementById("searchInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    search_Meal();
  }
});
