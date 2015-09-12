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
        //eleve.id = Math.floor((Math.random() * 10000));
        eleve.id = 0
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

	global_groupe.eleveCompetencesMax = function(eleve) {
		var tempCompetences = [];
		eleve.competences.forEach(function(data) {tempCompetences.push(data)});
//		tempCompetences.sort(function(data) {return -data.score});
		for (var competence_index = tempCompetences.length-1; competence_index >=0;competence_index--)
			if (eleve.competences[competence_index].score < 5)	tempCompetences.splice(competence_index,1);
		return tempCompetences;
	};

	global_groupe.eleveCompetencesFortes = function(eleve) {
		var tempCompetences = [];
		eleve.competences.forEach(function(data) {tempCompetences.push(data)});
		tempCompetences.sort(function(data1,data2) {return data2.score-data1.score});
		for (var competence_index = tempCompetences.length-1; competence_index >=0;competence_index--)
			if (tempCompetences[competence_index].score < tempCompetences[0].score) tempCompetences.splice(competence_index,1);
		return tempCompetences;
	};

	global_groupe.eleveCompetencesFaibles = function(eleve) {
		var tempCompetences = [];
		eleve.competences.forEach(function(data) {tempCompetences.push(data)});
		tempCompetences.sort(function(data1,data2) {return data1.score-data2.score});
		for (var competence_index = tempCompetences.length-1; competence_index >=0;competence_index--)
			if (tempCompetences[competence_index].score > tempCompetences[0].score) tempCompetences.splice(competence_index,1);
		return tempCompetences;
	};

	global_groupe.eleveCompetencesMin = function(eleve) {
		var tempCompetences = [];
		eleve.competences.forEach(function(data) {tempCompetences.push(data)});
		for (var competence_index = tempCompetences.length-1; competence_index >=0;competence_index--)
			if (eleve.competences[competence_index].score > 1)	tempCompetences.splice(competence_index,1);
		return tempCompetences;
	};

	global_groupe.generateGroupeEmilieEtape1 = function(groupe,groupe_eleves,competence_list){
		var groupe_classe_list = [];

		// Trouver les eleves qui ont 1 competence au max. Parmi ceux-ci, selectionner ceux qui maximisent l'ecart type sur les competences
		// Ces eleves formeront les tetes de groupe. Si 6+ eleves trouves, on en selectionne que 5.
		for (var eleve_index = groupe_eleves.length-1; eleve_index >=0; eleve_index-- ) {
			var eleve = groupe_eleves[eleve_index];
			var maxCompetences = global_groupe.eleveCompetencesMax(eleve);
			if (maxCompetences && maxCompetences.length == 1) {
				var minCompetences = global_groupe.eleveCompetencesMin(eleve);
				if (minCompetences && minCompetences.length == 1) {
					groupe_classe_list.push({nom : groupe.nom + " "+(groupe_classe_list.length+1) , eleves : [] });
					eleve.groupe_classe_groupe = groupe_classe_list[groupe_classe_list.length-1].nom
					// On essaye de sauver l'eleve en base
					EleveServices.saveData(eleve);
					groupe_classe_list[groupe_classe_list.length-1].eleves.push(eleve);
					groupe_eleves.splice(eleve_index,1);
					if (groupe_classe_list.length >= 5) break;
				}
			}
		}

		if (groupe_classe_list.length < 3) {
			for (var eleve_index = groupe_eleves.length-1; eleve_index >=0; eleve_index-- ) {
				var eleve = groupe_eleves[eleve_index];
				var maxCompetences = global_groupe.eleveCompetencesMax(eleve);
				if (maxCompetences && maxCompetences.length == 1) {
					var competencesFaibles = global_groupe.eleveCompetencesFaibles(eleve);
					if (competencesFaibles && competencesFaibles.length >= 1 && competencesFaibles[0].score == 2) {
						groupe_classe_list.push({nom : groupe.nom + " "+(groupe_classe_list.length+1) , eleves : [] });
						eleve.groupe_classe_groupe = groupe_classe_list[groupe_classe_list.length-1].nom
						// On essaye de sauver l'eleve en base
						EleveServices.saveData(eleve);
						groupe_classe_list[groupe_classe_list.length-1].eleves.push(eleve);
   						groupe_eleves.splice(eleve_index,1);
						if (groupe_classe_list.length >= 5) break;
					}
				}
			}

        }

		global_groupe.setGlobalGroupe({nom:groupe.nom, groupes:groupe_classe_list});
		return groupe_classe_list;
	}

	global_groupe.calculScoreSurCompMin = function(eleve,competenceMin) {
		var score = 0;
		var competenceEleve = parseInt(eleve.competences[competenceMin.id-1].score);

		switch(competenceEleve) {
			case 5:		score += 0;	break;
			case 4:		score += 5;	break;
			case 3:		score += 15;break;
			case 2:
			case 1:		score += 25;break;
		}
		return score;
	}

	global_groupe.scoreEleveMatching2 = function(eleve1,eleve2,nbElevesDansGroupe,competenceMin) {
		var score = 0.0;

		eleve1.competences.forEach(function(competenceEleve1) {
			if (competenceMin && competenceEleve1.id == competenceMin.id) return 0;

			var competenceEleve2 = parseInt(eleve2.competences[competenceEleve1.id-1].score);

			switch(parseInt(competenceEleve1.score)) {
			case 1:
				score+=global_groupe.calculScoreSurCompMin(eleve2,competenceMin)
				break;
			case 5:
				switch(competenceEleve2) {
					case 5: 	score += 8./nbElevesDansGroupe;break;
					case 4:		score += 6./nbElevesDansGroupe;break;
					case 1:		score += 4./nbElevesDansGroupe;break;
					case 2:		score += 2./nbElevesDansGroupe;break;
					case 3:		score += 0./nbElevesDansGroupe;break;
				}
				break;
			case 4:
				switch(competenceEleve2) {
					case 1: 	score += 4./nbElevesDansGroupe;break;
					case 2:		score += 3./nbElevesDansGroupe;break;
					case 5:		score += 2./nbElevesDansGroupe;break;
					case 4:		score += 1./nbElevesDansGroupe;break;
					case 3:		score += 0./nbElevesDansGroupe;break;
				}
				break;
			case 3:
			case 2:
				switch(competenceEleve2) {
					case 5: 	score += 4./nbElevesDansGroupe;break;
					case 4:		score += 3./nbElevesDansGroupe;break;
					case 1:		score += 2./nbElevesDansGroupe;break;
					case 2:		score += 1./nbElevesDansGroupe;break;
					case 3:		score += 0./nbElevesDansGroupe;break;
				}
				break;
			}
		});
		return Math.floor(score);
	};

	/**
	 * Parametres:
	 * - groupe: ne sert qu'a recuperer le nom du groupe
	 * - groupe_eleves: eleves qu'il reste a placer
	 */

	global_groupe.generateGroupeEmilieEtape2Prime = function(groupe,groupe_eleves) {
		var groupe_classe_list = global_groupe.getGlobalGroupe().groupes;

		//Pour chaque groupe, la competence forte du nouvel eleve doit etre la competence faible du dernier entre dans le groupe.
		groupe_classe_list.forEach(function(groupe_classe_groupe) {
			if (groupe_eleves.length == 0) return;

			var shortlist_eleves = [];
			var dernierEleveEntre = groupe_classe_groupe.eleves[groupe_classe_groupe.eleves.length-1];
			var competencesFaibles = global_groupe.eleveCompetencesFaibles(dernierEleveEntre);
			groupe_classe_groupe.eleves.forEach(function(eleve_groupe) {
				groupe_eleves.forEach(function(eleve) {
					var scores = [];
					// On cherche a minimiser le score de l'eleve qui va rentrer dans le groupe par rapport a la moins bonne competence du dernier eleve rentre
					competencesFaibles.forEach(function(competenceFaible) {
						var score = global_groupe.calculScoreSurCompMin(eleve,competenceFaible);
						score += global_groupe.scoreEleveMatching2(eleve_groupe, eleve, groupe_classe_groupe.eleves.length, competenceFaible);
						//if (eleve.nom == "Eleve13") alert("Matching "+eleve.nom + " tete_groupe "+tete_groupe.nom + " score = " + score);
						scores.push({score:score,competence:competenceFaible.id});
					});
					scores.sort(function(data){return data.score});
					eleve.tempMatchScore=scores[0].score;
					eleve.tempMatchComp=scores[0].competence;
				});
				groupe_eleves.sort(function(eleve1,eleve2) {return eleve1.tempMatchScore-eleve2.tempMatchScore})

				var eleve = groupe_eleves[0];
				// Je garde le nom du meilleur match d'eleve pour chaque eleve du groupe
				shortlist_eleves.push({eleve: eleve, score: eleve.tempMatchScore, competence: eleve.tempMatchComp});
			});

			// Je trie maintenant le resultat obtenu
			shortlist_eleves.sort(function(best_match1,best_match2) {return best_match1.score-best_match2.score});

			//alert(JSON.stringify(shortlist_eleves));

			// Je cherche l'eleve qui a le meilleur resultat.
			var best_match = shortlist_eleves[0];
			for (var index = groupe_eleves.length-1; index >= 0;index--) {
				if (groupe_eleves[index].nom == best_match.eleve.nom &&
				    groupe_eleves[index].id == best_match.eleve.id) {
					groupe_eleves.splice(index,1);
					break;
				}
			}
			best_match.eleve.justification = "Score: "+best_match.score + " Competence: "+best_match.competence ;
			//alert(best_match.eleve.justification);
			best_match.eleve.groupe_classe_groupe = dernierEleveEntre.groupe_classe_groupe;
			groupe_classe_groupe.eleves.push(best_match.eleve);
			// On essaye de sauver l'eleve en base
			EleveServices.saveData(best_match.eleve);
		});

		global_groupe.setGlobalGroupe({nom:groupe.nom, groupes:groupe_classe_list});
		return groupe_classe_list;
	}


	/**
	 * Parametres:
	 * - groupe: ne sert qu'a recuperer le nom du groupe
	 * - groupe_eleves: eleves qu'il reste a placer
	 * - competence_list : liste des competences
	 */
	global_groupe.generateGroupeEmilieAlgo2 = function(groupe,groupe_eleves,competence_list){
		// on repete l'etape 2 jusqu'a ce que l'on ne puisse plus placer d'eleves
		var groupe_eleves_size = groupe_eleves.length;
		//for (var i = 0; i < 10; i++) {
			global_groupe.generateGroupeEmilieEtape2Prime(groupe,groupe_eleves);
		//	if (groupe_eleves_size == groupe_eleves.length) break;
			groupe_eleves_size = groupe_eleves.length;
		//}

		//global_groupe.setGlobalGroupe({nom:groupe.nom, groupes:groupe_classe_list});
		//return groupe_classe_list;
    };

	return global_groupe;
});
