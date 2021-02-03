
const express = require('express');
const router = express.Router();


//Controllers
const login = require('../controllers/login');
const register = require('../controllers/register');
const admin = require('../controllers/admin');

const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');//Middleware de autenticacion de Administrador

const regionCtrl = require('../controllers/regions');
const countryCtrl =  require('../controllers/countries');
const cityCtrl = require('../controllers/cities');
const companyCtrl = require('../controllers/companies');
const contactsCtrl= require('../controllers/contacts');




//***Rutas****

//Logueo

router.route('/login').post(login); // Log in de usuario 

router.route('/auth').get(auth); //Autenticacion con token de usuario para cualquier seccion del sitio

// Admin

router.route('/register').post(authAdmin,register); 

router.route('/getUsers/:id').get(authAdmin,admin.getUsers);

router.route('/updateUser/:_id').put(authAdmin,admin.updateUser);

router.route('/deleteUser/:_id').delete(authAdmin,admin.deleteUser);

//Contactos

router.route('/newContact').post(contactsCtrl.newContact);

router.route('/updateContact/:_id').put(contactsCtrl.updateContact);

router.route('/contacts').get(contactsCtrl.getContacts);

router.route('/deleteContacts').delete(contactsCtrl.deleteContacts);

router.route('/contact/:_id').get(contactsCtrl.getContactById); //Ruta para devolver informacion de un contacto especifico

router.route('/contacts/sortByName/:field&:order').get(contactsCtrl.sortContacts);



//Companies

router.route('/newCompany/:city').post(companyCtrl.newCompany);//El value de city sera la ciudad a la que pertenece la compania

router.route('/updateCompany/:id&:city').put(companyCtrl.updateCompany);//1er param id de la compania, 2do la ciudad a la que va a pertenecer la compania

router.route('/deleteCompany/:_id').delete(companyCtrl.deleteCompany);

router.route('/companies').get(companyCtrl.getCompanies);




//Region

router.route('/newRegion').post(regionCtrl.newRegion); //Cargar nueva Region

router.route('/updateRegion/:_id').put(regionCtrl.updateRegion); //Editar nombre de region

router.route('/deleteRegion/:_id').delete(regionCtrl.deleteRegion); // Borrar Region

router.route('/regions').get(regionCtrl.getRegions); // Obtener Regiones


//Pais

router.route('/newCountry/:_id').post(countryCtrl.newCountry); //Cargar nuevo Pais

router.route('/updateCountry/:_id').put(countryCtrl.updateCountry); //Actualizar pais

router.route('/deleteCountry/:_id').delete(countryCtrl.deleteCountry); //Borrar pais



//Ciudad
router.route('/newCity/:_id').post(cityCtrl.newCity); //Cargar nueva Ciudad

router.route('/updateCity/:_id').put(cityCtrl.updateCity); //Actualizar Ciudad

router.route('/deleteCity/:_id').delete(cityCtrl.deleteCity); //Borrar Ciudad

router.route('/cities').get(cityCtrl.getCities); //Obtener ciudades








module.exports = router;