'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

var myApp = angular.module('myApp.services',[]);
myApp.service('ConversionServices', function() {
	
	this.convertJSONStringToTable = function(jsonString) {
		var table = [];
		var nextComma = 0;
		while ((nextComma=(jsonString.indexOf("}")+1)) > 0) {
			table.push(jsonString.substring(0,nextComma));
			jsonString = jsonString.substring(nextComma+1,jsonString.length);
		}
		return table;
	};
});


myApp.factory('EleveServices', function($http) {

	var global_eleve = {};
	if (sessionStorage && sessionStorage.getItem('GLOBAL_ELEVE'))
		global_eleve.data = JSON.parse(sessionStorage.getItem('GLOBAL_ELEVE'));
		
	global_eleve.createEleve = function(nom,prenom,groupe_classe) {
    	var eleve = {nom: nom, prenom: prenom, groupe_classe: groupe_classe, competences: [	{ "nom": "Soin/Minutie", "id": 1, "score": 1, "min": 1, "max": 5},
                                                                                            { "nom": "Organisation", "id": 2, "score": 2, "min": 1, "max": 5},
                                                                                            { "nom": "Restitution écrite", "id": 3, "min": 1, "max": 5},
                                                                                            { "nom": "Extraire de l'information", "id": 4, "min": 1, "max": 5},
                                                                                          	{ "nom": "Capacité à travailler en groupe", "id": 5, "min": 1, "max": 5}
                                                                                            ]};
        eleve.id = Math.floor((Math.random() * 10000));
        return eleve;
    };

	global_eleve.compareEleves = function(eleve1,eleve2) {
		if (!eleve1 || !eleve2) return false;
		return 	eleve1.nom == eleve2.nom && 
				eleve1.prenom == eleve2.prenom && 
				eleve1.id == eleve2.id &&
   				eleve1.classe == eleve2.classe;
	};

	global_eleve.hasGlobalEleve = function() {
		if (!sessionStorage || !global_eleve) return false;
		return (global_eleve.data=JSON.parse(sessionStorage.getItem('GLOBAL_ELEVE')))?true:false;
	};

	global_eleve.getGlobalEleveString = function() {
		if (global_eleve.hasGlobalEleve())
			return global_eleve.data.nom +" " + global_eleve.data.prenom +" [" + global_eleve.data.classe + "]";
		return "";
	}

	global_eleve.getGlobalEleve = function() {
		if (global_eleve.hasGlobalEleve()) return global_eleve.data;
		return null;
	};
   
	global_eleve.setGlobalEleve = function(eleve) {
		// This eleve should not be saved
		if (!eleve.nom && !eleve.prenom && !eleve.id) return;
		global_eleve.data = eleve;
		sessionStorage.setItem('GLOBAL_ELEVE',JSON.stringify(eleve));
	};

	global_eleve.getGlobalName = function() {
		if (global_eleve.hasGlobalEleve())
			return global_eleve.data.nom;
		return "";
	};

	global_eleve.getGlobalSurname = function() {
		if (global_eleve.hasGlobalEleve())
			return global_eleve.data.prenom;
		return "";
	};
	
	global_eleve.getAll = function(array,callback) {
		$http.post('/api/eleve/all',{data: array}).
			success(function(data, status, headers, config) {
				if(callback) callback(data,status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(data,status);
			});
	};
		
	global_eleve.readData = function(eleve,callback) {
		$http.post('/api/eleve/get/',eleve).
			success(function(data, status, headers, config) {
				global_eleve.setGlobalEleve(data);
				if(callback) callback(data,status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(data,status);
			});
	};
		
	global_eleve.saveData = function(eleve,callback) {
		var dataTMP = global_eleve.data;
		if(eleve) dataTMP = eleve;

		$http.post('/api/eleve/update/',dataTMP).
			success(function(data, status, headers, config) {
				global_eleve.setGlobalEleve(data);
				if(callback) callback(status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(status);
			});
	};

	global_eleve.deleteData = function(eleve,callback) {
		var dataTMP = global_eleve.data;
		if(eleve) dataTMP = eleve;

		$http.post('/api/eleve/delete/',dataTMP).
			success(function(data, status, headers, config) {
				if(callback) callback(status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(status);
			});
	};
	return global_eleve;
   
});

myApp.factory('GroupeServices', function($http) {

	var global_groupe = {};
	if (sessionStorage && sessionStorage.getItem('GLOBAL_GROUPE'))
		global_groupe.data = JSON.parse(sessionStorage.getItem('GLOBAL_GROUPE'));
		
	global_groupe.compareGroupes = function(groupe1,groupe2) {
		if (!groupe1 || !groupe2) return false;
		return 	groupe1.nom == groupe2.nom && 
				groupe1.id == groupe2.id;
	};

	global_groupe.hasGlobalGroupe = function() {
		if (!sessionStorage || !global_groupe) return false;
		return (global_groupe.data=JSON.parse(sessionStorage.getItem('GLOBAL_GROUPE')))?true:false;
	};

	global_groupe.getGlobalGroupe = function() {
		if (global_groupe.hasGlobalGroupe()) return global_groupe.data;
		return null;
	};
   
	global_groupe.setGlobalGroupe = function(groupe) {
		// This groupe should not be saved
		if (!groupe.nom) return;
		global_groupe.data = groupe;
		sessionStorage.setItem('GLOBAL_GROUPE',JSON.stringify(groupe));
	};

	global_groupe.getGlobalName = function() {
		if (global_groupe.hasGlobalGroupe())
			return global_groupe.data.nom;
		return "";
	};

	global_groupe.getGlobalSurname = function() {
		if (global_groupe.hasGlobalGroupe())
			return global_groupe.data.prenom;
		return "";
	};
	
	global_groupe.getAll = function(array,callback) {
		$http.post('/api/groupe/all',{data: array}).
			success(function(data, status, headers, config) {
				if(callback) callback(data,status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(data,status);
			});
	};
		
	global_groupe.readData = function(groupe,callback) {
		$http.post('/api/groupe/get/',groupe).
			success(function(data, status, headers, config) {
				global_groupe.setGlobalGroupe(data);
				if(callback) callback(data,status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(data,status);
			});
	};
		
	global_groupe.saveData = function(groupe,callback) {
		var dataTMP = global_groupe.data;
		if(groupe) dataTMP = groupe;

		$http.post('/api/groupe/update/',dataTMP).
			success(function(data, status, headers, config) {
				global_groupe.setGlobalGroupe(data);
				if(callback) callback(status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(status);
			});
	};

	global_groupe.deleteData = function(groupe,callback) {
		var dataTMP = global_groupe.data;
		if(groupe) dataTMP = groupe;

		$http.post('/api/groupe/delete/',dataTMP).
			success(function(data, status, headers, config) {
				if(callback) callback(status);
			}).
			error(function(data, status, headers, config) {
				if(callback) callback(status);
			});
	};

	global_groupe.generateGroupe = function(groupe,groupe_eleves,competence_list){
		var groupe_classe_list = [];

		competence_list.forEach(function(competence) {
//			alert("Distribution des eleves pour la competence "+competence.nom);
			var competence_index = competence.id-1;
			groupe_eleves.sort(function(eleve) {
					if (!eleve.competences || eleve.competences.length < (competence_index)) {
						alert("Eleve "+eleve.nom + " n'a pas la competence "+competence.nom + " correctement renseignee.");
					}
					return -eleve.competences[competence_index].score
				}
			);
			var groupe_index = 0;
			for (var eleve_index = groupe_eleves.length-1; eleve_index >=0; eleve_index-- ) {
				// Tant que mon groupe a la competence, je ne rajoute pas de personnes dans mon groupe
				for (  ;groupe_index < groupe_classe_list.length; groupe_index++) {
					var index = 0
					for (;
							index < groupe_classe_list[groupe_index].eleves.length &&
							groupe_classe_list[groupe_index].eleves[index].competences[competence_index].score >= competence.connu;
							index++);
					if (index < groupe_classe_list[groupe_index].eleves.length)  break;
				}
				var eleve = groupe_eleves[eleve_index];
				// Si un eleve a la bonne competence, je le rajoute a mon groupe et je passe au groupe suivant
				if (eleve.competences[competence_index].score >= competence.connu) {
					// comme les groupes ne sont pas necessairement crees a l'avance
					if (groupe_classe_list.length <= groupe_index) {
						groupe_classe_list.push({nom : groupe.nom + " "+groupe_index, groupe: groupe , eleves : []});
					}
					groupe_classe_list[groupe_index].eleves.push(eleve);
					groupe_eleves.splice(eleve_index,1);
					groupe_index++;

					// Je ne veux pas creer trop de groupes, je m'arrete donc a 7
					if (groupe_index >= 6) break;
				}
			}
		});
		if (groupe_eleves.length > 0) alert("Il reste des eleves a placer "+JSON.stringify(groupe_eleves));
		alert(groupe_classe_list.length + " groupes ont ete crees");
		this.setGlobalGroupe(groupe_classe_list);
		return groupe_classe_list;
    };


	global_groupe.generateGroupeEmilie = function(groupe,groupe_eleves,competence_list){
		var groupe_classe_list = [];
		// Trouver les eleves qui ont 1 competence au max. Parmi ceux-ci, selectionner ceux qui maximisent l'ecart type sur les competences
		// Ces eleves formeront les tetes de groupe. Si 6+ eleves trouves, on en selectionne que 5.
		for (var eleve_index = groupe_eleves.length-1; eleve_index >=0; eleve_index-- ) {
			var eleve = groupe_eleves[eleve_index];
			var maxCompetence = this.eleveMaxCompetence(eleve);
			if (maxCompetence.score) {
				var minCompetence = this.eleveMinCompetence(eleve);
				if (minCompetence) {
					groupe_classe_list.push({nom : groupe.nom + " "+(groupe_classe_list.length+1), groupe: groupe , eleves : [] });
					groupe_classe_list[groupe_classe_list.length-1].eleves.push(eleve);
					groupe_eleves.splice(eleve_index,1);
					if (groupe_classe_list.length >= 5) break;
				}
			}
		}
		//Pour chaque groupe, la competence forte du nouvel eleve doit etre la competence faible de la tete de groupe.
		 // La competence faible du nouvel eleve ne peut pas etre la competence fort de la tete de groupe.
		this.setGlobalGroupe({nom:groupe.nom, groupes:groupe_classe_list});
		return groupe_classe_list;
    };

	global_groupe.eleveMaxCompetence = function(eleve) {
		for (var competence_index=0; competence_index < eleve.competences.length;competence_index++)
			if (eleve.competences[competence_index].score == eleve.competences[competence_index].max)
				return eleve.competences[competence_index];
		return false;
	};

	global_groupe.eleveMinCompetence = function(eleve) {
		for (var competence_index=0; competence_index < eleve.competences.length;competence_index++)
			if (eleve.competences[competence_index].score == eleve.competences[competence_index].min)
				return eleve.competences[competence_index];
		return false;
	};


	return global_groupe;
});
