import { apiBaseUrl } from "./script.js";

const commentList = document.getElementById('comment-list');
let commentHtml = '';

async function displayComments () {
const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  const commentsArray = await fetch(`${apiBaseUrl}/comments/display`, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.error(error));

  commentsArray.forEach((comment) => {
    commentHtml += `<article>
      <p>${comment.content}</p>
      <p><em>– ${comment.alias}</em></p>
      </article>`
  });

  commentList.innerHTML = commentHtml;
}

displayComments();