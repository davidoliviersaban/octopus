'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'googlechart'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
  // Home
    when('/', {
        templateUrl: 'partials/eleve-all',
        controller: AllElevesCtrl
      }).
  // All Eleves
      when('/eleve-all', {
        templateUrl: 'partials/eleve-all',
        controller: AllElevesCtrl
      }).
  // Eleves details
      when('/eleve-details', {
        templateUrl: 'partials/eleve-details',
        controller: EleveDetailCtrl
      }).
  // All Groupes
      when('/groupe-all', {
        templateUrl: 'partials/groupe-all',
        controller: AllGroupesCtrl
      }).
  // Groupes details
      when('/groupe-details', {
        templateUrl: 'partials/groupe-details',
        controller: GroupeDetailCtrl
      }).
  // Default
	  otherwise({
        redirectTo: '/'
      });

  $locationProvider.html5Mode(true);
});
