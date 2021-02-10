
// ----------------------------------on input/text enter------------------------------------------
$('.usrInput').on('keyup keypress', function (e) {
	var keyCode = e.keyCode || e.which;
	var text = $(".usrInput").val();
	if (keyCode === 13) {
		if (text == "" || $.trim(text) == '') {
			e.preventDefault();
			return false;
		} else {
			$(".usrInput").blur();
			setUserResponse(text);
			send(text);
			e.preventDefault();
			return false;
		}
	}
});
// ----------------------------------on input/text enter------------------------------------------

//------------------------------------- Set user response------------------------------------
function setUserResponse(val) {

	var UserResponse = '<img class="userAvatar" src=' + "./static/img/userAvatar.jpg" + '><p class="userMsg">' + val + ' </p><div class="clearfix"></div>';
	$(UserResponse).appendTo('.chats').show('slow');
	$(".usrInput").val('');
	scrollToBottomOfResults();
	$('.suggestions').remove();
}
//------------------------------------- Set user response------------------------------------


//---------------------------------- Scroll to the bottom of the chats-------------------------------
function scrollToBottomOfResults() {
	var terminalResultsDiv = document.getElementById('chats');
	terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}
//---------------------------------- Scroll to the bottom of the chats-------------------------------


//---------------------------------- Main function-------------------------------
function send(message) {
	console.log("User Message:", message)
// ------------------------------------------------ Smart detection // needs a rasa extractor---------------------------------
const listfor = ['formation1','formation2','formation3'];
const   listQui = ['quizz1','quizz2','quizz3'];
var existQuizz = 0;
var existFromation = 0;
var msg = message.toLowerCase().split(" ").join("");
var msg2 = message.toLowerCase().split(" ");
var Q = '';
var F = '';
	for(var j=0; j<msg2.length;j++){
		if(msg2[j]=='quizz'){
			msg2[j]=msg2[j]+msg2[j+1];
		}
	for(var i=0; i<listQui.length; i++) { 
		if(msg2[j] == listQui[i]) {
			existQuizz = 2;
			Q = msg2[j];
		}
	}
	}
	for(var j=0; j<msg2.length;j++){
		if(msg2[j]=='formation'){
			msg2[j]=msg2[j]+msg2[j+1];
		}
	for(var i=0; i<listQui.length; i++) {
		if(msg2[j] == listfor[i]) {
			existFromation = 2;
			F = msg2[j];
		}
	}

	}
	for(var i=0; i<listfor.length; i++) {
		if(msg == listfor[i]) {
			existFromation = 1;
		}

	}
	for(var i=0; i<listQui.length; i++) {
		if(msg == listQui[i]) {
			existQuizz = 1;
		}
	}
// ------------------------------------------------ Smart detection // needs a rasa extractor ---------------------------------

// ------------------------------------------------ Smart detection Answer ---------------------------------
	if(existFromation == 1 ){
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation '+ msg + 'http://www.'+msg+'.com',300);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');
	}
	else if(existQuizz == 1){
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation '+ msg + 'http://www.'+msg+'.com',300);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');
	}
	else if(existFromation == 2 ){
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation '+ F + 'http://www.'+F+'.com',300);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');

	}
	else if(existQuizz == 2){
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation '+ Q + 'http://www.'+Q+'.com',300);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');
	}
// ------------------------------------------------ Smart detection Answer ---------------------------------
// ------------------------------------------------ send request to bot ------------------------------------
	else{
	$.ajax({
		url: 'http://localhost:5000/model/parse',
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({"text": message}),
		success: function(botResponse, status) {
			console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
			if(botResponse.intent.confidence > 0.70){
			if(botResponse.intent.name == 'greeting'){
				setBotResponse(botResponse)
			}
			else if(botResponse.intent.name == 'acces_formation'){
				$.ajax({
					url: 'http://localhost:5005/model/parse',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify({"text": message}),
					success: function(botResponse, status) {
						console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
						if(botResponse.intent.confidence > 0.75){
							setBotResponse(botResponse)
						}
						else {
							//message refomulation
							SendToUI(' Vous pouvez reformuler votre question SVP ',500);
						}
						
					},
					error: function(xhr, textStatus, errorThrown) {
						console.log("Error from bot end: ", textStatus);
					}
				});
				setBotResponse(botResponse)
			}
			else if(botResponse.intent.name == 'acces_plateforme'){
				$.ajax({
					url: 'http://localhost:5001/model/parse',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify({"text": message}),
					success: function(botResponse, status) {
						console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
						if(botResponse.intent.confidence > 0.75){
							setBotResponse(botResponse)
						}
						else {
							//message refomulation
							SendToUI(' Vous pouvez reformuler votre question SVP ',500);
						}
						
					},
					error: function(xhr, textStatus, errorThrown) {
						console.log("Error from bot end: ", textStatus);
					}
				});
				setBotResponse(botResponse)
			}
			else{
				//message reformulation
				SendToUI(' Votre demandde hors de nos services ☺️',500);
			}
		} 
		else {
			SendToUI(' Vous pouvez reformuler votre question SVP ',300);
		}

		},
		error: function(xhr, textStatus, errorThrown) {
			console.log("Error from bot end: ", textStatus);
		}
	});
}
// ------------------------------------------------ send request to bot ------------------------------------
}
//---------------------------------- Main function-------------------------------


//------------------------------------ Set bot response -------------------------------------
function setBotResponse(val) {
	setTimeout(function () {
		if (val.intent.name.length < 1) {
			//if there is no response from Rasa
			msg = 'I couldn\'t get that. Let\' try something else!';

			var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
			$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		} 
// -------------------------------------- custom bot response ------------------------------------------
else {
	if (val.intent.name == 'greeting'){
	 CutomButton_Greeting(' Bonjour, je suis votre assistant. C\'est quoi votre soucis ');
	}
	else if (val.intent.name == 'name_formation'){
		//nom de la formation inconnu   
		SendToUI("Ehh voilà vous connaissez pas le nom de la formation",500);
		CutomButton_Formation('Vous êtes assigné à quelle formation ?');
		}
	else if (val.intent.name == 'formation_introuvable'){
		//nom de la formation introuvable   
		SendToUI("Ahh... vous n\'avez pas pu trouvez votre formation !! ",500);
		CutomButton_Formation('Vous êtes assigné à quel formation ?');
		}
	else if (val.intent.name == 'quizz_introuvable'){
			// quizz introuvable
			SendToUI('Hmm ...vous n\'avez pas pu trouvez vos quizz !!',500); 
			CutomButton_Quizz('Vous êtes assigné à quel quizz ?');
			
		}
	else if (val.intent.name == 'prob_application'){
		//Traitemen 1  
		CutomButton_form('Ahh... vous n\'avez pas pu trouvez l\'application R-campus !! \n Avez-vous envoyer une demande d’inscription ?');
		}
	else if (val.intent.name == 'token'){
			//Traitemen 2  
			SendToUI('Ehh... vous n\'avez pas le Token !!   Veuillez contacter le responsable informatique ',500);
			CutomButton_YesNo('Est ce que vous voullez autre chose 🤔 ? Oui ou Non');
		}
	else if (val.intent.name == 'prob_connexion') {
			// Traitement 3
			SendToUI('Ahh... vous avez un problème de connexion !! \n Veuillez contacter le responsable informatique ',500);
			CutomButton_YesNo('Est ce que vous voullez autre chose 🤔 ?');
		} 
		
// -------------------------------------- custom bot response ------------------------------------------
 			
			//if we get response from Rasa
		/*	for (i = 0; i < val.length; i++) {
				//check if there is text message
				if (val[i].hasOwnProperty("text")) {
					//var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + val[i].text + '</p><div class="clearfix"></div>';
					var BotResponse = 'waash';
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is image
				if (val[i].hasOwnProperty("image")) {
					var BotResponse = '<div class="singleCard">' +
						'<img class="imgcard" src="' + val[i].image + '">' +
						'</div><div class="clearfix">'
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is  button message
				if (val[i].hasOwnProperty("buttons")) {
					addSuggestion(val[i].buttons);
				}

			} */
			scrollToBottomOfResults();
		}

	}, 500);

}
//------------------------------------ Set bot response -------------------------------------

// ------------------------------------------ Toggle chatbot -----------------------------------------------
$('#profile_div').click(function () {
	$('.profile_div').toggle();
	$('.widget').toggle();
	CutomButton_Greeting('Bienvenu à R-Compus, je suis Bot_Name je suis votre assistant virtuel. Alors, en quoi puis-je vous aider ?')
	scrollToBottomOfResults();
});

$('#close').click(function () {
	$('.profile_div').toggle();
	$('.widget').toggle();
});
// ------------------------------------------ Toggle chatbot -----------------------------------------------


// ------------------------------------------ Suggestions -----------------------------------------------
function addSuggestion(textToAdd) {
	setTimeout(function () {
		var suggestions = textToAdd;
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div class="menuChips" data-payload=\''+(suggestions[i].payload)+'\'>' + suggestions[i].title + "</div>").appendTo(".menu");
		}
		scrollToBottomOfResults();
	}, 1000);
}
// ------------------------------------------ Suggestions -----------------------------------------------


// ------------------------------------------ cutom function -------------------------------------------- 
function CutomButton_YesNo(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'oui 🙏🏻', 'tit' : 'oui 🙏🏻'}, { 'payl':'non 😊', 'tit' : 'non 😊'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div class="menuChips" data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
function CutomButton_Formation(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
	var textToAdd = [{ 'payl':'Formation 1 ', 'tit' : 'Formation 1'}, { 'payl':'Formation 2 ', 'tit' : 'Formation 2'},{ 'payl':'Formation 3 ', 'tit' : 'Formation 3'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div class="menuChips" data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
function CutomButton_Quizz(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'Quizz 1', 'tit' : 'Quizz 1'}, { 'payl':'Quizz 2', 'tit' : 'Quizz 2'},{ 'payl':'Quizz 3', 'tit' : 'Quizz 3'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div class="menuChips" data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
function SendToUI(mssg,delay) {
	setTimeout(function () {
		msg = mssg;
		var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg" content="text/html; charset=utf-8">' + msg + '</p><div  class="clearfix"></div>';
		$(BotResponse).appendTo('.chats').hide().fadeIn(delay);
		scrollToBottomOfResults();
	}, delay);
}
function CutomButton_Greeting(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg " >' + msg + '</p><div  class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'Problème d’accès à la formation', 'tit' : 'Problème d’accès à la formation'},{ 'payl':'Problème liée à la formation.', 'tit' : 'Problème liée à la formation.'}, { 'payl':'Problème d’accès à la plateforme.', 'tit' : 'Problème d’accès à la plateforme.'},{ 'payl':'Problème d’affectation.', 'tit' : 'Problème d’affectation.'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div  class="menuChips"  data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 500);
}
function CutomButton_accesFormation(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg " >' + msg + '</p><div  class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'Formation introuvable.', 'tit' : 'Formation introuvable.'},{ 'payl':'Nom de la formation introuvable.', 'tit' : 'Nom de la formation introuvable.'}, { 'payl':'Quizz introuvable', 'tit' : 'Quizz introuvable'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div  class="menuChips"  data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
function CutomButton_accesPlatforme(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg " >' + msg + '</p><div  class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'Application R-campus introuvable.', 'tit' : 'Application R-campus introuvable.'},{ 'payl':'Problème de connexion.', 'tit' : 'Problème de connexion.'}, { 'payl':'Vous n’avez pas de Token.', 'tit' : 'Vous n’avez pas de Token.'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div  class="menuChips"  data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
function CutomButton_form(mssg) {
	setTimeout(function () {
		msg = mssg;
	var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
	$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
		var textToAdd = [{ 'payl':'Oui', 'tit' : 'Oui'}, { 'payl':'Non', 'tit' : 'Non'}]
		var suggLength = textToAdd.length;
		$(' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>').appendTo('.chats').hide().fadeIn(1000);
		// Loop through suggestions
		for (i = 0; i < suggLength; i++) {
			$('<div class="menuChips" data-payload=\''+(textToAdd[i].payl)+'\'>' + textToAdd[i].tit + "</div>").appendTo('.menu');
		}
		scrollToBottomOfResults();
	}, 1000);
}
// ------------------------------------------ cutom function -------------------------------------------- 

// on click of suggestions, get the value and send to rasa
$(document).on("click", ".menu .menuChips", function () {
	var text = this.innerText;
	var payload= this.getAttribute('data-payload');
	setUserResponse(text);
	//send(payload);
	if( text == 'oui 🙏🏻' ){
		// function yes answer help
		CutomButton_Greeting('Bien sur 😁 \n comment puis-je vous aider 🤔 ? ');
	}
	else if (text == 'non 😊'){
		//function no answer help
		SendToUI('Je suis toujours là si vous avez besionde l\'aide ',500);
	}
	else if( text == 'Oui' ){
		// function yes answer form
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre application r campus : http://www.rcampus_guide.fr',500);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');
	}
	else if (text == 'Non'){
		//function no answer form
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre application r campus : http://www.rcampusForm.com/inscription',500);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?')
	}
	else if (text == 'Problème d’accès à la formation'){
		//function no answer form
		CutomButton_accesFormation('Sélectionnez le type de votre problème SVP !');
	}
	else if (text == 'Problème d’accès à la plateforme.'){
		//function no answer form
		CutomButton_accesPlatforme('Sélectionnez le type de votre problème SVP !');
	}
	else if (text == 'Application R-campus introuvable.'){
		//function no answer form
		send('application r-campus introuvable');
	}
	else if (text == 'Problème de connexion.'){
		//function no answer form
		SendToUI('Ahh... vous avez un problème de connexion !! \n Veuillez contacter le responsable informatique ',500);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?')
	}
	else if (text == 'Vous n’avez pas de Token.'){
		//function no answer form
		SendToUI('Ehh... vous n\'avez pas le Token !!   Veuillez contacter le responsable informatique ',500);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?')
	}
	else if (text == 'Formation introuvable.' || text == 'Nom de la formation introuvable.'){
		//function no answer form
		send('Formation introuvable ');
		
	}
	else if (text == 'Quizz introuvable'){
		//function no answer form
		send('Quizz introuvable');
	}
	else if(['Formation 1','Formation 2','Formation 3'].indexOf(text)>= 0){
		// function formation unswer
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation : http://www.'+text+'.com',1000);
		//SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Formation :  <a href=' + ' http://www.' + text + '.com' +  text + '</a>');
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');
	}
	else if(['Quizz 1','Quizz 2','Quizz 3'].indexOf(text)>= 0){
		// function quizz answer
		SendToUI('Voici un lien qui va vous guider pour pouvoir acceder a votre Quizz : http://www.'+text+'.com',1000);
		CutomButton_YesNo('Vous avez besion d\'autre chose 🤔 ?');

	}
	else{
		SendToUI('nous sommes désolés que cette partie ne soit pas encore prête',300);
		CutomButton_Greeting('Comment puis-je vous aider ?');
	}
	$('.suggestions').remove(); //delete the suggestions 
});
// on click of suggestions, get the value and send to rasa
