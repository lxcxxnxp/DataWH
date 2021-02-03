//Variables
const logOut = document.getElementById('logOut');
import { basepathClient, basepathServer } from './globals.js';
const welcome = document.getElementById('welcome');
const usuariosLi = document.getElementById('usuariosLi');
const ul = document.getElementById('ul');
const burger = document.getElementById('burger');
const menu = document.getElementById('rigth-nav');

//*Event Listeners
document.addEventListener('DOMContentLoaded',fetchAuth);
burger.addEventListener('click',toogleMenu);
//Funciones

//Funcion para detectar que este logueado, si no lo esta lo mandamos a la pagina de login
async function fetchAuth(){

    const token = JSON.parse(localStorage.getItem('token'));
    const profile = JSON.parse(localStorage.getItem('profile'));

    console.log(profile);
    if(profile == 'User'){

        usuariosLi.remove();
        ul.style.justifyContent = 'space-around';
    }

    if(token === null){

        window.location.href = `${basepathClient}login.html`;
        return;
    }else{

        let fetchLogin = await fetch(`${basepathServer}auth`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    
        let fetchJson = await fetchLogin.json();


        let email = fetchJson.data.email;

        //Mensaje de Bienvenida
        welcome.innerText = `Bienvenido ${email}`;

        if(fetchJson.codigo === 403){
    
            window.location.href = `${basepathServer}login`;
        }
    }
}

function toogleMenu() {
    
    if (burger.className == 'fas fa-bars') {

        burger.className = 'fas fa-times';
        menu.style.display = 'flex';
    }else {
        burger.className = 'fas fa-bars'
        menu.style.display = 'none';
    }
};


//Desloguea usuario, remueve token de local storage y llama de nuevo a la funcion fetchAuth
logOut.addEventListener('click',()=>{

    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    fetchAuth();
})

