	
			
			var interval;
		
			// Initialize Firebase
			var config = {
				apiKey: "AIzaSyCiC2SIqEfngJopZ8KLjAhui7uJ8MwGbeg",
				authDomain: "youtubeconamigos-153119.firebaseapp.com",
				databaseURL: "https://youtubeconamigos-153119.firebaseio.com",
				storageBucket: "youtubeconamigos-153119.appspot.com",
				messagingSenderId: "4360677184"
			};
			firebase.initializeApp(config);
			
			// Get a reference to the database service
			var database = firebase.database();
			
			var playerRef = database.ref('player');
			
			var listaRef = database.ref('lista');
			listaRef.on('child_added', function(snapshot) {
				var tema = new Object();
				tema.id = snapshot.key;
				tema.idYoutube = snapshot.val().id;
				tema.nombre = snapshot.val().nombre;
				agregaralista(tema);
			});
			
			listaRef.on('child_removed', function(snapshot) {
				lista.shift();
				// Create the list element:
				var ul = document.createElement('ul');
				
				for(var i = 0; i < lista.length; i++) {
					// Create the list item:
					var item = document.createElement('li');
				
					// Set its contents:
					item.appendChild(document.createTextNode(lista[i].nombre));
				
					// Add it to the list:
					ul.appendChild(item);
				}
				document.getElementById('lista').innerHTML = '';
				document.getElementById('lista').appendChild(ul);
			});
			
			var video = {};
			playerRef.on('value', function(snapshot){
				video.estado = snapshot.val().estado;
				video.id = snapshot.val().video;
				video.tiempo = snapshot.val().tiempo;
				if(video.estado == 'play'){
					player.loadVideoById(video.id, video.tiempo);
				}
				else if(video.estado == 'stop'){
					player.stopVideo();
				}
				else if(video.estado == 'pausa'){
					player.pauseVideo();
				}
			});
			
			// 2. This code loads the IFrame Player API code asynchronously.
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			// 3. This function creates an <iframe> (and YouTube player)
			//    after the API code downloads.
			var player;
			function onYouTubeIframeAPIReady() {
				player = new YT.Player('player', {
					height: '360',
					width: '640',
					videoId: video.id,
					playerVars: { 'controls': 0, 'disablekb': 1,  },
					events: {
						'onReady': onPlayerReady,
						'onStateChange': onPlayerStateChange,
						'onError': siguiente
					}
				});
			}

			// 4. The API will call this function when the video player is ready.
			function onPlayerReady(event) {
				//event.target.playVideo();
			}

			// 5. The API calls this function when the player's state changes.
			function onPlayerStateChange(event) {
				if(player.getPlayerState() == 0 && lista.length > 0){
					siguiente();
				};
			}
			  
			var lista = [];
			function agregaralalista(){
				var id = document.getElementById("id").value;
				lista.push(id);
				// Create the list element:
				var ul = document.createElement('ul');
			
				for(var i = 0; i < lista.length; i++) {
					// Create the list item:
					var item = document.createElement('li');
			
					// Set its contents:
					item.appendChild(document.createTextNode(lista[i]));
			
					// Add it to the list:
					ul.appendChild(item);
				}
				document.getElementById('lista').innerHTML = '';
				document.getElementById('lista').appendChild(ul);
				id.innerHTML = '';
				if(player.getPlayerState() == 0){
					siguiente();
				}
			}
			  
			function siguiente(){
				//player.nextVideo();
				if(lista.length > 0){
					//player.loadVideoById(lista[0].idYoutube,0,"large");
					playerRef.set({estado : 'play', video : lista[0].idYoutube, tiempo : 0});
					listaRef.child(lista[0].id).remove();
				}
			}
			  
			function play(){
				playerRef.set({estado : 'play', video : video.id, tiempo : player.getCurrentTime()});
			}
			  
			function pausa(){
				playerRef.set({estado : 'pausa', video : video.id, tiempo : player.getCurrentTime()});
			}
			  
			function stop(){
				playerRef.set({estado : 'stop', video : video.id, tiempo : 0});
			}
			  
			function buscar() {
				var q = document.getElementById("textoBuscar").value;
				var request = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+q+"&type=video&maxResults=50&key=AIzaSyDnwBzhbCjNQUC5qf53gTEP8qlg3UCJF3M"
				
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var json = JSON.parse(this.response);
						document.getElementById("resultados").innerHTML = '';
						for(var i = 0; i < json.items.length; i++){
							var a = document.createElement("A");
							a.innerHTML = json.items[i].snippet.title + '</br>';
							a.href = '#';
							a.id = json.items[i].id.videoId;
							a.addEventListener("click", function(){agregarbuscado(this.id, this.text); document.getElementById("resultados").innerHTML = '';});
							document.getElementById("resultados").appendChild(a);
						}
					}
				};
				xhttp.open("GET", request, true);
				xhttp.send();
			}
			
			function agregarbuscado(id, nombre){
				var tema = new Object();
				tema.id = id;
				tema.nombre = nombre;
				listaRef.push(tema);
			}
			  
			function agregaralista(tema){
				lista.push(tema);
				// Create the list element:
				var ul = document.createElement('ul');
			
				for(var i = 0; i < lista.length; i++) {
					// Create the list item:
					var item = document.createElement('li');
			
					// Set its contents:
					item.appendChild(document.createTextNode(lista[i].nombre));
			
					// Add it to the list:
					ul.appendChild(item);
				}
				document.getElementById('lista').innerHTML = '';
				document.getElementById('lista').appendChild(ul);
				if(video.estado == 'stop' && lista.length == 1){
					siguiente();
				}
			}
		