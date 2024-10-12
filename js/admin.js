import { apiBaseUrl, getConnexionToken } from "./script.js";

const habitatUpdateForm = document.getElementById('habitat-update-form');
const habitatToUpdateSelect = document.getElementById('habitat-update-select');
const habitatUpdateSelect = document.getElementById('habitat-update-select');
const habitatUpdateButton = document.getElementById('habitat-update-button');
const habitatUpdateConfirmation = document.getElementById('habitat-update-confirmation');
const habitatUpdateNameInput = document.getElementById('habitat-update-name-input');
const habitatUpdateContentInput = document.getElementById('habitat-update-content-input');
const habitatUpdateImageInput = document.getElementById('habitat-update-image-input');

const animalCreateModalEl = document.getElementById('create-animal-modal');
const animalCreateModal = new bootstrap.Modal(animalCreateModalEl);
const animalCreateForm = document.getElementById('animal-create-form');
const animalCreateNameInput = document.getElementById('animal-create-name-input');
const animalCreateSpeciesInput = document.getElementById('animal-create-species-input');
const animalCreateHabitatInput = document.getElementById('animal-create-habitat-input');
const animalCreateImageInput = document.getElementById('animal-create-image-input');
const animalCreateButton = document.getElementById('animal-create-button');

const preloadSelectedHabitat = async (habitatId) => {
    habitatUpdateConfirmation.innerHTML = '';
    const token = getConnexionToken();

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    await fetch(`${apiBaseUrl}/habitats/${habitatId}`, requestOptions)
    .then(async (response) => {
        const selectedHabitat = await response.json();
        habitatUpdateNameInput.value = selectedHabitat.name;
        habitatUpdateContentInput.value = selectedHabitat.description;
    })
    .catch((error) => console.error(error));
}

preloadSelectedHabitat(1);

habitatUpdateSelect.addEventListener('change', async (event) => {
    const habitatId = event.target.value;
    preloadSelectedHabitat(habitatId);
})

const updateHabitat = async () => {
    const formData = new FormData(habitatUpdateForm);
    console.log(formData);
    
    const token = getConnexionToken();

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    };

    await fetch(`${apiBaseUrl}/habitats/update/${habitatToUpdateSelect.value}`, requestOptions)
    .then(async (response) => {
        if (response.ok) {
            const updatedHabitat = await response.json();
            habitatUpdateNameInput.value = null;
            habitatUpdateContentInput.value = null;
            habitatUpdateImageInput.value = null;
            habitatUpdateConfirmation.innerHTML = `<div><i class="bi bi-check-square-fill text-primary"></i> Vos modifications à l'habitat "${updatedHabitat.name}" ont bien été sauvegardées.</div>`
        } else {
            alert("Vos modifications n'ont pas pu être sauvegardées.");
        }})
    .catch((error) => console.error(error));
}

habitatUpdateButton.addEventListener('click', updateHabitat);

const getSpeciesSelectHtml = async () => {
  const speciesArray = await fetch(`${apiBaseUrl}/animals/species`, { method: "GET", redirect: "follow"})
  .then((response) => (response.json()))
  .catch((error) => console.error(error));
  
  let speciesSelectHtml = '';
  speciesArray.forEach((species) => {
    speciesSelectHtml += `<option value="${species.id}">${species.label}</option>`
  });
  return speciesSelectHtml;
}

animalCreateModalEl.addEventListener('show.bs.modal', async () => {
  animalCreateNameInput.value = null;
  animalCreateSpeciesInput.innerHTML = await getSpeciesSelectHtml();
  animalCreateImageInput.value = null;
  animalCreateButton.addEventListener('click', createAnimal);
});
  
  const createAnimal = async () => {
    const formData = new FormData(animalCreateForm);
    formData.speciesId = +formData.habitatId;
    formData.habitatId = +formData.habitatId;
    
    const token = getConnexionToken();
  
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow'
    };
  
      await fetch(`${apiBaseUrl}/animals`, requestOptions)
      .then(async (response) => {
        if (response.ok) {
          const newAnimal = await response.json();
          console.log(newAnimal);
  
          animalCreateModal.hide();
        } else {
          alert("Le nouveau service n'a pas pu être créé.");
        }
      })
      .catch((error) => console.error(error));
  }
