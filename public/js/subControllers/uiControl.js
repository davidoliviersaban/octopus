
function getGlobalEleveString(EleveServices) {
	if (EleveServices.hasGlobalEleve()) {
		return "Eleve actuel <a href='/eleve-details'>"+ EleveServices.getGlobalEleveString() +"</a>";
	}
	return "Pas de eleve actuellement";
};

var getElementByClass = function(tagName,className) {
	var elements=document.getElementsByTagName(tagName);
	var i;
	var result = [];
	for (i in elements) {
        if((' ' + elements[i].className + ' ').indexOf(' ' + className + ' ') > -1) {
            result.push(elements[i]);
        }
    }
	return result;
}


function updateWorkingOn(tab_name,EleveServices,GroupeServices) 
{
	/*
	document.getElementById("working-on-eleve").innerHTML = getGlobalEleveString(EleveServices);
	var topnav=getElementByClass('div','topnav');
	var links = topnav[0].getElementsByTagName('li');
	var eleve = EleveServices.getGlobalEleve();
	if (links) {
		for (var i=0;i < links.length;i++) {
			var lookup = links[i].id;
			if ((""+lookup).indexOf(tab_name) >= 0)
				links[i].className="active";
			else
				links[i].className="";
			
			var tempLink = links[i].getElementsByTagName('a');
//			alert(tempLink[0].innerHTML);
			if (eleve) {
				if (tempLink[0].innerHTML == "Consultations" && eleve.consultations && eleve.consultations.length > 0) tempLink[0].innerHTML = "* Consultations";
				else if (tempLink[0].innerHTML == "* Consultations" && (!eleve.consultations || eleve.consultations.length == 0)) tempLink[0].innerHTML = "Consultations";
				if (tempLink[0].innerHTML == "Audio" && eleve.audiometries && eleve.audiometries.length > 0) tempLink[0].innerHTML = "* Audio";
				else if (tempLink[0].innerHTML == "* Audio" && (!eleve.audiometries || eleve.audiometries.length == 0)) tempLink[0].innerHTML = "Audio";
				if (tempLink[0].innerHTML == "Documents" && ((eleve.courriers&&eleve.courriers.length > 0)||(eleve.emails && eleve.emails.length > 0))) tempLink[0].innerHTML = "* Documents";
				else if (tempLink[0].innerHTML == "* Documents" && ((!eleve.courriers || eleve.courriers.length == 0) && (!eleve.emails || eleve.emails.length == 0))) tempLink[0].innerHTML = "Documents";
			}
		}
	}

	topnav=getElementByClass('div','groupeOrEleve');
	links = topnav[0].getElementsByTagName('li');
	if (links) {
		for (var i=0;i < links.length;i++) {
			var lookup = links[i].id;
			if (tab_name.indexOf("eleve") >=0 && (""+lookup).indexOf("eleve") >= 0){
				links[i].className="active";
			}
			else if (tab_name.indexOf("groupe") >=0 && (""+lookup).indexOf("groupe") >= 0) {
				links[i].className="active";
			}
			else {
				links[i].className="";
			}
		}
	}
	*/
}