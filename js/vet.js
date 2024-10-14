import { apiBaseUrl, getConnexionToken } from "./script.js";

const mealLookupAnimalSelect = document.getElementById('meal-lookup-animal-select');
const mealTable = document.getElementById('meal-table');

const animalsArray = await fetch(`${apiBaseUrl}/animals`, { method: "GET", redirect: "follow" })
.then((response) => response.json())
.catch((error) => console.error(error));

let animalsSelectHtml = '<option value="">--Choisissez un animal--</option>';
animalsArray.forEach((animal) => {
animalsSelectHtml += `<option value="${animal.id}">${animal.name} - ${animal.species.label}</option>`
});
mealLookupAnimalSelect.innerHTML = animalsSelectHtml;

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
        console.log(meal.date);
        const mealDate = new Date(meal.date).toLocaleString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit'});
        console.log(mealDate);
        
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