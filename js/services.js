import { apiBaseUrl } from "./script.js";

const commentList = document.getElementById('service-list');
let commentHtml = '';

async function displayAllServices () {
const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  const servicesArray = await fetch(`${apiBaseUrl}/services`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.error(error));

  for (let i = 0; i < servicesArray.length; i += 1) {
    const service = servicesArray[i];
    const even = (i % 2 === 0);
    commentHtml += `<article ${even ? '': 'class="bg-dark text-white"'}>
        <div class="container p-4">
            <h2 class="text-center text-primary">${service.name}</h2>
            <div class="row row-cols-2 align-items-center">
                <div class="col">
                    ${even ? `<p>${service.description}</p>` : '<img src="../images/hero-scene-background-large.jpg" alt="une image trop cool" class="w-100 rounded"></img>'}
                </div>
                <div class="col">
                    ${!even ? `<p>${service.description}</p>` : '<img src="../images/hero-scene-background-large.jpg" alt="une image trop cool" class="w-100 rounded"></img>'}
                </div>
            </div>
        </div>
    </article>`
  };

  commentList.innerHTML = commentHtml;
}

displayAllServices();