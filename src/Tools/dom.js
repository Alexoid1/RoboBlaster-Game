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
    form.style.width = '300px';
    const input = document.createElement('input');
    input.type='search';
    input.placeholder = ' Enter your name';
    input.required = true;
    input.style.width = '200px';
    input.style.margin = 'auto';
    input.style.height = '50px';
    input.style.border = '3px solid silver';
    input.style.borderRadius = '10px';
    input.id='input';
    form.appendChild(input);
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Submit Score';
    button.id = 'submit';
    button.style.width = '170px';
    button.style.color = 'white';
    button.style.margin = 'auto';
    button.style.marginTop = '14px';
    button.style.height = '35px';
    button.style.borderRadius = '10px';
    button.style.background = 'rgb(23, 131, 255)';
    button.style.fontSize = '18px';
    button.style.fontWeight = 'bold';
    button.style.fontFamily = 'Arial, Helvetica, sans-serif';
    form.appendChild(button);
    
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
          form.innerHTML = '';
          const h3 = document.createElement('h3');
          h3.textContent = 'Waiting...';
          h3.id = 'submitting';
          form.appendChild(h3);
          scoreAPI.submit(input.value, score).then((response) => {
            h3.textContent = response.result;
          });
        } else {
          p.innerHTML = 'Enter a valid name';
        }
      };
    }, 1000);
  };

  const removeDomElements = () => {
    const form = document.querySelector('#form');
    if (form) {
      form.remove();
    }
  };

  return {
    nameform,
    submitButtonAction,
    removeDomElements,
  };
})();

export default Dom;