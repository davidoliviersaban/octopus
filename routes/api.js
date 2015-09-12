'use strict';
var  fs = require('fs');
var _ = require('underscore');
var path = require('path');
var mkdirp = require('mkdirp');
var cache = require('./eleve_cache');
var utils = require('./utils');

var NUMBER_OF_RESULTS = 50;

//////////////////////////// ELEVES

var generateIndexForEleveListFromInputRequest = function (req) 
{
	console.log(" generateIndexForEleveListFromInputRequest  ");
	var elevenom;
	var eleveprenom;
	var eleveid;
	var eleveclasse;
	if (req && req.params) {
		if (req.body && req.body.path) {
			console.log("body = " + JSON.stringify(req.body));
			return req.body;
		}
		else {
			if (req.params.name) {
				console.log(" nom = " + req.params.name);
				elevenom = req.params.name;
				elevenom = elevenom.substr(1,elevenom.length);
			}
			if (req.params.surname) {
				console.log(" prenom = " + req.params.surname);
				eleveprenom = req.params.surname;
				eleveprenom = eleveprenom.substr(1,eleveprenom.length);
			}
			if (req.params.id) {
				console.log(" id = " + req.params.id);
				eleveid = req.params.id;
				eleveid = eleveid.substring(1,eleveid.length);
			}
			if (req.params.classe) {
				console.log(" classe = " + req.params.classe);
				eleveclasse = req.params.classe;
				eleveclasse = eleveclasse.substring(1,eleveid.length);
			}
		}
	}

	var eleveIndex = cache.getJsonIndexForEleve(elevenom, eleveprenom, eleveid);
	if (eleveIndex.generated && (eleveIndex.nom || eleveIndex.prenom)) 
		eleveIndex = utils.parseFileNameToGetJsonIndex({Path:cache.resolveFileNameForMedecin(eleveIndex), IsDirectory : false});
	return eleveIndex;
}

// GET

exports.getAllEleves = function(req,res) {

	console.log("\n\n DEBUG-api: getAllEleves ")

	var eleveIndex = generateIndexForEleveListFromInputRequest(req);

	console.log("NOMS : " + eleveIndex.noms);
	
	try {
	
		if (cache.data.eleves.length > 0) {
		
			var filteredList = cache.data.eleves;
			console.log("NOMS : " + eleveIndex.noms);
			if (eleveIndex.noms) {
				eleveIndex.noms.forEach(function(nom) {
					filteredList  = _.filter(cache.data.eleves, function(eleve){ 
						return (eleve.path.toLowerCase().indexOf(nom.toLowerCase())>0); 
					});
				});
			}
			if(res) res.json(filteredList.slice(0,NUMBER_OF_RESULTS));
			return;
		}
	
		var files = utils.browseAllEleveFolders(utils.ELEVES_FOLDER);
		
		//console.log("files "+files);
		
		files.forEach(function(file)
		{
			var json = utils.parseFileNameToGetJsonIndex(file);
			if (json != null) cache.data.eleves.push(json);
		});
		
		if(res) res.json(cache.data.eleves.slice(0,NUMBER_OF_RESULTS));
		console.log("getAllEleves - SENT: #" + cache.data.eleves.length+ " eleves");
//		console.log("getAllEleves - SENT: "+JSON.stringify(cache.data.eleves,null,3));
	}
	catch (err) {
		console.log("Error occurred while reading file "+err);
		if(res) res.send(404);
	}
}


/* *
 * Mehtode pour la lecture des eleves dans le file system
 * @params: /:name/:surname/:id
 */
exports.getEleve = function(req,res) {

console.log("\n\n DEBUG-api: getEleve ")


	var eleveIndex = generateIndexForEleveListFromInputRequest(req);
	
	try {
	
		var filename = eleveIndex.path;
		console.log("DEBUG-api: Filename generated: " + JSON.stringify(eleveIndex));
		fs.readFile(filename,{encoding:'utf8'}, function(err,eleveString) {
			if(err) {
				console.log(err);
				res.send(404);
			} else {
				console.log("The file was read!");
				eleveString = eleveString.toString('utf8').	replace(/^\uFEFF/, '').
																replace(/&gt/g,">").
																replace(/&lt/g,"<").
																replace(/"date": "([0-9]{4})([0-9]{2})([0-9]{2})"/g,"\"date\": \"$1-$2-$3\"").
																replace(/"date_naissance": "([0-9]{4})([0-9]{2})([0-9]{2})"/g,"\"date_naissance\": \"$1-$2-$3\"");
				
				var eleveJson = JSON.parse(eleveString);
				eleveJson.consultations = _.sortBy(eleveJson.consultations, function(f) { return f.date });
				eleveJson.audiometries = _.sortBy(eleveJson.audiometries, function(f) { return f.date });
				res.json(eleveJson);
//				console.log("eleveString = "+eleveString);
			}
		});
	}
	catch (err) {
		console.log("Error occurred while reading file "+err);
		res.send(404);
	}
}


// POSTS
exports.updateEleve = function(req,res) {

console.log("\n\n DEBUG-api: updateEleve ")

	//console.log(req.body);
	try {
		var eleveJson = req.body;
		var eleveIndex = utils.getJsonIndexForEleve(eleveJson.nom, eleveJson.prenom, eleveJson.id);
		
		var path = cache.resolveFileNameForMedecin(eleveIndex);
		console.log("creating "+path);
		mkdirp(utils.resolveFolderName(utils.ELEVES_FOLDER,eleveJson.nom,eleveJson.prenom),function(err){
//			res.send(404);
			if (err) {
				console.log("Error while creating folder" + err);
				res.send(404);
			}
			else {
				try {
				//var buffer = new Buffer(JSON.stringify(eleveJson).toString('utf-8'),"utf-8");
					//if (eleveid || eleveid == -1) eleveIndex = parseFileNameToGetJsonIndex({Name:resolveFileNameForMedecin(eleveIndex), IsDirectory : false});
					console.log("DEBUG-api: Update Eleve "+JSON.stringify(eleveIndex));
					fs.writeFileSync(eleveIndex.path, 
								JSON.stringify(eleveJson).toString('utf-8'),
								//buffer.toString("utf-8"),
								'utf8');
				//buffer.write
				} catch(err) {
					console.log("Error occurred while saving file "+err);
					res.send(404);
					return;
				}
				console.log("The file was saved!");
				//_.sortedIndex(cache.data.eleves,eleveJson,'nom');
				//if (index >=0 && compareEleves(cache.data.eleves[index],eleveJson)) {
				var indexJson = cache.getIndexInEleveList(eleveIndex);
				if (indexJson.match) {
//					cache.data.eleves.splice(index,1,//getJsonIndexForEleve(eleveJson));
//					parseFileNameToGetJsonIndex ());
					console.log(eleveIndex.nom+": found at "+indexJson.index);
				}
				else {
					cache.data.eleves.splice(indexJson.index+1,0,eleveIndex);
					console.log(JSON.stringify(eleveIndex)+": created");
				}
				//cache.data.eleves = _.sortBy(cache.data.eleves, function(f) { return f.nom });
				res.json(eleveIndex);
			}
		});

	}
	catch (err) {
		console.log("Error occurred while saving file "+err);
		res.send(404);
	}
}

//DELETE
exports.deleteEleve = function(req,res) {

	console.log("\n\n DEBUG-api: deleteEleve ")

	console.log(req.body);
	
	var eleveIndex = generateIndexForEleveListFromInputRequest(req);	

	try {

		// Ca plante ici
		var path = cache.resolveFileNameForMedecin(eleveIndex);
		console.log("PATH = "+path);
		if (fs.existsSync(path)) {
			var indexInEleveList = cache.getIndexInEleveList(eleveIndex);
			
			console.log(cache.data.eleves[indexInEleveList.index].id + " =?= " + eleveIndex.id);
			cache.data.eleves.splice(indexInEleveList.index,1);
			fs.unlinkSync(path);
			res.send(200);
		}
		else {
			console.log(path+" cannot be removed");
			res.send(404);
		}
	}
	catch (err) {
		console.log("Error occurred while removing file "+err);
		res.send(404);
	}
}