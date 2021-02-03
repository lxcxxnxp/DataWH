const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const submitBtn = document.getElementById('btn');
const errorsMessage = document.getElementById('errors');
const input = document.getElementsByClassName('form-control');
const title = document.getElementById('title-dataw');

//Variable Global
import { basepathServer } from './globals.js';
import { basepathClient } from './globals.js';


//Event Listeners
document.addEventListener('DOMContentLoaded',alreadyLogIn);
submitBtn.addEventListener('click',logInUser);
input[0].addEventListener('keydown',()=>{if(errorsMessage.innerText != ''){errorsMessage.innerText = '';}});
input[1].addEventListener('keydown',()=>{if(errorsMessage.innerText != ''){errorsMessage.innerText = '';}});

//Funciones



let typedOptions = {
    strings: ['Welcome to Data Warehouse','Bienvenido a Data Warehouse'],
    typeSpeed: 100,
    startDelay: 650,
    smartBackspace: true ,
    backSpeed: 50,
    showCursor: false
};
let typed = new Typed(title, typedOptions);


//Funcion para detectar que no este logueado, si lo esta no puede acceder al login
function alreadyLogIn(){

    const token = JSON.parse(localStorage.getItem('token'));

    if(token != null){

        window.location.href = `${basepathClient}home.html`;
        return;
    }
}

//Enviar form de login a servidor para acceder a homepage
async function logInUser(event){

    // Prevent form to submit
    event.preventDefault();

    let email = inputEmail.value;
    let password = inputPassword.value;
    
    //Codigo para enviar datos
    let user = {
        email : email,
        password: password
    }

    let fetchLogin = await fetch(`${basepathServer}login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    let respFetchLogin = await fetchLogin.json();

    //Si existe error dentro de la validacion de joi en servidor
    if(respFetchLogin.details){

        errorsMessage.innerText = respFetchLogin.details[0].message;

      //Si no existe en base de datos  
    } else if(respFetchLogin.codigo == 403){

        errorsMessage.innerText = respFetchLogin.mensaje;

    } else {

        //RECIBO EL TOKEN y PROFILE
        let profile = respFetchLogin.mensaje.profile;
        let id = respFetchLogin.mensaje.id;
        let token = respFetchLogin.data;
        // Guardo el token en localStorage
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem('profile',JSON.stringify(profile));
        localStorage.setItem('id',JSON.stringify(id));


        window.location.href = `${basepathClient}home.html`;
    }
    
}
