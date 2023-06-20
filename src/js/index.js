import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

refs.select.setAttribute('hidden', true);

fetchBreeds()
  .then(data => {
    refs.select.removeAttribute('hidden');
    data.map(({ id, name }) => {
      const markup = `<option value="${id}">${name}</option>`;
      refs.select.insertAdjacentHTML('beforeend', markup);
    });
    new SlimSelect({ select: '.breed-select' });
  })
  .catch(error => {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  })
  .finally(() => {
    refs.loader.classList.replace('loader', 'hidden');
  });

refs.select.addEventListener('change', handlerOption);

function handlerOption(event) {
  refs.catInfo.remove();
  refs.loader.classList.replace('hidden', 'loader');
  const id = event.currentTarget.value;
  fetchCatByBreed(id)
    .then(data => {
      refs.catInfo.removeAttribute('hidden');
      const { url, breeds } = data[0];
      const { name, description, temperament } = breeds[0];
      const markup = `<img class="photo" src="${url}" alt="${name}" width ="600"/>
      <div class="card-info">
      <h1>${name}</h1>
      <p >${description}</p>
      <p ><strong>Temperament:</strong> ${temperament}</p>
      </div>`;
      refs.loader.after(refs.catInfo);
      refs.catInfo.innerHTML = markup;
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    })
    .finally(() => {
      refs.loader.classList.replace('loader', 'hidden');
    });
}
