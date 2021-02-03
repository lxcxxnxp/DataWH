//Insercion de regiones en base datos

db.createCollection("regiones")


db.regiones.insert([
    {
        Sudamerica: [  
            {
                Argentina: {
                    bue: "Buenos Aires",
                    cor: "Cordoba",
                    ros: "Rosario",
                    mdp : "Mar del Plata",
                    sal: "Salta",
                    stf : "Santa Fe",
                    cor: "Corrientes",
                    tan: "Tandil"
                }
            },
            {
                Colombia: {
                    bog: "Bogota",
                    med: "Medellín",
                    cal: "Cali",
                    man: "Manizales",
                    bar: "Barranquilla"
                }
            }

        ]
    }
])

Sudamerica: {
            
    Argentina: {
        "Buenos Aires",
        "Cordoba",
        "Rosario",
        "Mar del Plata",
        "Salta",
        "Santa Fe",
        "Corrientes",
        "Tandil"
    }
    Colombia: {
        "Bogota",
        "Medellín",
        "Cali",
        "Manizales",
        "Barranquilla"
    }
}

db.regiones.find( {}, {"Sudamerica.Argentina":1} ).pretty()
db.regiones.find( {}, {"Sudamerica.Argentina":1} ).pretty()
> db.regiones.find( {"Sudamerica.Colombia":"Bogota"}, {"Sudamerica.Colombia":1} )