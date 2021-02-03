//Elementos
const token = JSON.parse(localStorage.getItem('token'));
//Variable Global
import { basepathServer } from './globals.js';


//Nuevo contacto
const newContactBtn = document.getElementById('createContact');
const newContactContainer = document.getElementById('newContactContainer');
const selectCompany = document.getElementsByClassName('selectpicker')[0];
const name = document.getElementById('name');
const lastname = document.getElementById('lastname');
const position = document.getElementById('position');
const email = document.getElementById('email');
const company = document.getElementById('company');
const selectRegion = document.getElementById('region');
const selectCountry = document.getElementById('country');
const selectCity = document.getElementById('city');
let address = document.getElementById('address');
let interest = document.getElementById('interest');
let rangeOutput = document.getElementById('range-span');
const phone = document.getElementById('phone');
const phonePreference = document.getElementById('phonePreference');
const whatsapp = document.getElementById('whatsapp');
const whatsappPreference = document.getElementById('whatsappPreference');
const instagram = document.getElementById('instagram');
const instagramPreference = document.getElementById('instagramPreference');
const facebook = document.getElementById('facebook');
const facebookPreference = document.getElementById('facebookPreference');
const linkedin = document.getElementById('linkedin');
const linkedinPreference = document.getElementById('linkedinPreference');
const btnSubmit = document.getElementById('btnSubmit');
const errors = document.getElementById('errors');

//Tabla de contactos
let contactTable = document.getElementById('contacts-table');
let resetTable = document.getElementById('reset-table');

//Borrar contactos seleccionados
let deleteContactsBtn = document.getElementById('deleteContacts');
deleteContactsBtn.innerText = "Borrar contactos seleccionados (0)";
let selectedContacts = [];
let selectedCounter = 0;
//Modal de borrado de contacto
const deleteBody = document.getElementById('deleteBody');
const submitDeleteContacts = document.getElementById('deleteOk');

//Modal de actualizacion de usuario

let loginForm = document.getElementsByClassName('loginForm')[1];
const updateContactContainer = document.getElementById('updateContactContainer');
const selectCompanyUpdate = document.getElementsByClassName('selectpicker')[1];
const nameUpdate = document.getElementById('updatename');
const lastnameUpdate = document.getElementById('updatelastname');
const positionUpdate = document.getElementById('updateposition');
const emailUpdate = document.getElementById('updateemail');
const companyUpdate = document.getElementById('updatecompany');
const selectRegionUpdate = document.getElementById('updateregion');
const selectCountryUpdate = document.getElementById('updatecountry');
const selectCityUpdate = document.getElementById('updatecity');
const addressUpdate = document.getElementById('updateaddress');
let interestUpdate = document.getElementById('updateinterest');
let rangeOutputUpdate = document.getElementById('update-range-span');
let phoneUpdate = document.getElementById('updatephone');
let phonePreferenceUpdate = document.getElementById('updatephonePreference');
let whatsappUpdate = document.getElementById('updatewhatsapp');
let whatsappPreferenceUpdate = document.getElementById('updatewhatsappPreference');
let instagramUpdate = document.getElementById('updateinstagram');
let instagramPreferenceUpdate = document.getElementById('updateinstagramPreference');
let facebookUpdate = document.getElementById('updatefacebook');
let facebookPreferenceUpdate = document.getElementById('updatefacebookPreference');
let linkedinUpdate = document.getElementById('updatelinkedin');
let linkedinPreferenceUpdate = document.getElementById('updatelinkedinPreference');
let btnSubmitUpdate = document.getElementById('updatebtnSubmit');
let errorsUpdate = document.getElementById('updateerrors');

//Ordenar informacion
let sortByContact = document.getElementById('sort-contact');
let sortByCountry = document.getElementById('sort-country');
let sortByCompany = document.getElementById('sort-company');
let sortByPosition = document.getElementById('sort-position');
let sortByInterest = document.getElementById('sort-interest');

//Buscador de contactos
let inputContact = document.getElementById('input-find-contact');
let findContact = document.getElementById('find-contact');


//Event Listener

document.addEventListener('DOMContentLoaded',appendCompaniesToSelects);
document.addEventListener('DOMContentLoaded',appendRegionsToSelects( selectRegion, selectCountry, selectCity ));
document.addEventListener('DOMContentLoaded',appendRegionsToSelects( selectRegionUpdate, selectCountryUpdate, selectCityUpdate ));
document.addEventListener('DOMContentLoaded',getContacts);
document.addEventListener('DOMContentLoaded',deleteAllSelectedFromLocal);
interest.addEventListener("change",()=>{ rangeOutputValue(interest, rangeOutput) });
interestUpdate.addEventListener("change",()=>{ rangeOutputValue(interestUpdate, rangeOutputUpdate) });
newContactBtn.addEventListener('click',() => newContactContainer.style.display = 'flex');
btnSubmit.addEventListener('click', createNewContact);
btnSubmitUpdate.addEventListener('click',updateContact);
deleteContactsBtn.addEventListener('click',textDelete);
submitDeleteContacts.addEventListener('click',deleteSelectedContacts);
findContact.addEventListener('click',findContacts);
resetTable.addEventListener('click', getContacts);



//Funciones
async function findContacts(){

    let value = inputContact.value;

    let fetchContacts = await fetch(`${basepathServer}contacts`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let allContacts = await fetchContacts.json();
    let contacts = allContacts.data;
    
    let finded = '';

    let lastnamesFound = contacts.filter(e => e.lastname == value);
    if(lastnamesFound != '') finded = lastnamesFound;

    let regionsFound = contacts.filter(e => e.region[0].name == value);
    if(regionsFound  != '') finded = regionsFound ;

    let countriesFound = contacts.filter(e => e.country[0].name == value);
    if(countriesFound != '') finded = countriesFound;

    let citiesFound = contacts.filter(e => e.city[0].name == value);
    if(citiesFound != '') finded = citiesFound;

    let companiesFound = contacts.filter(e => e.company[0].name == value);
    if(companiesFound != '') finded = companiesFound;

    let positionsFound = contacts.filter(e => e.position == value);
    if(positionsFound != '') finded = positionsFound;

    if(finded != ''){

        contactTable.innerHTML = '';

        finded.forEach(contact =>{ createContactRow(contact) });
    }else{

        inputContact.value = "No se encontraron resultados";

    }

}


async function createNewContact(event) {

    event.preventDefault();

    let companyId;
    if (company.options[company.selectedIndex] != undefined){

        companyId = company.options[company.selectedIndex].id;
    }
    let regionId;
    let countryId;
    let cityId;
    
    if (selectRegion.options[selectRegion.selectedIndex] != undefined
        && selectCountry.options[selectCountry.selectedIndex] != undefined
        && selectCity.options[selectCity.selectedIndex] != undefined){

        regionId = selectRegion.options[selectRegion.selectedIndex].id;
        countryId = selectCountry.options[selectCountry.selectedIndex].id;
        cityId = selectCity.options[selectCity.selectedIndex].id;
    }

    let nuevoContacto = {
        
        name: name.value,
        lastname: lastname.value,
        position: position.value,
        email: email.value,
        company: companyId,
        region: regionId ,
        country: countryId ,
        city: cityId ,
        address: address.value,
        interest: rangeOutput.innerText,
        contactChannels: []
    };

    if(phone.value != ''){
        
        let phoneChannel = {
            contactChannel : "Phone",
            usserAccount: phone.value,
            preferences: phonePreference.value
        };
        nuevoContacto.contactChannels.push(phoneChannel)
    };
    if(whatsapp.value != ''){
        
        let whatsappChannel = {
            contactChannel : "Whatsapp",
            usserAccount: whatsapp.value,
            preferences: whatsappPreference.value
        };
        nuevoContacto.contactChannels.push(whatsappChannel)
    };
    if(instagram.value != ''){
        
        let instagramChannel = {
            contactChannel : "Instagram",
            usserAccount: instagram.value,
            preferences: instagramPreference.value
        };
        nuevoContacto.contactChannels.push(instagramChannel)
    };
    if(facebook.value != ''){
        
        let facebookChannel = {
            contactChannel : "Facebook",
            usserAccount: facebook.value,
            preferences: facebookPreference.value
        };
        nuevoContacto.contactChannels.push(facebookChannel)
    };
    if(linkedin.value != ''){
        
        let linkedinChannel = {
            contactChannel : "Linkedin",
            usserAccount: linkedin.value,
            preferences: linkedinPreference.value
        };
        nuevoContacto.contactChannels.push(linkedinChannel)
    };

    console.log(nuevoContacto);
    console.table(nuevoContacto);

    let sendNewContact = await fetch(`${basepathServer}newContact`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevoContacto)
    });

    let newContact = await sendNewContact.json();

    console.log(newContact);
    
    if(newContact.mensaje.details){

        errors.textContent = newContact.mensaje.details[0].message;
    }else if (newContact.mensaje.code == 11000){

        errors.textContent = "Email ya en uso";
    }else{

        location.reload();

    }
};

async function updateContact(event) {
    
    event.preventDefault();

    let contactId = loginForm.id;
    

    let companyId;
    if (companyUpdate.options[companyUpdate.selectedIndex] != undefined){

        companyId = companyUpdate.options[companyUpdate.selectedIndex].id;
    }

    let regionId;
    let countryId;
    let cityId;
    if (selectRegionUpdate.options[selectRegionUpdate.selectedIndex] != undefined
        && selectCountryUpdate.options[selectCountryUpdate.selectedIndex] != undefined
        && selectCityUpdate.options[selectCityUpdate.selectedIndex] != undefined){

        regionId = selectRegionUpdate.options[selectRegionUpdate.selectedIndex].id;
        countryId = selectCountryUpdate.options[selectCountryUpdate.selectedIndex].id;
        cityId = selectCityUpdate.options[selectCityUpdate.selectedIndex].id;
    }

    let nuevaInfo = {
        
        name: nameUpdate.value,
        lastname: lastnameUpdate.value,
        position: positionUpdate.value,
        email: emailUpdate.value,
        company: companyId,
        region: regionId ,
        country: countryId ,
        city: cityId ,
        address: addressUpdate.value,
        interest: rangeOutputUpdate.innerText,
        contactChannels: []
    };

    if(phoneUpdate.value != ''){
        
        let phoneChannel = {
            contactChannel : "Phone",
            usserAccount: phoneUpdate.value,
            preferences: phonePreferenceUpdate.value
        };
        nuevaInfo.contactChannels.push(phoneChannel)
    };
    if(whatsappUpdate.value != ''){
        
        let whatsappChannel = {
            contactChannel : "Whatsapp",
            usserAccount: whatsappUpdate.value,
            preferences: whatsappPreferenceUpdate.value
        };
        nuevaInfo.contactChannels.push(whatsappChannel)
    };
    if(instagramUpdate.value != ''){
        
        let instagramChannel = {
            contactChannel : "Instagram",
            usserAccount: instagramUpdate.value,
            preferences: instagramPreferenceUpdate.value
        };
        nuevaInfo.contactChannels.push(instagramChannel)
    };
    if(facebookUpdate.value != ''){
        
        let facebookChannel = {
            contactChannel : "Facebook",
            usserAccount: facebookUpdate.value,
            preferences: facebookPreferenceUpdate.value
        };
        nuevaInfo.contactChannels.push(facebookChannel)
    };
    if(linkedinUpdate.value != ''){
        
        let linkedinChannel = {
            contactChannel : "Linkedin",
            usserAccount: linkedinUpdate.value,
            preferences: linkedinPreferenceUpdate.value
        };
        nuevaInfo.contactChannels.push(linkedinChannel)
    };

    // console.log(nuevaInfo);
    // console.table(nuevaInfo);

    let updateContact = await fetch(`${basepathServer}updateContact/${contactId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevaInfo)
    });

    let updatedContact = await updateContact.json();

    
    if(updatedContact.mensaje.details){

        errorsUpdate.textContent = updatedContact.mensaje.details[0].message;
    }else if (updatedContact.mensaje.code == 11000){

        errorsUpdate.textContent = "Email ya en uso";
    }else{

        location.reload();

    }
}

async function deleteSelectedContacts() {

    let selectedContacts = checkIfSelectedContacts();  
    console.log(selectedContacts); 

    let fetchDeleteContacts = await fetch(`${basepathServer}deleteContacts`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedContacts)
    });

    let deletedData = await fetchDeleteContacts.json();

    console.log(deletedData);
    if(deletedData.codigo == 202){
        location.reload();
    }
}

async function appendCompaniesToSelects() {
    
    let fetchCompanies = await fetch(`${basepathServer}companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allCompanies = await fetchCompanies.json();
    let companies = allCompanies.data;

    companies.forEach(element => {

        let option = document.createElement('option');
        option.innerText = element.name;
        option.id = element._id;
        selectCompany.appendChild(option);
    });
    companies.forEach(element => {

        let option = document.createElement('option');
        option.innerText = element.name;
        option.id = element._id;
        selectCompanyUpdate.appendChild(option);
    });
    // Para refrescar el elemento select una vez que previamente le cargamos los options de companias.
    $('.selectpicker').selectpicker('refresh');
}

function rangeOutputValue(interest, rangeOutput){

    let value = interest.value;
    if(value == 0) rangeOutput.innerText = '0';
    if(value == 1) rangeOutput.innerText = '25';
    if(value == 2) rangeOutput.innerText = '50';
    if(value == 3) rangeOutput.innerText = '75';
    if(value == 4) rangeOutput.innerText = '100';
};

async function appendRegionsToSelects(selectRegion,selectCountry,selectCity) {


    let regions = await fetchRegions();

    regions.forEach(element =>{

        let option = document.createElement('option');
        option.innerText = element.name;
        option.id = element._id;
        selectRegion.appendChild(option);

    })

    // Al cambiar de region , alimento el select de paises segun la region seleccionada
    //  y el select de ciudades con el pais que caiga en la primer opcion del select paises
    selectRegion.addEventListener('change',() => {

        selectCountry.innerHTML = '';
        selectCity.innerHTML = '';

        let thisRegion = regions.filter(element => element.name == selectRegion.value );

        let countries = thisRegion[0].countries;
        countries.forEach(country =>{

            let countryOption = document.createElement('option');
            countryOption.innerText = country.name;
            countryOption.id = country._id;
            selectCountry.appendChild(countryOption);
        })
        let thisCountry = countries.filter(element => element.name == selectCountry.value);
        let cities = thisCountry[0].cities;

        cities.forEach(city =>{

            let cityOption = document.createElement('option');
            cityOption.innerText = city.name;
            cityOption.id = city._id;
            selectCity.appendChild(cityOption);
        })


    });
    // Al cambiar de pais , alimento el select de ciudades segun el pais seleccionado
    selectCountry.addEventListener('change', ()=>{

        selectCity.innerHTML = '';

        let thisRegion = regions.filter(element => element.name == selectRegion.value);
        let countries = thisRegion[0].countries;
        
        let thisCountry = countries.filter(element => element.name == selectCountry.value);
        let cities = thisCountry[0].cities;

        cities.forEach(city =>{

            let cityOption = document.createElement('option');
            cityOption.innerText = city.name;
            cityOption.id = city._id;
            selectCity.appendChild(cityOption);
        })
    });
};

async function getContacts() {

    let fetchContacts = await fetch(`${basepathServer}contacts`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let allContacts = await fetchContacts.json();
    let contacts = allContacts.data;
    console.log(contacts);

    contactTable.innerHTML = '';
    contacts.forEach(contact =>{

        createContactRow(contact);
    }) 
};


async function getContactById(contactId) {
    
    let fetchContact = await fetch(`${basepathServer}contact/${contactId}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let info = await fetchContact.json();
    let contact = info.data;

    return contact;
}

function createContactRow(contact) {

    let contactId = contact._id;
    let name = contact.name;
    let lastname = contact.lastname;
    let email = contact.email;
    let address = contact.address;

    let region;
    let country;
    let city;
    if (contact.region[0] == undefined || contact.country[0] == undefined || contact.city[0] == undefined  ){

        region = 'No brindado por el contacto asddddddddd ddddd  dddddddddasdasdas asdasdasd asd ';
        country = '';
        city = '';
    }else{
        region = contact.region[0].name;
        country = contact.country[0].name;
        city = contact.city[0].name;
    }

    let company = contact.company[0].name;
    let position = contact.position;
    let interest = contact.interest;

    let contactChannelsArray = contact.contactChannel;

    //Empiezo a crear contenido dinamicamente
    let contactRow = document.createElement('div');
    let checkbox = document.createElement('input');

    //Nombre,apellido y email
    let div1 = document.createElement('div');

    let pName = document.createElement('p');
    let smallEmail = document.createElement('small');

    //Pais y Region
    let div2 = document.createElement('div');
    let smallCity = document.createElement('small');
    let pCountry = document.createElement('p');
    let smallRegion = document.createElement('small');


    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    //Intereses
    let div5 = document.createElement('div');

    managinContactChannels(contactChannelsArray,div5);

    let div6 = document.createElement('div');
    let divProgress = document.createElement('div');
    let divProgressBar = document.createElement('div');
   
    let divEdits = document.createElement('div');
    let iEdit = document.createElement('i');

    contactRow.className = 'contact-row';
    contactRow.id = contactId;
    checkbox.className = 'contact-checkbox';
    div1.className = 'contact-info';
    div2.className = 'contact-info';
    div3.className = 'contact-info';
    div4.className = 'contact-info';
    div5.className = 'contact-info';
    div6.className = 'contact-info';
    divProgress.className = 'progress';
    divProgressBar.className = 'progress-bar';

    checkbox.setAttribute('type','checkbox')
    divProgressBar.setAttribute('role','progressbar');
    divProgressBar.setAttribute('style',`width: ${interest}%`);
    if(interest == 25) divProgressBar.style.backgroundColor = '#008080';
    if(interest == 50) divProgressBar.style.backgroundColor = '#008000';
    if(interest == 75) divProgressBar.style.backgroundColor = '#ffa500';
    if(interest == 100) divProgressBar.style.backgroundColor = '#ff0000';
    divProgressBar.innerText = `${interest}%`;

    divEdits.className = 'contact-edit';
    iEdit.className = 'fas fa-user-edit';
    iEdit.setAttribute('data-target','#updateModal');
    iEdit.setAttribute('data-toggle','modal');

    iEdit.addEventListener('click',async ()=>{
        
        updateContactContainer.style.display = 'flex';
        /* 
        Al clickear en editar el contacto hago un request al back con toda
        la informacion del contacto para llenar el modal con toda la info
        */
        let contactInfo = await getContactById(contactId);

        fillUpdateModalInfo(contactInfo);
    });
    
    pName.innerText = `${name} ${lastname}`;
    smallEmail.innerText = email;

    smallCity.innerText = city;
    pCountry.innerText = country;
    smallRegion.innerText = region;

    div3.innerText = company;
    div4.innerText = position;
    

    checkbox.addEventListener('change',function(){

        if(this.checked){

            contactRow.className = 'contact-row selected-row' ;
            selectedCounter += 1;
            //Añado contacto al localstorage
            saveSelectedContact(contactId);
            deleteContactsBtn.innerText = `Borrar contactos seleccionados (${selectedCounter})`;

        }else{

            contactRow.className = 'contact-row'; 
            selectedCounter -= 1;
            //Remuevo contacto de localstorage
            removeSelectedContact(contactId);
            deleteContactsBtn.innerText = `Borrar contactos seleccionados (${selectedCounter})`;
        }
        // this.checked ? contactRow.className = 'contact-row selected-row' : contactRow.className = 'contact-row';
    });


    div1.appendChild(pName);
    div1.appendChild(smallEmail);

    div2.appendChild(smallCity);
    div2.appendChild(pCountry);
    div2.appendChild(smallRegion);

    divProgress.appendChild(divProgressBar);
    div6.appendChild(divProgress);
    
    contactRow.appendChild(checkbox);
    contactRow.appendChild(div1);
    contactRow.appendChild(div2);
    contactRow.appendChild(div3);
    contactRow.appendChild(div4);
    contactRow.appendChild(div5);
    contactRow.appendChild(div6);

    divEdits.appendChild(iEdit);
    contactRow.appendChild(divEdits);

    contactTable.appendChild(contactRow);
};

function managinContactChannels(contactChannelsArray,div5){

    contactChannelsArray.forEach(contactChannel =>{

        //Recorro cada canal de cada contacto, si es favorito lo voy a mostrar
        contactChannel.forEach(channel =>{

            if(channel.preferences == "Canal favorito"){

                let channelDiv = document.createElement('div');
                channelDiv.className = 'channel';
                channelDiv.innerText = channel.contactChannel;

                // evento para mostrar la informacion del canal al clickearlo
                channelDiv.addEventListener('click',()=>{
                    if(channelDiv.innerHTML == `${channel.contactChannel} <br> (${channel.usserAccount})`){

                        channelDiv.innerText = channel.contactChannel;
                    }else{
                        channelDiv.innerHTML = `${channel.contactChannel} <br> (${channel.usserAccount})`;
                    }
                })
                div5.appendChild(channelDiv);
            }

        });
        //Si el contacto no tiene canales preferidos solo se comunicara por email
        let canalesFav = contactChannel.filter(channel => channel.preferences == 'Canal favorito');
        let canalesSinPreferencia = contactChannel.filter(channel => channel.preferences == 'Sin preferencia');

        //Si el usuario no tiene canal preferido elegido y tampoco canal sin preferencia entonces solo comunicar por email
        if(canalesFav.length == 0){

            let noChannel = document.createElement('div');
            noChannel.className = 'channel';
            noChannel.innerText = 'Solo email';
            div5.appendChild(noChannel);
 
        }
        
    })
}

function checkIfSelectedContacts(){

    //Chequear si tengo algo en localstorage
    let selectedContacts;

    if(localStorage.getItem('selectedContacts') === null){
        selectedContacts = [];
    } else {

        selectedContacts = JSON.parse(localStorage.getItem('selectedContacts'));
    }
    return selectedContacts;
};

function saveSelectedContact(contactId){

    //Chequear si tengo algo en localstorages
    let selectedContacts = checkIfSelectedContacts();

    selectedContacts.push(contactId);
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
};

function removeSelectedContact(contactId){

    //Chequear si tengo algo en localstorage
    let selectedContacts = checkIfSelectedContacts();

    //Busco el valor de texto del elem clickeado
    const selectedIndex = selectedContacts.indexOf( contactId );
    //elimino el valor del array de todos
    selectedContacts.splice( selectedIndex, 1);

    
    //Vuelvo a guardar el array
    localStorage.setItem('selectedContacts',JSON.stringify(selectedContacts));

};

function deleteAllSelectedFromLocal(){

    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
};

function textDelete() {
    let selectedContacts = checkIfSelectedContacts();

    let contactsLength = selectedContacts.length;

    if(contactsLength == 1){
        deleteBody.innerText = `¿Esta seguro que desea eliminar el contacto?`;
        submitDeleteContacts.removeAttribute('disabled');

    } else if (contactsLength > 1) {
        deleteBody.innerText = `¿Esta seguro que desea eliminar los ${contactsLength} contactos seleccionados?`;
        submitDeleteContacts.removeAttribute('disabled');

    } else {
        deleteBody.innerText = `No tiene ningun contacto seleccionado`;
        submitDeleteContacts.setAttribute('disabled',true);
    }
};

async function fillUpdateModalInfo(contact){

    //Le atribuyo el id del contacto al contenedor del formulario de update 
    loginForm.id = contact._id;
    //Reseteo todo
    nameUpdate.value = '';
    lastnameUpdate.value = '';
    positionUpdate.value = '';
    emailUpdate.value = '';
    addressUpdate.value = '';
    rangeOutputUpdate.innerText = '';
    interestUpdate.value = 0;
    phoneUpdate.value = '';
    phonePreferenceUpdate.value = 'Sin preferencia';
    whatsappUpdate.value = '';
    whatsappPreferenceUpdate.value = 'Sin preferencia';
    instagramUpdate.value = '';
    instagramPreferenceUpdate.value = 'Sin preferencia';
    facebookUpdate.value = '';
    facebookPreferenceUpdate.value = 'Sin preferencia';
    linkedinUpdate.value = '';
    linkedinPreferenceUpdate.value = 'Sin preferencia';

    //Aplico info
    nameUpdate.value = contact.name;
    lastnameUpdate.value = contact.lastname;
    positionUpdate.value = contact.position;
    emailUpdate.value = contact.email;

    //Convierto en array los elementos hijos del buscador de companias
    let arrayCompanyOptions = Array.from($('.selectpicker')[1].children) ;
    //Busco dentro de las opciones la que equivalga a la compania del contacto y le doy el atributo de selected
    let contactCompany = arrayCompanyOptions.find(option => option.innerText == contact.company[0].name);
    contactCompany.setAttribute('selected', true);
    $('.selectpicker').selectpicker('refresh');

    addressUpdate.value = contact.address;

    if (contact.region[0] != undefined && contact.country[0]!= undefined && contact.city[0] != undefined  ){

        //Convierto la coleccion de opciones html en un array para iterarlo.
        let arrayRegionOptions = Array.from(selectRegionUpdate.options);

        //Busco el indice de la opcion que equivale a la region del contacto
        let indexOfRegion = arrayRegionOptions.findIndex(option => option.value == contact.region[0].name);

        //Le doy el indice selected que tiene que usar
        selectRegionUpdate.options.selectedIndex = indexOfRegion;

        //Lo que hago aca es automaticamente voy a cargar cada  select de Pais y Ciudad
        // con los paises y ciudades acordes a la region del contacto!!
        // Pero ademas voy a darle el atributo de selected al pais y ciudad que sea igual a la del contacto!
        let regions = await fetchRegions();

        let thisRegion = regions.filter(element => element.name == contact.region[0].name );

        let countries = thisRegion[0].countries;

        selectCountryUpdate.innerHTML = '';

        countries.forEach(country =>{

            let countryOption = document.createElement('option');
            countryOption.innerText = country.name;
            countryOption.id = country._id;

            if(countryOption.innerText == contact.country[0].name){
                countryOption.setAttribute('selected', true);
            }
            
            selectCountryUpdate.appendChild(countryOption);
        })

        let thisCountry = countries.filter(element => element.name == contact.country[0].name);
        let cities = thisCountry[0].cities;

        selectCityUpdate.innerHTML = '';
        cities.forEach(city =>{

            let cityOption = document.createElement('option');
            cityOption.innerText = city.name;
            cityOption.id = city._id;
            if(cityOption.innerText == contact.city[0].name){
                cityOption.setAttribute('selected', true);
            }
            selectCityUpdate.appendChild(cityOption);
        })
    }else{

        selectRegionUpdate.innerHTML = '<option selected disabled>Select region</option>';
        selectCountryUpdate.innerHTML = ''; 
        selectCityUpdate.innerHTML = '';
        let regions = await fetchRegions();
        regions.forEach(element =>{

            let option = document.createElement('option');
            option.innerText = element.name;
            option.id = element._id;
            selectRegionUpdate.appendChild(option);
    
        })
    }



    //Interes en la compania
    rangeOutputUpdate.innerText = `${contact.interest}`;
    if(contact.interest == 0) interestUpdate.value = 0;
    if(contact.interest == 25) interestUpdate.value = 1;
    if(contact.interest == 50) interestUpdate.value = 2;
    if(contact.interest == 75) interestUpdate.value = 3;
    if(contact.interest == 100) interestUpdate.value = 4;
    
    let contactChannels = contact.contactChannel[0];

    //Si el Array de canales no esta vacio aplico las preferencias a los campos
    if(contactChannels != ''){
        
        contactChannels.forEach(channel =>{

            if(channel.contactChannel == 'Phone' && channel.preferences != ''){

                phoneUpdate.value = channel.usserAccount;
                phonePreferenceUpdate.value = channel.preferences;
            };
            if(channel.contactChannel == 'Whatsapp' && channel.preferences != ''){

                whatsappUpdate.value = channel.usserAccount;
                whatsappPreferenceUpdate.value = channel.preferences;
            };
            if(channel.contactChannel == 'Instagram' && channel.preferences != ''){

                instagramUpdate.value = channel.usserAccount;
                instagramPreferenceUpdate.value = channel.preferences;
            };
            if(channel.contactChannel == 'Facebook' && channel.preferences != ''){

                facebookUpdate.value = channel.usserAccount;
                facebookPreferenceUpdate.value = channel.preferences;
            };
            if(channel.contactChannel == 'Linkedin' && channel.preferences != ''){

                linkedinUpdate.value = channel.usserAccount;
                linkedinPreferenceUpdate.value = channel.preferences;
            };
        })
    };


};

async function fetchRegions(){

    let fetchRegions = await fetch(`${basepathServer}regions`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allRegions= await fetchRegions.json();
    let regions = allRegions.data;
    return regions;
};
async function sortTableByColumn(fieldV,orderV){
    
    let field = fieldV;
    let order = orderV;
    
    let fetchSortedContacts = await fetch(`${basepathServer}contacts/sortByName/${field}&${order}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let sortedContacts = await fetchSortedContacts.json();
    let contacts = sortedContacts.data;
    contactTable.innerHTML = '';
    contacts.forEach(contact =>{
        
        createContactRow(contact);
    })
    
}

let orderContact = 0;
sortByContact.addEventListener('click',()=>{

    if(orderContact == 0){ orderContact = 1; }
    else if(orderContact == 1){ orderContact = -1; }
    else if(orderContact == -1){ orderContact = 1; };
  
    let field = 'name';
    sortTableByColumn(field,orderContact);
});

let orderCountry = 0;
sortByCountry.addEventListener('click',()=>{

    if(orderCountry == 0){ orderCountry = 1; }
    else if(orderCountry == 1){ orderCountry = -1; }
    else if(orderCountry == -1){ orderCountry = 1; };

    let field = 'country';
    sortTableByColumn(field,orderCountry);   
});

// let orderCompany = 0; 
// sortByCompany.addEventListener('click',()=>{

//     if(orderCompany == 0){ orderCompany = 1; }
//     else if(orderCompany == 1){ orderCompany = -1; }
//     else if(orderCompany == -1){ orderCompany = 1; };

//     let field = 'company';
//     sortTableByColumn(field,orderCompany); 
// });

let orderPosition = 0;
sortByPosition.addEventListener('click',()=>{

    if(orderPosition == 0){ orderPosition = 1; }
    else if(orderPosition == 1){ orderPosition = -1; }
    else if(orderPosition == -1){ orderPosition = 1; };

    let field = 'position';
    sortTableByColumn(field,orderPosition);  
});

let orderInterest = 0;
sortByInterest.addEventListener('click',()=>{

    if(orderInterest == 0){ orderInterest = 1; }
    else if(orderInterest == 1){ orderInterest = -1; }
    else if(orderInterest == -1){ orderInterest = 1; };

    let field = 'interest';
    sortTableByColumn(field,orderInterest);  
});






