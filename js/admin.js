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

const animalUpdateCards = document.getElementById('animal-update-cards');

const animalUpdateModalEl = document.getElementById('update-animal-modal');
const animalUpdateModal = new bootstrap.Modal(animalUpdateModalEl);
const animalUpdateForm = document.getElementById('animal-update-form');
const animalUpdateNameInput = document.getElementById('animal-update-name-input');
const animalUpdateSpeciesInput = document.getElementById('animal-update-species-input');
const animalUpdateHabitatInput = document.getElementById('animal-update-habitat-input');
const animalUpdateImageInput = document.getElementById('animal-update-image-input');
const animalUpdateButton = document.getElementById('animal-update-button');
let animalToUpdate;

const animalDeleteModalEl = document.getElementById('delete-animal-modal');
const animalDeleteModal = new bootstrap.Modal(animalDeleteModalEl);
const animalDeleteWarning = document.getElementById('delete-animal-modal-warning');
const animalDeleteButton = document.getElementById('delete-animal-button');
let animalToDelete;

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

await preloadSelectedHabitat(1);

habitatUpdateSelect.addEventListener('change', async (event) => {
    const habitatId = event.target.value;
    await preloadSelectedHabitat(habitatId);
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
  .then((response) => response.json())
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
          generateAnimalCards()
          animalCreateModal.hide();
        } else {
          alert("Le nouvel animal n'a pas pu être créé.");
        }
      })
      .catch((error) => console.error(error));
  }

const generateAnimalCards = async () => {
  const animalsArray = await fetch(`${apiBaseUrl}/animals`, { method: "GET", redirect: "follow" })
  .then((response) => response.json())
  .catch((error) => console.error(error));

  let animalCardsHtml = "";
  animalsArray.forEach((animal) => {
    animalCardsHtml += `<div class="col">
      <div class="card bg-dark text-light shadow-sm">
        <img src="${apiBaseUrl}/animals/image/${animal.imageId}" alt="${animal.species.label}" class="card-image-top"></img>
        <div class="card-body">
          <p class="card-text">${animal.name}</p>
          <p class="card-text">${animal.habitat.name}</p>
          <p class="card-text">${animal.species.label}</p>
          <div>
            <button type="button" class="btn btn-outline-light me-3" data-bs-toggle="modal" data-bs-target="#update-animal-modal" data-bs-animal-id="${animal.id}"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="btn btn-outline-light me-3" data-bs-toggle="modal" data-bs-target="#delete-animal-modal" data-bs-animal-id="${animal.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  })

  animalUpdateCards.innerHTML = animalCardsHtml;
}

await generateAnimalCards();

animalUpdateModalEl.addEventListener('show.bs.modal', async (event) => {
  const button = event.relatedTarget;
  const animalId = button.getAttribute('data-bs-animal-id');
  animalToUpdate = await fetch(`${apiBaseUrl}/animals/${animalId}`, { method: "GET", redirect: "follow"})
  .then((response) => (response.json()))
  .catch((error) => console.error(error));
  animalUpdateNameInput.value = animalToUpdate.name;
  animalUpdateSpeciesInput.innerHTML = await getSpeciesSelectHtml();
  animalUpdateSpeciesInput.value = animalToUpdate.species.id;
  animalUpdateHabitatInput.value = animalToUpdate.habitat.id;
  animalUpdateImageInput.value = null;
  animalUpdateButton.addEventListener('click', updateAnimal);
});

const updateAnimal = async () => {
  const formData = new FormData(animalUpdateForm);
  formData.speciesId = +formData.habitatId;
  formData.habitatId = +formData.habitatId;
  
  const token = getConnexionToken();

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  };

    await fetch(`${apiBaseUrl}/animals/${animalToUpdate.id}`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        generateAnimalCards();
        animalUpdateModal.hide();
      } else {
        alert("Vos modifications n'ont pas pu être sauvegardées.");
      }
    })
    .catch((error) => console.error(error));
}

animalDeleteModalEl.addEventListener('show.bs.modal', async (event) => {
  const button = event.relatedTarget;
  const animalId = button.getAttribute('data-bs-animal-id');
  animalToDelete = await fetch(`${apiBaseUrl}/animals/${animalId}`, { method: "GET", redirect: "follow"})
  .then((response) => (response.json()))
  .catch((error) => console.error(error));
  animalDeleteWarning.innerHTML = `Vous vous apprêtez à supprimer l'animal "${animalToDelete.name}".`
  animalDeleteButton.addEventListener('click', deleteAnimal);
})

const deleteAnimal = async () => {
  const token = getConnexionToken();

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(`${apiBaseUrl}/animals/${animalToDelete.id}`, requestOptions)
  .then((response) => {
    if (response.ok) {
      generateAnimalCards();
      animalDeleteModal.hide();
    } else {
      alert(`L'animal "${animalToDelete.name}" n'a pas pu être supprimé.`);
    }
  })
  .catch((error) => console.error(error));
}