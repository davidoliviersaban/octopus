'use strict';

var myApp = angular.module('myApp.controllers',[]);

var Competences = [
                   		{ "nom": "Organisation", "description": "Je sais organiser mon travail", "id": 1, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Comprehension", "description": "Je comprends les consignes", "id": 2, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Minutie", "description": "Je travaille minutieusement" , "id": 3, "min": 1, "max": 5, "connu": 3},
                   		{ "nom": "Autre", "description": "Autre competence" , "id": 4 , "min": 1, "max": 5, "connu": 3},
						{ "nom": "Autre2", "description": "Autre competence2" , "id": 5 , "min": 1, "max": 5, "connu": 3}
                   	];


/**
 * Controller that contains all eleves and the waiting list
 */
//myApp.controller('AllElevesCtrl', function ($scope, $http, $location, $routeParams) {
function AllElevesCtrl($scope, $http, $location, $routeParams,EleveServices,GroupeServices) {
	
	$scope.eleve = EleveServices.getGlobalEleve();
	$scope.groupe_classe = [];

	$scope.getAllEleves = function(dataString) {
		var convertToArray = dataString.replace(/ +/g,',');//.split(",");
		EleveServices.getAll(convertToArray,function(data, status) {
				if (status != 200) {
					alert("Un probleme est survenu lors de la lecture des eleves");
					return;
				}
				$scope.eleve_list = data;
				updateWorkingOn("eleve-all",EleveServices,GroupeServices);
			}
		)};
	

	$scope.addToGroupe = function(eleve) {
		if (!$scope.groupe_classe) $scope.groupe_classe = [];
		EleveServices.setGlobalEleve(eleve);
		EleveServices.readData(EleveServices.getGlobalEleve(),function(data,status){
			$scope.groupe_classe.push(data);
		});
	};

	$scope.createGroupe = function() {
		if (! $scope.eleve_list || $scope.eleve_list.length == 0) {
		//if (!$scope.groupe_classe || $scope.groupe_classe.length == 0) {
			alert("Rien a faire pour creer un groupe vide");
			return;
		}
		$scope.groupe = {nom: $scope.eleve_list[0].groupe_classe};
		$scope.groupe_eleve_list = [];
		$scope.eleve_list.forEach(function(eleve){
			EleveServices.setGlobalEleve(eleve);
			EleveServices.readData(EleveServices.getGlobalEleve(),function(data,status){
				$scope.groupe_eleve_list.push(data);
				$scope.groupe.eleves = $scope.groupe_eleve_list;
				GroupeServices.setGlobalGroupe($scope.groupe);
			})
		});
		$location.url('/groupe-all');
//		var tempEleveList = [];
//		$scope.groupe_eleve_list.forEach(function(data){tempEleveList.push(data)});
//		GroupeServices.generateGroupeEmilie($scope.groupe,tempEleveList,Competences);
//		$scope.groupe = GroupeServices.getGlobalGroupe();
	};

	$scope.createEleve = function(nom,prenom,groupe_classe) {
		$scope.eleve = EleveServices.createEleve(nom, prenom, groupe_classe);
		EleveServices.saveData($scope.eleve,function(status) {
			if (status == 200) {
				$scope.eleve = EleveServices.getGlobalEleve();
				$scope.eleve_list.push($scope.eleve);
				$scope.viewEleveDetails($scope.eleve);
			}
			else {
				alert("Erreur lors de la creation du eleve: "+nom+" "+prenom);
			}
		});
	};
		
	$scope.viewEleveDetails = function(eleve) {
		EleveServices.setGlobalEleve(eleve);
		$location.url('/eleve-details');
	};

	$scope.removeEleve = function(eleveJSON) {
		var index = $scope.eleve_list.indexOf(eleveJSON);
		if (index == -1) return;
		EleveServices.deleteData($scope.eleve_list[index],function(status){
			if(status==200){
//				$scope.getAllEleves($scope.nom);
				if (index >= 0) {
					$scope.eleve_list.splice(index,1);
				}
			}
			else alert("Probleme lors de la suppression du eleve");
		});
	};
	
	$scope.getTotalEleves = function()
	{
		if (!$scope.eleve_list.length) return 0;
		return $scope.eleve_list.length;
	}

	$scope.getAllEleves("");
}

/**
 * Controller that contains eleve detailed information
 */

//myApp.controller('EleveDetailCtrl', );
function EleveDetailCtrl ($scope, $http, $location, $routeParams,EleveServices,GroupeServices) {
	
	$scope.saveEleve = function(eleve) {
		eleve.competences = $scope.Competences;
		EleveServices.saveData(eleve,function(status){if(status!=200) alert("An error occurred");});
	}
	
	$scope.getEleve = function() {
		EleveServices.readData(EleveServices.getGlobalEleve(),function(data,status){
			$scope.eleve=EleveServices.getGlobalEleve();
			(status==200)?
				$scope.eleve=data:
				alert("["+status+"] Une erreur s'est produite pendant la lecture du eleve: "+$scope.eleve.nom + " " +$scope.eleve.prenom);
			updateWorkingOn("eleve-detail",EleveServices,GroupeServices);

			// On affiche les competences de l'eleve si elles sont remplies, sinon on les recupere du server.
			if ($scope.eleve.competences) {
				$scope.Competences = $scope.eleve.competences;
			}
			else {
			// TODO recuperer du server les donnees de competences.
				$scope.Competences = Competences;
			}
		});
	}

	$scope.getEleve();
};