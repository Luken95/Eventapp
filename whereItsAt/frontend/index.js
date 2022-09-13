const usernameElem = document.querySelector('#username');
const emailElem = document.querySelector('#email');
const password = document.querySelector('#password');
const createButtonElem = document.querySelector('#create-button');

const loginUsername = document.querySelector('#login-username');
const loginPassword = document.querySelector('#login-password');
const loginButton = document.querySelector('#login-button');
const concertsContainer = document.getElementById('concerts-container');

async function importConcerts() {
    let data = await fetch('http://localhost:3000/api/ticketsdata');
    let res = await data.json();
    let tickets = await res.events;
    console.log(tickets);
    tickets.forEach(ticket => {
        updateUI(ticket)
    });
}

importConcerts();

function updateUI(ticket) {
    console.log(ticket);
    //skapa element som vår ticket kan bo i
    let article = document.createElement('article');

    //eventlyssnare som tar oss till ticket-sidan
    article.addEventListener('click', () => {
        console.log('klickade på ' + ticket.id);
        localStorage.setItem('ticket', JSON.stringify(ticket));
        window.location.href = 'ticket.html';
    })

    article.setAttribute('id', 'ticket' + ticket.id);
    article.innerHTML += `<h3>${ticket.title}</h3>`
    article.innerHTML += `<p>Plats: ${ticket.location}</p>`
    article.innerHTML += `<p> Tid: ${ticket.time}</p>`
 /* article.innerHTML += `<p id="date">${ticket.date}</p>` */
    article.innerHTML += `<p id="pris"> Pris: ${ticket.price} SEK</p>`
    article.innerHTML += `<p></p>`
    concertsContainer.appendChild(article);
    
    
    article.setAttribute('id', 'ticket' + ticket.id);
    article.innerHTML += `<p id="date">${ticket.date}</p>`
    concertsContainer.appendChild(article);
}

async function createAccount(accountInformation) {
    //var noggrann med vilken port du satt din lokala webbserver på
    const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        body: JSON.stringify(accountInformation),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

async function login(loginInformation) {
    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: JSON.stringify(loginInformation),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
        window.location.href = 'http://localhost:5000/loggedin.html';
    }
}

createButtonElem.addEventListener('click', () => {
    let accountInformation = {
        username: usernameElem.value,
        email: emailElem.value,
        password: password.value
    }

    createAccount(accountInformation);
    console.log(`Kontouppgifter: ${JSON.stringify(accountInformation)}`);
    //console.log('Kontouppgifter: ' + accountInformation);
});

loginButton.addEventListener('click', () => {
    let loginInformation = {
        username: loginUsername.value,
        password: loginPassword.value
    }

    login(loginInformation);
});