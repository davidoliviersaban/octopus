'use strict';
var mkdirp = require('mkdirp');
var  fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.ELEVES_FOLDER = "../eleves/";
//exports.GROUPES_FOLDER = "../groupes/";

/**
 * This method aims at comparing 2 patients.
 * it compares first the names, then the surnames, then the id. Provided both values are in the input.
 * If not, the parameter not provided is supposed to match the corresponding parameter, i.e.:
 *    if object1.name is undefined, it will match any name of object2.
 */
exports.compareInputs = function(object1,object2) {

	if (!object1.id || object1.id == "undefined") object1.id = -1;
	if (!object1.nom || object1.nom == "undefined") object1.nom = "";
	if (!object1.prenom || object1.prenom == "undefined") object1.prenom = "";

//	console.log("compareInputs compares NAMES");
	if (object1.nom != "" && object1.nom > object2.nom) return -1;
	else if (object1.nom != "" && object1.nom < object2.nom) return 1;

//	console.log("compareInputs compares SURNAMES");
	if (object1.prenom != ""  && object1.prenom > object2.prenom) return -1;
	else if (object1.prenom != ""  && object1.prenom < object2.prenom) return 1;

//	console.log("compareInputs compares IDS");
	if (object1.id != -1 && object1.id > object2.id) return -1;
	else if (object1.id != -1 && object1.id < object2.id) return 1;

	/*
	console.log("compareInputs should be identical"+
				"\nobject1 = "+JSON.stringify(object1)+
				"\nobject2 = "+JSON.stringify(object2));
	*/

	if ((object1.nom == "" || object2.nom == object1.nom)  &&
		(object1.id == -1 || object2.id == object1.id) &&
		(object1.prenom == "" || object2.prenom == object1.prenom)) return 0;
	
	console.log("LAST RESORT FOR compareInputs, returning -1");
	
	return -1;
}

exports.convertValue = function(input) {
	if (input)
		return input.replace(/[^A-Za-z0-9\-]/g,'_').toUpperCase();
	return input;
}

exports.resolveFileNameWithIndex = function(dataPath,index) {
	return path.join(dataPath,index+'.json');
};

exports.resolveFileName = function(dataPath,nom,prenom,id) {
	if (!nom || nom == "undefined") 
		nom = "";
	if (!prenom || prenom == "undefined") 
		prenom = "";
	
	nom = this.convertValue(nom);
	prenom = this.convertValue(prenom);

	if (nom == "" || prenom == "")
		return path.join(dataPath,nom+'.'+prenom+'.'+id+'.json');
	return path.join(dataPath,nom+'.'+prenom+'.'+id+'.json');
}

//exports.save = function(json_object,cache,nom,prenom,id,callback) {
//	var file = this.resolveFileName(cache,nom,prenom,id);
exports.saveV2 = function(json_object,cache,index,callback) {
	var file = this.resolveFileNameWithIndex(cache,index);
	console.log("creating "+file);
	mkdirp(path.dirname(file),function(err){
		if (err) {
			console.log("Error while creating folder" + err);
			callback(404);
		}
		else {
			try {
				console.log("DEBUG-utils: save "+JSON.stringify(json_object));
				fs.writeFileSync(file, 
					JSON.stringify(json_object).toString('utf-8'),
					'utf8');
			} catch(err) {
				console.log("Error occurred while saving file "+err);
				callback(404);
				return;
			}
			console.log("The file was saved!");
			callback(200);
		}
	});
}

//exports.open = function(cache,nom,prenom,id,callback) {
//	var file = this.resolveFileName(cache,nom,prenom,id);
exports.openV2 = function(cache,index,callback) {
	var file = this.resolveFileNameWithIndex(cache,index);
	console.log("opening "+file);

	fs.readFile(file,{encoding:'utf8'}, function(err,patientString) {
		if(err) {
			console.log(err);
			callback(404);
		}
		else {
			console.log("The file was read!");
			patientString = patientString.toString('utf8').	replace(/^\uFEFF/, '')
			.replace(/&gt/g,">")
			.replace(/&lt/g,"<");
//			replace(/"date": "([0-9]{4})([0-9]{2})([0-9]{2})"/g,"\"date\": \"$1-$2-$3\"").
//			replace(/"date_naissance": "([0-9]{4})([0-9]{2})([0-9]{2})"/g,"\"date_naissance\": \"$1-$2-$3\"");
			var objectJson =  JSON.parse(patientString);
//			objectJson.id = id;
			callback(200,objectJson);
		}
	});
}

exports.delete = function(filename,callback)
{
	if (fs.existsSync(filename)) {
		fs.unlinkSync(filename);
		if(callback) callback(200);
	}
	else {
		console.log(filename+" cannot be removed");
		if(callback) callback(404);
	}
}

exports.parseFileName = function(file) {
	if (file.IsDirectory) return null;
//	var match = /[.\\\/]+([\w\b-]*)\.([\w-]*)\.([0-9]*)\.json/.exec(file.Path);
//	if (match) {
//		return {nom: match[1], prenom: match[2], id: match[3], path : file.Path};
//	}
//	else {
		var objectString = fs.readFileSync(file.Path,'utf8');
		var objectJson = JSON.parse(objectString);
		return {data: objectJson, path : file.Path};
//	}
}


// Browsing functions
exports.browseAllFolders = function(currentDir) {
	var files = fs.readdirSync(currentDir,'utf8');

	var output = [];
	files.forEach(function (file) {
		try {
			var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
			if (isDirectory) {
				var filesTmp = exports.browseAllFolders(path.join(currentDir,file));
				filesTmp.forEach(function (fileTmp) {
					output.push(fileTmp);
				});
			} else {
				var ext = path.extname(file);
				output.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(currentDir, file) });
			}
		} catch(e) {
			console.log(e); 
		}
	});
	output = _.sortBy(output, function(f) { return f.Name });
//	console.log(JSON.stringify(output,null,3));
	return output;
}
