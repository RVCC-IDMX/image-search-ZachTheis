const form = document.querySelector('.search-form');
const template = document.querySelector('#template');
const container = document.querySelector('.container');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const formData = new FormData(event.target);

  const response = await fetch('/.netlify/functions/unsplash-search', {
    method: 'POST',
    body: JSON.stringify({
      query: formData.get('query'),
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  /*
    Loop through the results[] array. For each result, create a clone of the
    template and append it to the DOM element with the .container class.
  */
  console.log(response.results);
  response.results.forEach((result) => {
    const clone = template.content.cloneNode(true);
    const dataObj = result;
    const postImg = clone.querySelector('.post__img');
    postImg.src = dataObj.urls.small;
    postImg.alt = dataObj.alt_description;

    /*
    Add an attribution statement below the image using the
    postUser element and the photographer's name from dataObj
   */
    const user = clone.querySelector('.post__user');
    let attribution = 'Photo by: ';
    const userName = dataObj.user.username;
    attribution = attribution.concat(userName);
    user.innerText = attribution;

    /*
    Check the description of the post. If it's not null and less than 100 characters,
    add the description from dataObj to the post. If it's more than 100 characters,
    add the first 100 characters of the description from dataObj to the post followed by
    an ellipsis (...)
    */
    const postDesc = clone.querySelector('.post__desc');
    let description = dataObj.description;
    if (description !== null && description.length > 100) {
      description = description.slice(0, 100);
      description = description.concat('...');
    }
    postDesc.innerText = description;

    container.appendChild(clone);
  });
});
