import { apiBaseUrl, getConnexionToken } from "./script.js";
import { jwtDecode } from "../node_modules/jwt-decode/build/esm/index.js";

const mealLookupAnimalSelect = document.getElementById('meal-lookup-animal-select');
const mealTable = document.getElementById('meal-table');

const reportCreateForm = document.getElementById('report-create-form');
const reportCreateAnimalSelect = document.getElementById('report-create-animal-select');
const reportCreateStatusInput = document.getElementById('report-create-status-input');
const reportCreateContentInput = document.getElementById('report-create-content-input');
const reportCreateFoodInput = document.getElementById('report-create-food-input');
const reportCreateQuantityInput = document.getElementById('report-create-quantity-input');
const reportCreateButton = document.getElementById('report-create-button');
const reportCreateConfirmation = document.getElementById('report-create-confirmation');

const animalsArray = await fetch(`${apiBaseUrl}/animals`, { method: "GET", redirect: "follow" })
.then((response) => response.json())
.catch((error) => console.error(error));

let animalsSelectHtml = '<option value="">--Choisissez un animal--</option>';
animalsArray.forEach((animal) => {
animalsSelectHtml += `<option value="${animal.id}">${animal.name} - ${animal.species.label}</option>`
});
mealLookupAnimalSelect.innerHTML = animalsSelectHtml;
reportCreateAnimalSelect.innerHTML = animalsSelectHtml;

const loadAnimalMeals = async (animalId) => {
    mealTable.innerHTML = `<table class="table table-secondary table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Nourriture</th>
                            <th scope="col">Quantité</th>
                            <th scope="col">Employé</th>
                        </tr>
                    </thead>
                    <tbody id="meal-table-body"></tbody>
                </table>`;

    const mealTableBody = document.getElementById('meal-table-body');
    const mealsArray = await fetch(`${apiBaseUrl}/animals/meal/${animalId}`, { method: "GET", redirect: "follow"})
    .then((response) => response.json())
    .catch((error) => console.error(error));
    let mealTableBodyHtml = '';

    mealsArray.forEach((meal, index) => {
        const mealDate = new Date(meal.date).toLocaleString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit'});
        
        mealTableBodyHtml += `<tr>
            <th scope="row">${index+1}</th>
            <td>${mealDate}</td>
            <td>${meal.food}</td>
            <td>${meal.quantity}</td>
            <td>${meal.employee.firstName} ${meal.employee.name}</td>
            </tr>`
    });
    mealTableBody.innerHTML = mealTableBodyHtml;
}

mealLookupAnimalSelect.addEventListener('change', async (event) => {
    const animalId = event.target.value;
    await loadAnimalMeals(animalId);
})

const createReport = async () => {
    const formData = new FormData(reportCreateForm);
    const token = getConnexionToken();
    
    
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        'animalId': +formData.get('animalId'),
        'userName': jwtDecode(token).userName,
        'status': formData.get('status'),
        'content': formData.get('content'),
        'food': formData.get('food'),
        'quantity': formData.get('quantity'),
        'date': new Date().toISOString(),
    })

    console.log(raw);
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch(`${apiBaseUrl}/animals/report`, requestOptions)
    .then(async (response) => {
        if (response.ok) {
            const createdReport = await response.json();
            reportCreateAnimalSelect.value = '';
            reportCreateStatusInput.value = null;
            reportCreateContentInput.value = null;
            reportCreateFoodInput.value = null;
            reportCreateQuantityInput.value = null;
            reportCreateConfirmation.innerHTML = `<div><i class="bi bi-check-square-fill text-primary"></i> Votre rapport sur l'animal ${createdReport.animal.name} a bien été créé.</div>`
        } else {
            alert("Le rapport n'a pas pu être créé.");
        }})
    .catch((error) => console.error(error));
}

reportCreateButton.addEventListener('click', createReport);