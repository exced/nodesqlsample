var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var db = new sqlite3.Database(':memory:');
var datas = JSON.parse(fs.readFileSync('datas/datas.json', 'utf8')); // get datas synchronously 

db.serialize(function() {

/* CREATE TABLES */
  db.run("CREATE TABLE IF NOT EXISTS hotel (num_hotel INT NOT NULL PRIMARY KEY, nom_hotel TEXT, ville TEXT)"); // hotel
  db.run("CREATE TABLE IF NOT EXISTS chambre (num_chambre INT NOT NULL PRIMARY KEY, num_hotel INT, type TEXT, prix INT)"); // chambre
  db.run("CREATE TABLE IF NOT EXISTS reservation (num_hotel INT NOT NULL, num_hote INT NOT NULL, date_debut TEXT NOT NULL, date_fin TEXT, num_chambre INT, PRIMARY KEY (num_hotel,num_hote,date_debut))"); // reservation
  db.run("CREATE TABLE IF NOT EXISTS hote (num_hote INT NOT NULL PRIMARY KEY, nom_hote TEXT, adresse_hote TEXT)"); // hote

  /* INSERT DATAS */
	var stmt = db.prepare("INSERT INTO hotel VALUES (?,?,?)"); // hotel
	datas["hotel"].forEach( (item) => {
  		stmt.run([item.num_hotel, item.nom_hotel, item.ville]);
	});	

	stmt = db.prepare("INSERT INTO chambre VALUES (?,?,?,?)"); // chambre
	datas["chambre"].forEach( (item) => {
  	stmt.run([item.num_chambre, item.num_hotel, item.type, item.prix]);
	});	

	stmt = db.prepare("INSERT INTO reservation VALUES (?,?,?,?,?)"); // reservation
	datas["reservation"].forEach( (item) => {
  	stmt.run([item.num_hotel, item.num_hote, item.date_debut, item.date_fin, item.num_chambre]);
	});	

	stmt = db.prepare("INSERT INTO hote VALUES (?,?,?)"); // hote
	datas["hote"].forEach( (item) => {
  	stmt.run([item.num_hote, item.nom_hote, item.adresse_hote]);
	});	

	stmt.finalize();

  /* SELECT DATAS */
  db.each(  'SELECT num_hotel FROM chambre ' +
            'WHERE (chambre.prix > 50)'
            , function(err, row) {            
    console.log(JSON.stringify(row));
  });

  db.each(  'SELECT * FROM hotel,chambre ' +
            'WHERE (hotel.num_hotel = chambre.num_hotel)'
            , function(err, row) {            
    console.log(JSON.stringify(row));
  });

  db.each(  'SELECT nom_hotel FROM hotel,chambre ' +
            'WHERE (hotel.num_hotel = chambre.num_hotel '+
            'AND chambre.prix > 50)'
            , function(err, row) {            
    console.log(JSON.stringify(row));
  });    

  db.each("SELECT num_hotel, nom_hotel FROM hotel", function(err, row) {
    console.log(JSON.stringify(row));
  });  

  db.each(  'SELECT num_hotel, num_chambre FROM chambre ' +
            'WHERE (chambre.prix < 50)'
            , function(err, row) {
    console.log(JSON.stringify(row));
  });  

  db.each(  'SELECT nom_hote, adresse_hote FROM hote', function(err, row) {
    console.log(JSON.stringify(row));
  });

  db.each(  'SELECT prix, type ' +
            'FROM hotel , chambre ' +
            'WHERE ( ' +
            'hotel.nom_hotel = "hotel Gouverneur" ' +
            'AND hotel.num_hotel = chambre.num_hotel )'
            , function(err, row) {
    console.log(JSON.stringify(row));
  });   

  db.each(  'SELECT num_hote, nom_hote ' +
            'FROM hotel , reservation, hote ' +
            'WHERE ( ' +
            'hotel.nom_hotel = "hotel Gouverneur" ' +
            'AND hotel.num_hotel = reservation.num_hotel ' +
            'AND reservation.num_hote = hote.num_hote ' +
            'AND reservation.date_debut >= DATETIME(\'now\') ' +
            'AND reservation.date_fin <= DATETIME(\'now\'))'
            , function(err, row) {
    console.log(JSON.stringify(row));
  });   

  db.each(  'SELECT num_chambre, num_hotel, type, prix, nom_hote ' +
            'FROM hotel , chambre, reservation, hote ' +
            'WHERE ( ' +
            'hotel.nom_hotel = "hotel Gouverneur" ' +
            'AND hotel.num_hotel = chambre.num_hotel ' +
            'AND hote.num_hote = reservation.num_hote ' +
            'AND reservation.num_chambre = chambre.num_chambre ' +
            ')'
            , function(err, row) {
    console.log(JSON.stringify(row));
  });

  db.each(  'SELECT num_hote, nom_hote, adresse_hote ' +
            'FROM hotel , reservation, hote ' +
            'WHERE ( ' +
            'hotel.nom_hotel = "hotel Gouverneur" ' +
            'AND hotel.num_hotel = reservation.num_hotel ' +
            'AND reservation.num_hote = hote.num_hote ' +
            'AND reservation.date_debut >= DATETIME(\'now\') ' +
            'AND reservation.date_fin <= DATETIME(\'now\'))'
            , function(err, row) {
    console.log(JSON.stringify(row));
  });


});           

db.close();