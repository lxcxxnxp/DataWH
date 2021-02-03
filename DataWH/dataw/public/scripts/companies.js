//Elementos
const token = JSON.parse(localStorage.getItem('token'));

//Nueva compañia
const name = document.getElementById('name');
const address = document.getElementById('address');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const selectPicker1 = document.getElementsByClassName('selectpicker')[1];
const errors = document.getElementById('errors');
const butonSubmit = document.getElementById('btnSubmit');


//Lista de companias
const companiesTable = document.getElementById('companies-table');

//Modal de update de compania
const updateName = document.getElementById('update_name');
const updateAddress = document.getElementById('update_address');
const updateEmail = document.getElementById('update_email');
const updatePhone = document.getElementById('update_phone');
const selectPicker2 = document.getElementsByClassName('selectpicker')[0];
const selectedCity = document.getElementById('selectedValue');
const updateAlert = document.getElementById('update-alert');
const modalBody = document.getElementsByClassName('modal-body');
const submitUpdate = document.getElementById('updateOk');

//Modal de delete de compania
const submitDelete = document.getElementById('deleteOk');



//Variable Global
import { basepathServer } from './globals.js';


//EventListeners
document.addEventListener('DOMContentLoaded',getCompanies);
document.addEventListener('DOMContentLoaded',appendCitiesToSelect);
butonSubmit.addEventListener('click',createCompany);
submitUpdate.addEventListener('click',updateCompany);
submitDelete.addEventListener('click',deleteCompany);

//Functions

//Obtener todas las compañias
async function getCompanies(params) {
    
    let fetchCompanies = await fetch(`${basepathServer}companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allCompanies = await fetchCompanies.json();
    let companies = allCompanies.data;
    console.log(companies);

    for(let i=0; i<companies.length; i++){

        let name = companies[i].name;
        let email = companies[i].email;
        let address = companies[i].address;
        let phone = companies[i].phone;
        let city;
        if(companies[i].city[0] == undefined){
            city = 'City removed';
        }else{
            city = companies[i].city[0].name;
        }
        
        let companyId = companies[i]._id;

        createCompanyRow(name, address, email, phone, city, companyId);
    }
}

function createCompanyRow(name, address, email, phone, city, companyId){

    let companyRow = document.createElement('div');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    let div5 = document.createElement('div');
    let divEdits = document.createElement('div');
    let iEdit = document.createElement('i');
    let iDelete = document.createElement('i');

    companyRow.className = 'company-row';
    companyRow.id = companyId;
    div1.className = 'company-info';
    div2.className = 'company-info';
    div3.className = 'company-info';
    div4.className = 'company-info';
    div5.className = 'company-info';

    divEdits.className = 'company-edit';
    iEdit.className = 'fas fa-user-edit';
    iDelete.className = 'fas fa-trash-alt';
    iDelete.setAttribute('data-target','#deleteModal');
    iDelete.setAttribute('data-toggle','modal');
    iEdit.setAttribute('data-target','#updateModal');
    iEdit.setAttribute('data-toggle','modal');

    div1.innerText = name;
    div2.innerText = address;
    div3.innerText = email;
    div4.innerText = phone;
    div5.innerText = city;

    companyRow.appendChild(div1);
    companyRow.appendChild(div2);
    companyRow.appendChild(div3);
    companyRow.appendChild(div4);
    companyRow.appendChild(div5);

    divEdits.appendChild(iEdit);
    divEdits.appendChild(iDelete);
    companyRow.appendChild(divEdits);
    companiesTable.appendChild(companyRow);

    iEdit.addEventListener('click',(event)=>{

        let {name,address,email,phone,city,id} = infoCompanyByClick(event);

        
        // //Paso todos los datos de la compania al modal donde se va a actualizar
        updateName.value = name;
        updateAddress.value = address;
        updateEmail.value = email;
        updatePhone.value = phone;
        
        //Le doy el valor de la ciudad actual al option con atributo selected.
        selectedCity.innerText = city;

        // Para refrescar el elemento select una vez que previamente le cargamos los options de ciudades.
        $('.selectpicker').selectpicker('refresh');


        // Le paso el id al atributo id del modal donde se va a realizar la accion de eliminar al usuario
        modalBody[0].id = id;

    });

    iDelete.addEventListener('click',(event)=>{

        //Obtengo los datos del usuario clickeado para borrar
        let {name,id} = infoCompanyByClick(event);

        // Le paso el id al atributo id del modal donde 
        // se va a realizar la accion de eliminar al usuario
        modalBody[1].id = id;

        modalBody[1].innerText = `Esta seguro que desea eliminar a ${name}?`;

    });

};

//Obtener info de usuario al clickear sobre editar o eliminar
function infoCompanyByClick(event){

    let name = event.currentTarget.parentNode.parentNode.children[0].innerText;
    let address = event.currentTarget.parentNode.parentNode.children[1].innerText;
    let email = event.currentTarget.parentNode.parentNode.children[2].innerText;
    let phone = event.currentTarget.parentNode.parentNode.children[3].innerText;
    let city = event.currentTarget.parentNode.parentNode.children[4].innerText;
    let id = event.currentTarget.parentNode.parentNode.id;
    
    let company = {
        name: name,
        address: address,
        email: email,
        phone: phone,
        city: city,
        id: id
    }

    return company;
}

async function appendCitiesToSelect(){

    let fetchCities = await fetch(`${basepathServer}cities`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let allCities = await fetchCities.json();
    let cities = allCities.data;

    cities.forEach(element => {

        let option = document.createElement('option');
        option.innerText = element.name;
        selectPicker1.appendChild(option);
    });
    cities.forEach(element => {

        let option = document.createElement('option');
        option.innerText = element.name;
        selectPicker2.appendChild(option);
    });

    // Para refrescar el elemento select una vez que previamente le cargamos los options de ciudades.
    $('.selectpicker').selectpicker('refresh');

};

async function createCompany(event) {

    // Previene form de submit
    event.preventDefault();
    try{

        let cityName = selectPicker1.value;
        if(cityName == 'Busque una ciudad') throw "Ingrese una ciudad";

        let newCompany = {
            name: name.value,
            address: address.value,
            email: email.value,
            phone: phone.value
        };
        console.table(newCompany);
    
        let registerCompany = await fetch(`${basepathServer}newCompany/${cityName}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newCompany)
        });
    
        let data = await registerCompany.json();
    
        console.log(data);
        
        if(data.codigo === 400 & !data.data[0]){
            
            errors.textContent = data.mensaje;
    
        //Si no existe en base de datos  
        }else if(data.data[0]){

            errors.textContent = data.data[0].message;
            
        }else{
            location.reload();
        }

    }catch(e){

        errors.textContent = e;
    }
}

async function updateCompany(event){
    //Recupero el id de la compania a actualizar que fue previamente aplicado
    // al atributo id del modal donde se va a actualizar
    let id = event.currentTarget.parentNode.parentNode.children[1].id ;
    let cityName = selectPicker2.value;
    console.log(cityName);

    let updateCompany= {
        name: updateName.value,
        address: updateAddress.value,
        email: updateEmail.value,
        phone: updatePhone.value

    };
    console.log(cityName)
    
    let fetchUpdate = await fetch(`${basepathServer}updateCompany/${id}&${cityName}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateCompany)
    });
    
    let data = await fetchUpdate.json();
    console.log(data);

    if(!data.error){

        window.location.reload();
    }else{

        updateAlert.style.display = 'unset';
        updateAlert.textContent = data.mensaje[0].message;
    }
};

async function deleteCompany(event){
    //Recupero el id de la compania a actualizar que fue previamente aplicado
    // al atributo id del modal donde se va a actualizar
    let id = event.currentTarget.parentNode.parentNode.children[1].id ;

    let fetchDelete = await fetch(`${basepathServer}deleteCompany/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let data = await fetchDelete.json();
    console.log(data);

    if(!data.error){

        window.location.reload();
        
    }else{
        alert(data.error);
    }
}
