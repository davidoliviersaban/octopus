'use strict';
var _ = require('underscore');
var utils = require('./common_utils');
 
/**
 * This method generates a json object that will be used as an index.
 * This index will be used as comparator and to retrieve the corresponding patients.
 */
exports.getJsonIndex = function(DATA,cachePath,nom,prenom,id, groupe_classe) {
	console.log("DEBUG-cache: getJsonIndex(): "+nom+","+prenom+","+id+","+classe);
	
	if (!nom || nom == "undefined") { 
		nom = ''; 
	}
	if (!prenom || prenom == "undefined") { 
		prenom = ''; 
	}
	if (!classe|| classe == "undefined") {
		classe = '';
	}
	var objectIndex = {index: utils.convertValue(nom)+"."+utils.convertValue(prenom)+"."+id+"."+groupe_classe,nom: nom,prenom:prenom,id:id,classe:classe};
	objectIndex.path=utils.resolveFileName(cachePath,nom,prenom,id);
	
	return objectIndex;
}

exports.getJsonIndexV2 = function(DATA,cachePath,params) {
	console.log("DEBUG-cache: getJsonIndexV2(): "+params);
	var index;
	params.forEach(function(data) {
		if (!data || data == "undefined") data = '';
		data = utils.convertValue( "" + data );
		if (index)
			index = index + "." + data;
		else
			index = data;
	});

//	console.log("DEBUG-cache: getJsonIndexV2(): index = "+index);
	if (!index) index = ".";
	var objectIndex = {index: index};
//	objectIndex.path=utils.resolveFileNameWithIndex(cachePath,index);
	return objectIndex.index;
}

exports.getPositionInDATAList = function(DATA,inputIndex) 
{
	console.log("DEBUG-cache: getPositionInDATAList(inputIndex) "+JSON.stringify(inputIndex));
	
	var position = _.sortedIndex(DATA,inputIndex,'index');
	console.log("DEBUG-cache: getPositionInDATAList(inputIndex) "+position);
	console.log("DEBUG-cache: getPositionInDATAList(inputIndex) "+JSON.stringify(DATA[position]));
	if (DATA.length <= position) return {position: position, match : false };
	
	return {position: position, match : DATA[position].index == inputIndex.index};
}

exports.getIndexInDATAList = function(DATA,inputIndex) 
{
	console.log("DEBUG-cache: getIndexInDATAList(inputIndex) "+JSON.stringify(inputIndex));
	var filteredList = exports.getFilteredDATAList(DATA,[inputIndex.index]);
	return {data: filteredList, match: filteredList.length >0};	
}


exports.getFilteredDATAList = function(DATA,elements) 
{
	console.log("DEBUG-cache: getFilteredDATAList(elements) "+JSON.stringify(elements));
	
	var filteredList = DATA;
	if (elements && elements.length > 0) {
		elements.forEach(function(search) {
//			console.log("TOREMOVE DEBUG-cache: getFilteredDATAList(elements) "+ search);
			filteredList  = _.filter(filteredList, function(element){ 
//				console.log("TOREMOVE DEBUG-cache: getFilteredDATAList(elements) "+ JSON.stringify(element));
				return (element.index.indexOf(""+search)>=0);
			});
		});
	}
	return filteredList;
}

exports.updateDATA = function(DATA, objectIndex) {
	console.log("DEBUG-cache: updateDATA() ");
	var indexJson = exports.getPositionInDATAList(DATA,objectIndex);

	if (indexJson.match) {
		DATA.splice(indexJson.position,1,objectIndex);
		console.log(objectIndex.nom+": found at "+indexJson.position+ " and updated");
	}
	else {
		DATA.splice(indexJson.position+1,0,objectIndex);
		console.log(JSON.stringify(objectIndex)+": created");
	}
	//cache.data.patients = _.sortBy(cache.data.patients, function(f) { return f.nom });
}

exports.removeDATA = function(DATA, objectIndex) {
	console.log("DEBUG-cache : deleteDATA()");

	//var indexInDATAList = exports.getIndexInDATAList(DATA,objectIndex);

	var indexInDATAList = exports.getPositionInDATAList(DATA,objectIndex);
	if (indexInDATAList.match)
		DATA.splice(indexInDATAList.position,1);
	return indexInDATAList.match;
}