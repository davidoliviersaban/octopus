'use strict';
var fs = require('fs');
var cache = require('./eleve_cache');
var utils = require('./common_utils');

var NUMBER_OF_RESULTS = 50;

//////////////////////////// ELEVES

var parseRequest = function (req) 
{
//	console.log(" parseRequest  ");
	if (req && req.body) {
		return req.body;
	}
	return null;
}

// GET
exports.getAllEleves = function(req,res) {

	console.log("\n\nDEBUG-api: getAllEleves ")

	try {
//		var eleveIndex = parseRequest(req);
		var inputData = parseRequest(req);
		var filteredList = cache.data.eleves;
		if (filteredList.length > 0) {
			if (inputData && inputData.data) {
				console.log("> Input = " + JSON.stringify(inputData.data));
				filteredList = cache.getFilteredEleveList(inputData.data.split(","));
			}
			filteredList = filteredList.slice(0,NUMBER_OF_RESULTS);
			if(res) res.json(filteredList);
			return;
		}
	
		filteredList = cache.browseAllEleveFolders().slice(0,NUMBER_OF_RESULTS);
		console.log("getAllEleves - READ: #" + cache.data.eleves.length+ " eleves");
		
		if(res) res.json(filteredList);
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

	try {
		var eleveJson = parseRequest(req);
		console.log("DEBUG-api: getEleve "+JSON.stringify(eleveJson));
		var eleveIndex = cache.getJsonIndexForEleve(eleveJson);
		console.log("DEBUG-api: getEleve "+eleveIndex);
		utils.openV2(utils.ELEVES_FOLDER, eleveIndex, function(status,data){
			if (status == 200) {
				res.json(data);
			}
			else {
				res.send(status);
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
	
	try {
		var eleveJson = parseRequest(req);
		console.log("DEBUG-api: updateEleve "+JSON.stringify(eleveJson));
		var eleveIndex = cache.getJsonIndexForEleve(eleveJson);
		console.log("DEBUG-api: updateEleve "+eleveIndex);

//		utils.save(eleveJson,utils.ELEVES_FOLDER,eleveJson.nom, eleveJson.prenom, eleveJson.id,function(status){
		utils.saveV2(eleveJson,utils.ELEVES_FOLDER,eleveIndex,function(status){
		    if (status==200) {
				cache.updateEleve(eleveJson);
				res.json(eleveJson);
			}
			else {
				res.send(status);
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

	console.log("\n\n DEBUG-api: deleteEleve ");

	try {
		var eleveIndex = parseRequest(req);
		utils.delete(eleveIndex.path,function(status) {
			if (status == 200) {
				res.send(cache.removeEleve(eleveIndex)?200:404);
			}
			else {
				console.log(eleveIndex.path+" cannot be removed");
				res.send(404);
			}
		});
		
	}
	catch (err) {
		console.log("Error occurred while removing file "+err);
		res.send(404);
	}
}