var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var db = new sqlite3.Database(':memory:');
var datas = JSON.parse(fs.readFileSync('datas/datas.json', 'utf8')); // get datas synchronously 

db.serialize(function() {

/* CREATE TABLES */
  db.run("CREATE TABLE IF NOT EXISTS hotel (num_hotel INT, nom_hotel TEXT, ville TEXT)"); // hotel
  db.run("CREATE TABLE IF NOT EXISTS chambre (num_chambre INT, num_hotel INT, type TEXT, prix INT)"); // chambre
  db.run("CREATE TABLE IF NOT EXISTS reservation (num_hotel INT, num_hote INT, date_debut TEXT, date_fin TEXT, num_chambre INT)"); // reservation
  db.run("CREATE TABLE IF NOT EXISTS hote (num_hote INT, nom_hotel TEXT, adresse_hote TEXT)"); // hote

  /* INSERT DATAS */
	var stmt = db.prepare("INSERT INTO hotel VALUES (?,?,?)"); // hotel
	datas["hotel"].forEach( (item) => {
  		stmt.run([item.num_hotel, item.nom_hotel, item.ville]);
	});	

	stmt = db.prepare("INSERT INTO chambre VALUES (?,?,?,?)"); // chambre
	datas["hotel"].forEach( (item) => {
  	stmt.run([item.num_chambre, item.num_hotel, item.type, item.prix]);
	});	

	stmt = db.prepare("INSERT INTO reservation VALUES (?,?,?,?,?)"); // reservation
	datas["hotel"].forEach( (item) => {
  	stmt.run([item.num_hotel, item.num_hote, item.date_debut, item.date_fin, item.num_chambre]);
	});	

	stmt = db.prepare("INSERT INTO hote VALUES (?,?,?)"); // hote
	datas["hotel"].forEach( (item) => {
  	stmt.run([item.num_hote, item.nom_hote, item.adresse_hote]);
	});	

	stmt.finalize();     	

	/* SELECT DATAS */
  db.each(  "SELECT num_hotel, nom_hotel FROM hotel,chambre" + 
            "WHERE (" +
              "chambre.num_hotel=hotel.num_hotel AND chambre.prix > 50)", function(err, row) {
    console.log("query a :")
    console.log(JSON.stringify(row));
  });

  db.each("SELECT num_hotel, nom_hotel FROM hotel", function(err, row) {
    console.log("query d :")
    console.log(JSON.stringify(row));
  });



});           

db.close();