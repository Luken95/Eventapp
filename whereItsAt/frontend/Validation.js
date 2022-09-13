const buttonElem = document.querySelector('#verify-button');
const verifyElem = document.querySelector('#verify-ticket');

async function verify(e) {
    /* debugger; */
    e.preventDefault(); 
    const uniqueKey = verifyElem.value;
    console.log(uniqueKey);
    let token = sessionStorage.getItem("token")

    let response = await fetch("http://localhost:3000/api/verify", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueKey }),
    });
    if(response.status == 401) {
        alert("Invalid token, please login again");
        window.location.href = 'login.html'
    }
    const data = await response.json();
    alert(data);
}

buttonElem.addEventListener('click', (e) => {
    verify(e);
});


