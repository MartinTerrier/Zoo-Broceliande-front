import { apiBaseUrl, getConnexionToken } from "./script.js";

const habitatUpdateForm = document.getElementById('habitat-update-form');
const habitatToUpdateSelect = document.getElementById('habitat-update-select');
const habitatUpdateButton = document.getElementById('habitat-update-button');
const habitatUpdateConfirmation = document.getElementById('habitat-update-confirmation');
const habitatUpdateNameInput = document.getElementById('habitat-update-name-input');
const habitatUpdateContentInput = document.getElementById('habitat-update-content-input');
const habitatUpdateImageInput = document.getElementById('habitat-update-image-input');

const updateHabitat = async () => {
    console.log('Event listener attached to habitat update button.');
    
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
        }
    });
}

habitatUpdateButton.addEventListener('click', updateHabitat);
