# Data Warehouse
Proyecto integrador del curso de Desarrollador Web Full Stack en Acamica.

Realizado con HTML5, SASS, JS, NodeJS, Mongoose como ODM y una base de datos en MongoDB Atlas.




PASOS PARA INSTALACION Y PRUEBA DE APP

CLONAR REPOSITORIO https://github.com/lxcxxnxp/DataWH.git

1- Abrir la consola de VSCode, la carpeta anterior a "dataw" deberia llamarse "data_warehouse"(en caso de que al clonar se cambie de nombre),
 posicionarse en la carpeta "dataw" de y tipear : "npm install" para instalar todas las dependencias necesarias.

2- Dentro de la carpeta 'src' crear un archivo .env con la siguiente informacion dentro: 

SECRET_TOKEN=G3RM4N
DB_CONNECTION=mongodb+srv://ger-tobi22:tobitobi22@cluster0.3opfa.mongodb.net/Cluster0?retryWrites=true&w=majority

3- Dentro de la consola de VSCode posicionarse dentro de la carpeta 'src' y tipear 'nodemon app'
   Deberia entonces mostrar lo siguiente en la consola :
	Servidor escuchando en puerto 3000
	Mongo database connected to mongodb+srv://ger-tobi22:tobitobi22@cluster0.3opfa.mongodb.net/Cluster0?retryWrites=true&w=majority

4-Ir a carpeta public/login.html y abrir con el live server.

5- La base de datos esta alojada en una cuenta mia de MongoDB atlas y ya cuenta con regiones,paises,ciudades,
companias, contactos y usuarios precargados.

6-
Para entrar como admin los datos son:
	email : lupucharella@gmail.com
	pass : Lu12345

Para entrar como user comun los datos son: 
	email : dblanco@gmail.com
	pass : daniela12345
