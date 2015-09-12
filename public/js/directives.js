'use strict';

/* Directives */
var module = angular.module('myApp.directives', []);
module.directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });

var app = angular.module('myApp.directives', []);
app.directive('eleveAutocomplete', ['$http', function($http) {
	return {
		restrict: 'A',
        link: function(scope, elem, attr) {
			
			function filtereleve(array, term) {
				var matcher = new RegExp('(' + $.ui.autocomplete.escapeRegex(term) + ')', 'gi');
				return $.grep(array, function (item) {
					return matcher.test(item.name);
				});
			}
			
			function highlighteleve(text, term) {
				var matcher = new RegExp('(' + $.ui.autocomplete.escapeRegex(term) + ')', 'gi');
            	return text.replace(matcher, '<strong>$1</strong>');
				//return text.replace(matcher, '$1');
			}
			
        	// elem is a jquery lite object if jquery is not present, but with jquery and jquery ui, it will be a full jquery object.
            elem.autocomplete({
    			source: function(request, response) {
    			    // exemple appel rest pour filtrer les résultats
    				/*$http.get("/magicsupremacy/rest/api/1/eleve/search?name=" + this.term).success(function(data) {
    					response(data.eleveslist);
    		        });*/
					
    				response(filtereleve(eleves, this.term));
                },
                focus: function(event, ui) {
                    // on ne fait rien au survol de la souris sur les choix de la liste proposée
                	return false;
                },
                select: function(event, ui) {
                    // lors de la sélection d'un choix dans la liste, on affiche le libellé de la carte et on déclenche la recherche
                	scope.eleve = ui.item.label;
                    scope.$apply();
                    return false;
                },
                appendTo : attr.appendTo
                
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                // set du label pour récupération dans la méthode select
            	item.label = item.name;
                // nom de carte highlighted
				var eleveNameHighlighted = highlighteleve(item.name, this.term);
            	
                // construction de l'affichage d'une ligne
                var eleveLine = $("<div>").html(eleveNameHighlighted);
                // sortie pour jquery-ui
                return $("<li>").append("<a>" + $("<div>").append(eleveLine).html() + "</a>").appendTo(ul);
				//return eleveLine;
            };
        }
    }
}]);