import { apiBaseUrl, getConnexionToken, manageRoleElements } from "./script.js";

const serviceList = document.getElementById('service-list');
const modalContainer = document.getElementById('modal-container');

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

const servicesArray = await fetch(`${apiBaseUrl}/services`, requestOptions)
  .then((response) => response.json())
  .catch((error) => console.error(error));

async function displayAllServices () {

  let serviceHtml = '';
  let modalHtml = '';

  servicesArray.forEach((service) => {
    const even = (service.id % 2 === 0);
    serviceHtml += `<article ${even ? '': 'class="bg-dark text-white"'}>
        <div class="action-image-buttons">
          <button type="button" id="edit-service-button-${service.id}" class="btn btn-outline-${even ? 'dark': 'secondary'} me-3" data-show="employee" data-bs-toggle="modal" data-bs-target="#edit-service-modal-${service.id}"><i class="bi bi-pencil-square"></i></button>
          <button type="button" id="delete-service-button-${service.id}" class="btn btn-outline-${even ? 'dark': 'secondary'} me-3" data-show="admin" data-bs-toggle="modal" data-bs-target="#delete-service-modal-${service.id}"><i class="bi bi-trash"></i></button>
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

    modalHtml += `<div class="modal fade" id="edit-service-modal-${service.id}" tabindex="-1" aria-labelledby="edit-service-modal-${service.id}-label" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title fs-5" id="edit-service-modal-${service.id}-label">Edition du service</h2>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id='service-${service.id}-update-form'>
                    <div class="mb-3">
                      <label for="service-${service.id}-name-input" class="form-label">Nom</label>
                      <input type="text" class="form-control" id="service-${service.id}-name-input" value="${service.name}" name="name"> 
                    </div>
                    <div class="mb-3">
                      <label for="service-${service.id}-content-input" class="form-label">Description</label>
                      <textarea class="form-control" id="service-${service.id}-content-input"  name="description">${service.description}</textarea>
                    </div>
                    <div class="text-center">
                        <button type="button" id='service-${service.id}-update-button' class="btn btn-primary text-white">Enregistrer</button>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>`;
  });

  serviceList.innerHTML = serviceHtml;
  modalContainer.innerHTML = modalHtml;
  manageRoleElements();
}

displayAllServices();

servicesArray.forEach((service) => {
  const serviceUpdateModal = new bootstrap.Modal(document.getElementById(`edit-service-modal-${service.id}`));
  const serviceName = document.getElementById(`service-name-${service.id}`);
  const serviceDescription = document.getElementById(`service-description-${service.id}`);
  const serviceUpdateForm = document.getElementById(`service-${service.id}-update-form`);
  const serviceUpdateButton = document.getElementById(`service-${service.id}-update-button`);
    
  const updateService = async () => {
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

    await fetch(`${apiBaseUrl}/services/${service.id}`, requestOptions)
    .then((response) => {
      if (response.ok) {
        serviceName.innerHTML = formDataName;
        serviceDescription.innerHTML = formDataDescription;
        serviceUpdateModal.hide();
      } else {
        alert("Vos modifiations n'ont pas pu être sauvegardées.");
      }
    })
    .catch((error) => console.error(error));
  }

  serviceUpdateButton.addEventListener('click', updateService);
});