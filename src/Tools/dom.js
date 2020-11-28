import scoreAPI from './api';

const Dom = (() => {
  const nameform = () => {
    const form = document.createElement('div');
    const p = document.createElement('p');
    form.setAttribute('id', 'form');
    form.className = 'form';
    form.style.position = 'absolute';
    form.style.top = '240px';
    form.style.left = '500px';
    form.style.width = '300px'
    form.innerHTML = `
      <input class="formInput" type="search" id="input" placeholder="Enter your name" aria-label="Search" required/></br>
      <button class="formButton" type="submit" id="submit"> Submit Score</button>
    `;
    form.appendChild(p);
    const body = document.body.appendChild(form);
    return body;
  };

  const submitButtonAction = (score) => {
    const input = document.querySelector('#input');
    const form = document.querySelector('#form');
    const button = document.querySelector('#submit');
    const p = document.querySelector('p');
    setTimeout(() => {
      button.onclick = () => {
        if (input.value !== '') {
          form.innerHTML = '<h3 id="submitting">Waiting... </h3>';
          scoreAPI.submit(input.value, score).then((response) => {
            form.innerHTML = `<h3 id="response">${response.result} </h3>`;
          });
        } else {
          p.innerHTML = 'Enter a valid name';
        }
      };
    }, 1000);
  };

  const removeDomElements = () => {
    const form=document.querySelector('#form');
    if(form){
      form.remove()
    }
  };

  return {
    nameform,
    submitButtonAction,
    removeDomElements,
  };
})();

export default Dom;