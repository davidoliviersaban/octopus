'use strict';

var Competences = [
                   		{ "nom": "Organisation", "description": "Je sais organiser mon travail", "id": 1, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Comprehension", "description": "Je comprends les consignes", "id": 2, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Minutie", "description": "Je travaille minutieusement" , "id": 3, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Autre", "description": "Autre competence" , "id": 4 , "min": 1, "max": 5, "connu": 3},
						{ "nom": "Autre2", "description": "Autre competence2" , "id": 5 , "min": 1, "max": 5, "connu": 3}
                   	];

var myApp = angular.module('myApp.controllers',[]);

/**
 * Controller that contains all groupes and the waiting list
 */
//myApp.controller('AllGroupesCtrl', function ($scope, $http, $location, $routeParams) {
function AllGroupesCtrl($scope, $http, $location, $routeParams,GroupeServices,EleveServices) {

	$scope.groupe = GroupeServices.getGlobalGroupe();
	if ($scope.groupe && $scope.groupe.eleves) $scope.groupe_eleve_list = $scope.groupe.eleves;
	
	$scope.getAllGroupes = function(dataString) {
		var convertToArray = dataString.replace(/ +/g,',');
		GroupeServices.getAll(convertToArray,function(data, status) {
				if (status != 200) {
					alert("Un probleme est survenu lors de la lecture des groupes");
					return;	
				}
				$scope.groupe_list = data;
				updateWorkingOn("groupe-all",EleveServices,GroupeServices);
			}
		)};
	
	$scope.createGroupe = function(nom,matiere,classe) {
		$scope.groupe = {nom: nom, matiere: matiere, classe: classe};
		$scope.groupe.id = Math.floor((Math.random() * 10000));

		GroupeServices.saveData($scope.groupe,function(status) {
			if (status == 200) {
				$scope.groupe = GroupeServices.getGlobalGroupe();
				$scope.groupe_list.push($scope.groupe);
				viewGroupeDetails($scope.groupe);
			}
			else {
				alert("Erreur lors de la creation du groupe: "+nom+" "+classe);
			}
		});

	};
	
	$scope.viewGroupeDetails = function(groupe) {
		GroupeServices.setGlobalGroupe({nom: groupe.nom, matiere : groupe.matiere, id: groupe.id, classe:groupe.classe, path: groupe.path});
		$location.url('/groupe-details');
	};
	
	$scope.removeGroupe = function(groupeJSON) {
		var index = $scope.groupe_list.indexOf(groupeJSON);
		if (index == -1) return;
		GroupeServices.deleteData($scope.groupe_list[index],function(status){
			if(status==200){
				if (index >= 0) {
					$scope.groupe_list.splice(index,1);
				}
			}
			else alert("Probleme lors de la suppression du groupe");
		});
	};

	$scope.defineGroupeClasseSize = function(size,groupe_classe) {
		$scope.groupe_eleve_list = [];
		for (var eleve_index = 1; eleve_index <=size; eleve_index++) {
			$scope.groupe_eleve_list.push(EleveServices.createEleve("Eleve"+eleve_index, "toto", groupe_classe));
		}
		$scope.groupe = {nom:groupe_classe};
	};

	$scope.saveAllEleves = function() {
		$scope.groupe_eleve_list.forEach(function(data){
			EleveServices.saveData(data,function(status) {
				if (status == 200) {
				}
				else {
					alert("Erreur lors de la creation du eleve: "+nom+" "+prenom);
				}
			})
		});
	}

	$scope.createGroupe = function() {
		var tempEleveList = [];
		$scope.groupe_eleve_list.forEach(function(data){tempEleveList.push(data)});
		GroupeServices.generateGroupeEmilie($scope.groupe,tempEleveList,Competences);
		$scope.groupe = GroupeServices.getGlobalGroupe();
	}

	$scope.createGroupeEtape1 = function() {
		var tempEleveList = $scope.groupe_eleve_list;
		if (! $scope.groupe_eleve_list) { alert ("Groupes non pre definis"); return }
		//$scope.groupe_eleve_list.forEach(function(data){tempEleveList.push(data)});
		GroupeServices.generateGroupeEmilieEtape1($scope.groupe,tempEleveList,Competences);
		$scope.groupe = GroupeServices.getGlobalGroupe();
	}

	$scope.createGroupeEtape2 = function() {
		var tempEleveList = $scope.groupe_eleve_list;
		if (! $scope.groupe_eleve_list) { alert ("Groupes non pre definis"); return }
		//$scope.groupe_eleve_list.forEach(function(data){tempEleveList.push(data)});
		GroupeServices.generateGroupeEmilieAlgo2($scope.groupe,tempEleveList,Competences);
		$scope.groupe = GroupeServices.getGlobalGroupe();
	}

	if (GroupeServices.hasGlobalGroupe())
		$scope.groupe = GroupeServices.getGlobalGroupe();

//	$scope.getAllGroupes("");
}
//);

/**
 * Controller that contains groupe detailed information
 */

//myApp.controller('GroupeDetailCtrl', );
function GroupeDetailCtrl ($scope, $http, $location, $routeParams, GroupeServices, EleveServices) {

	$scope.saveGroupe = function(groupe) {
		GroupeServices.saveData(groupe,function(status){if(status!=200) alert("An error occurred");});
	}
	
	$scope.getGroupe = function(groupe) {
		if (!GroupeServices.getGlobalGroupe()) {
			updateWorkingOn("groupe-detail",EleveServices,GroupeServices);
			return;
		}
		GroupeServices.readData(GroupeServices.getGlobalGroupe(),function(data,status){
			(status==200)?
				$scope.groupe=data:
				alert("["+status+"] Une erreur s'est produite pendant la lecture du groupe: "+$scope.groupe.nom + " " +$scope.groupe.prenom);
			updateWorkingOn("groupe-detail",EleveServices,GroupeServices);
		});
	}



	$scope.getGroupe();

};

