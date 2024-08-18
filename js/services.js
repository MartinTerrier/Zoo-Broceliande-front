import { apiBaseUrl, getConnexionToken, manageRoleElements } from "./script.js";

const serviceList = document.getElementById('service-list');
const serviceUpdateModalEl = document.getElementById(`edit-service-modal`);
const serviceUpdateModal = new bootstrap.Modal(serviceUpdateModalEl);
const serviceDeleteModalEl = document.getElementById('delete-service-modal');
const serviceDeleteModal = new bootstrap.Modal(serviceDeleteModalEl);
const serviceCreateModalEl = document.getElementById('create-service-modal');
const serviceCreateModal = new bootstrap.Modal(serviceCreateModalEl);
const serviceUpdateForm = document.getElementById(`service-update-form`);
const serviceUpdateNameInput = document.getElementById('service-update-name-input');
const serviceUpdateContentInput = document.getElementById('service-update-content-input');
const serviceUpdateButton = document.getElementById(`service-update-button`);
const serviceDeleteWarning = document.getElementById('delete-service-modal-warning');
const serviceDeleteButton = document.getElementById('delete-service-button');
const serviceCreateForm = document.getElementById('service-create-form');
const serviceCreateNameInput = document.getElementById('service-create-name-input');
const serviceCreateContentInput = document.getElementById('service-create-content-input');
const serviceCreateButton = document.getElementById('service-create-button');
let serviceToUpdate;

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

const servicesArray = await fetch(`${apiBaseUrl}/services`, requestOptions)
  .then((response) => response.json())
  .catch((error) => console.error(error));

async function displayAllServices () {

  let serviceHtml = '';

  servicesArray.forEach((service) => {
    const even = (service.id % 2 === 0);
    serviceHtml += `<article ${even ? '': 'class="bg-dark text-white"'}>
        <div class="action-image-buttons">
          <button type="button" id="edit-service-button-${service.id}" class="btn btn-outline-${even ? 'dark': 'secondary'} me-3" data-show="employee" data-bs-toggle="modal" data-bs-target="#edit-service-modal" data-bs-service-id="${service.id}"><i class="bi bi-pencil-square"></i></button>
          <button type="button" id="delete-service-button-${service.id}" class="btn btn-outline-${even ? 'dark': 'secondary'} me-3" data-show="admin" data-bs-toggle="modal" data-bs-target="#delete-service-modal" data-bs-service-id="${service.id}"><i class="bi bi-trash"></i></button>
        </div>
        <div class="container p-4">
            <h2 id = 'service-name-${service.id}' class="text-center text-primary">${service.name}</h2>
            <div class="row row-cols-2 align-items-center">
                <div class="col">
                    ${even ? `<p id='service-description-${service.id}'>${service.description}</p>` : `<img src="../images/services-${service.id}-large.jpg" alt="une image trop cool" class="w-100 rounded"></img>`}
                </div>
                <div class="col">
                    ${!even ? `<p id='service-description-${service.id}'>${service.description}</p>` : `<img src="../images/services-${service.id}-large.jpg" alt="une image trop cool" class="w-100 rounded"></img>`}
                </div>
            </div>
        </div>
    </article>`;
  });

  serviceList.innerHTML = serviceHtml;
  manageRoleElements();
}

displayAllServices();

serviceUpdateModalEl.addEventListener('show.bs.modal', (event) => {
  const button = event.relatedTarget;
  const serviceId = button.getAttribute('data-bs-service-id');
  serviceToUpdate = servicesArray.find((service) => (service.id === +serviceId));
  serviceUpdateNameInput.value = serviceToUpdate.name;
  serviceUpdateContentInput.innerHTML = serviceToUpdate.description;
  serviceUpdateButton.addEventListener('click', updateService);
});

const updateService = async () => {
    const serviceName = document.getElementById(`service-name-${serviceToUpdate.id}`);
    const serviceDescription = document.getElementById(`service-description-${serviceToUpdate.id}`);
    const formData = new FormData(serviceUpdateForm);
    const formDataName = formData.get('name');
    const formDataDescription = formData.get('description');
    const token = getConnexionToken();
    
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const urlEncoded = new URLSearchParams();
    urlEncoded.append('name', formDataName);
    urlEncoded.append('description', formDataDescription);

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: urlEncoded,
      redirect: 'follow'
    };

    await fetch(`${apiBaseUrl}/services/${serviceToUpdate.id}`, requestOptions)
    .then((response) => {
      if (response.ok) {
        serviceName.innerHTML = formDataName;
        serviceDescription.innerHTML = formDataDescription;
        serviceUpdateModal.hide();
      } else {
        alert("Vos modifications n'ont pas pu être sauvegardées.");
      }
    })
    .catch((error) => console.error(error));
}

serviceDeleteModalEl.addEventListener('show.bs.modal', (event) => {
  const button = event.relatedTarget;
  const serviceId = button.getAttribute('data-bs-service-id');
  const serviceToUpdate = servicesArray.find((service) => (service.id === Number(serviceId)));
  serviceDeleteWarning.innerHTML = `Vous vous apprêtez à supprimer le service "${serviceToUpdate.name}".`
  serviceDeleteButton.addEventListener('click', deleteService);
})

const deleteService = async () => {}

const createService = async () => {
  const formData = new FormData(serviceCreateForm);
  const formDataName = formData.get('name');
  const formDataDescription = formData.get('description');
  const token = getConnexionToken();

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
   myHeaders.append('Authorization', `Bearer ${token}`);

  const urlEncoded = new URLSearchParams();
  urlEncoded.append('name', formDataName);
  urlEncoded.append('description', formDataDescription);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlEncoded,
    redirect: 'follow'
  };

  await fetch(`${apiBaseUrl}/services`, requestOptions)
    .then((response) => {
      if (response.ok) {
        servicesArray.push(response);
        displayAllServices();
        serviceCreateModal.hide();
      } else {
        alert("Le nouveau service n'a pas pu être créé.");
      }
    })
    .catch((error) => console.error(error));
}

serviceCreateButton.addEventListener("click", createService);
