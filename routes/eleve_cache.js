'use strict';
var utils = require('./common_utils');
var cache = require('./common_cache');
 
// Cache of eleves
exports.data = {
   "eleves": [
  ]
};

/**
 * This method generates a json object that will be used as an index.
 * This index will be used as comparator and to retrieve the corresponding eleves.
 */
exports.getJsonIndexForEleve = function(eleve)
{
//	console.log("DEBUG-eleve-cache: getJsonIndexForEleve(): "+JSON.stringify(eleve));
	return cache.getJsonIndexV2(exports.data.eleves,utils.ELEVES_FOLDER,[eleve.nom,eleve.prenom,eleve.id,eleve.groupe_classe]);
}

exports.getIndexInEleveList = function(eleveIndex) 
{
	return cache.getPositionInDATAList(exports.data.eleves,eleveIndex);
}

exports.getFilteredEleveList = function(elements) 
{
	elements = elements.map(function(element){return element = utils.convertValue(element)});
	return cache.getFilteredDATAList(exports.data.eleves,elements);
}

exports.updateEleve= function(eleveJson){
	var eleveIndex = exports.getJsonIndexForEleve(eleveJson);
	var objectJson = {};
	objectJson.nom = eleveJson.nom;
	objectJson.prenom = eleveJson.prenom;
	objectJson.id = eleveJson.id;
	objectJson.groupe_classe = eleveJson.groupe_classe;
	objectJson.path = utils.resolveFileNameWithIndex(utils.ELEVES_FOLDER,eleveIndex);
	objectJson.index = eleveIndex;
	cache.updateDATA(exports.data.eleves,objectJson);
}

exports.fillCacheWithFile = function(file) {
	var objectJson = utils.parseFileName(file);
	if (objectJson) {
		//var table = objectJson.data; //.split(".");
		//console.log("objectJson = "+ JSON.stringify(objectJson.data));
		objectJson.nom = objectJson.data.nom;
		objectJson.prenom = objectJson.data.prenom;
		objectJson.id = objectJson.data.id;
		objectJson.groupe_classe = objectJson.data.groupe_classe;
		objectJson.path = file.Path;
		var index = exports.getJsonIndexForEleve(objectJson);
		objectJson.index = index;
		objectJson.data = '';
//		console.log("objectJson = "+ JSON.stringify(objectJson));
	}
	exports.data.eleves.push(objectJson);
}


// Browsing functions
exports.browseAllEleveFolders = function() {
	var files = utils.browseAllFolders(utils.ELEVES_FOLDER);
	files.forEach(function(file)
	{
		exports.fillCacheWithFile(file);
	});
	return exports.data.eleves;
}

exports.removeEleve = function(eleveIndex) {
	return cache.removeDATA(exports.data.eleves,eleveIndex);
}
