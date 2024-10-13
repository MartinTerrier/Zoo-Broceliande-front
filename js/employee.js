import { apiBaseUrl, getConnexionToken } from "./script.js";
import { jwtDecode } from "../node_modules/jwt-decode/build/esm/index.js";

const mealCreateForm = document.getElementById('meal-create-form');
const mealCreateAnimalSelect = document.getElementById('meal-create-animal-select');
const mealCreateFoodInput = document.getElementById('meal-create-food-input');
const mealCreateQuantityInput = document.getElementById('meal-create-quantity-input');
const mealCreateTimeInput = document.getElementById('meal-create-time-input');
const mealCreateButton = document.getElementById('meal-create-button');
const mealCreateConfirmation = document.getElementById('meal-create-confirmation');

const animalsArray = await fetch(`${apiBaseUrl}/animals`, { method: "GET", redirect: "follow"})
  .then((response) => response.json())
  .catch((error) => console.error(error));

let animalsSelectHtml = '';
animalsArray.forEach((animal) => {
  animalsSelectHtml += `<option value="${animal.id}">${animal.name} - ${animal.species.label}</option>`
});
mealCreateAnimalSelect.innerHTML = animalsSelectHtml;

const createMeal = async () => {
    const formData = new FormData(mealCreateForm);
    const token = getConnexionToken();
    
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
        'animalId': +formData.get('animalId'),
        'userName': jwtDecode(token).userName,
        'food': formData.get('food'),
        'quantity': formData.get('quantity'),
        'date': formData.get('date'),
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(`${apiBaseUrl}/animals/meal`, requestOptions)
    .then(async (response) => {
        if (response.ok) {
            const createdMeal = await response.json();
            mealCreateAnimalSelect.value = animalsArray[0].id;
            mealCreateFoodInput.value = null;
            mealCreateQuantityInput.value = null;
            mealCreateTimeInput.value = null;
            mealCreateConfirmation.innerHTML = `<div><i class="bi bi-check-square-fill text-primary"></i> Votre repas pour l'animal ${createdMeal.animal.name} a bien été créé.</div>`
        } else {
            alert("Le repas n'a pas pu être créé.");
        }})
    .catch((error) => console.error(error));
}

mealCreateButton.addEventListener('click', createMeal);