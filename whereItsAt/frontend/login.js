const logoutButton = document.querySelector('#logout-button');
const emailElem = document.querySelector('#email');
const removeButton = document.querySelector('#remove-button');
const loginButton = document.querySelector('#login-button');

loginButton.addEventListener('click', () => {
    logIn();
});

async function logIn() {
    console.log('Please log in with correct user information');
    // { username: 'yes', password: 'yes' }
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    let data = { username: username, password: password };
    data = JSON.stringify(data)
    /* console.log(data); */

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });

    const content = await response.json(); 
    if (content.success) {
        console.log("content", content)
        sessionStorage.setItem('token', content.token)
        window.location.href = 'validation.html'
    } /* else () => {
        console.log("incorrect login")
    } */
}
