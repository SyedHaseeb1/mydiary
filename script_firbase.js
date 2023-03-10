const firebaseConfig = {
    apiKey: "AIzaSyD1qhNgWh7_3ErIZVYWl3PDBkaqObjK52g",
    authDomain: "firestorage-1ce34.firebaseapp.com",
    databaseURL: "https://firestorage-1ce34-default-rtdb.firebaseio.com",
    projectId: "firestorage-1ce34",
    storageBucket: "firestorage-1ce34.appspot.com",
    messagingSenderId: "106131878752",
    appId: "1:106131878752:web:6b5baf591b8931a821a405",
    measurementId: "G-9J5N3CLSM8"
  };
    // Initialize Firebase  
	firebase.initializeApp(firebaseConfig);

	  // handle changes in the URL after the "#" symbol
	  window.onhashchange = function() {
		// get the hash from the URL
		const hash = window.location.hash.substring(1);
	
		// do something with the hash value, e.g. save it to a database or perform a search
		console.log('Hash changed:', hash);
		window.location.href = `https://syedhaseeb1.github.io/mydiary/#${hash}`;

	  };

	const form = document.querySelector('form');
const entriesDiv = document.querySelector('#entries');
// display the loading screen
document.getElementById("loading-screen").style.display = "flex";

loadEntriesFromFirebase();

let entries = [];
function saveEntryToLocalStorage(title, date, content) {
  entries.push({ title, date, content });
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

function saveEntryToFirebase(title, date, content) {
	// get the parent node from the URL hash
	const parentNode = window.location.hash.substring(1);
  
	// create a new child with a unique key under the parent node
	var newEntryRef = firebase.database().ref('entries/' + parentNode).push();
	newEntryRef.set({
	  title: title,
	  date: date,
	  content: content
	}, function(error) {
	  if (error) {
		console.error('Error adding document: ', error);
	  } else {
		console.log('Document written with ID: ', newEntryRef.key);
	  }
  
	  // hide the loading screen
	  document.getElementById("loading-screen").style.display = "none";
	});
  }


  function showAlert(){
	// create the dialogue element
	const dialogue = document.createElement('div');
	dialogue.style.position = 'fixed';
	dialogue.style.top = '0';
	dialogue.style.left = '0';
	dialogue.style.width = '100%';
	dialogue.style.height = '100%';
	dialogue.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	dialogue.style.display = 'flex';
	dialogue.style.alignItems = 'center';
	dialogue.style.justifyContent = 'center';
  
	// create the instruction element
	const instruction = document.createElement('p');
	instruction.innerText = 'Use something like https://syedhaseeb1.github.io/mydiary/#anything to proceed and start saving your notes';
	instruction.style.color = '#fff';
	instruction.style.fontSize = '24px';
	instruction.style.textAlign = 'center';
	instruction.style.marginTop = '20px';
	instruction.style.marginInline = '40px';
	instruction.style.lineHeight = '1.5';
		dialogue.appendChild(instruction);
  

  
	// add the button to the dialogue
	//dialogue.appendChild(button);
  
	// add the dialogue to the page
	document.body.appendChild(dialogue);
  
	// add media query for smaller screens
	const mq = window.matchMedia('(max-width: 600px)');
	mq.addEventListener('change', () => {
	  if (mq.matches) {
		dialogue.style.fontSize = '16px';
		instruction.style.fontSize = '18px';
		button.style.fontSize = '16px';
		button.style.padding = '8px 16px';
	  } else {
		dialogue.style.fontSize = '24px';
		instruction.style.fontSize = '24px';
		button.style.fontSize = 'inherit';
		button.style.padding = '10px 20px';
	  }
	});
  }
  
  


  function loadEntriesFromFirebase() {
	const entriesDiv = document.getElementById('entries');
	const path = window.location.hash.substring(1); // extract hash fragment from URL
	
	if (!path) {
		document.getElementById("loading-screen").style.display = "none";
		showAlert();
	  entriesDiv.innerHTML = 'You must provide a key path in the URL';
	  return;
	}
	
	const entriesRef = firebase.database().ref('entries/' + path);
	
	entriesRef.on('value', (snapshot) => {
	  entriesDiv.innerHTML = '';
	
	  snapshot.forEach((childSnapshot) => {
		const entry = childSnapshot.val();
		const entryDiv = document.createElement('div');
		entryDiv.classList.add('entry');
		entryDiv.dataset.id = childSnapshot.key;
	
		entryDiv.innerHTML = `
		  <div class="entry-header">
			<h2>${entry.title}</h2>
			<button class="copy-button">Copy</button>
			<button class="delete-button">&times;</button>
		  </div>
		  <p>${entry.date}</p>
		  <div class="entry-content">${entry.content}</div>
		`;
	
		const deleteButton = entryDiv.querySelector('.delete-button');
		deleteButton.addEventListener('click', () => {
		  const confirmed = confirm('Are you sure you want to delete this entry?');
		  if (confirmed) {
			const entryId = entryDiv.dataset.id;
			firebase.database().ref('entries/' + path + '/' + entryId).remove();
		  }
		});
	
		const copyButton = entryDiv.querySelector('.copy-button');
		const entryContent = entryDiv.querySelector('.entry-content');
		copyButton.addEventListener('click', () => {
		  const range = document.createRange();
		  range.selectNode(entryContent);
		  window.getSelection().removeAllRanges();
		  window.getSelection().addRange(range);
		  document.execCommand('copy');
		  window.getSelection().removeAllRanges();
		});
	
		entriesDiv.prepend(entryDiv);
	  });
	
	  document.getElementById("loading-screen").style.display = "none";
	});
  }
  
  
  
  
// function loadEntriesFromFirebase() {
// 	const entriesDiv = document.getElementById('entries');
// 	const entriesRef = firebase.database().ref('entries');
  
// 	entriesRef.on('value', (snapshot) => {
// 	  entriesDiv.innerHTML = '';
  
// 	  snapshot.forEach((childSnapshot) => {
// 		const entry = childSnapshot.val();
// 		const entryDiv = document.createElement('div');
// 		entryDiv.classList.add('entry');
// 		entryDiv.dataset.id = childSnapshot.key;
  
// 		entryDiv.innerHTML = `
// 		  <div class="entry-header">
// 			<h2>${entry.title}</h2>
// 			<button class="delete-button">&times;</button>
// 		  </div>
// 		  <p>${entry.date}</p>
// 		  <div style="white-space: pre-wrap;">${entry.content}</div>
// 		`;
  
// 		const deleteButton = entryDiv.querySelector('.delete-button');
// 		deleteButton.addEventListener('click', () => {
// 		  const confirmed = confirm('Are you sure you want to delete this entry?');
// 		  if (confirmed) {
// 			const entryId = entryDiv.dataset.id;
// 			firebase.database().ref('entries/' + entryId).remove();
// 		  }
// 		});
  
// 		entriesDiv.prepend(entryDiv);
// 	  });
// 	  document.getElementById("loading-screen").style.display = "none";

// 	});
//   }
  

  form.addEventListener('submit', (e) => {
	e.preventDefault();
  
	const title = form.title.value;
	const date = form.date.value;
	const content = form.content.value;
  
	const entryDiv = document.createElement('div');
	entryDiv.classList.add('entry');
	entryDiv.innerHTML = `
	  <h2>${title}</h2>
	  <p>${date}</p>
	  <div style="white-space: pre-wrap;">${content}</div>
	  <button class="delete-button" data-index="${entries.length}">X</button>
	`;
	entriesDiv.prepend(entryDiv);
  
	saveEntryToLocalStorage(title, date, content);
	document.getElementById("loading-screen").style.display = "flex";
	saveEntryToFirebase(title,date,content);
	resetForm();

 // location.reload();
  });

  function clearEntries() {
	if (confirm("Are you sure you want to clear all entries?")) {
	  localStorage.clear(); // Clear all data from local storage
	  document.getElementById("entries").innerHTML = ""; // Clear the entries display
	  location.reload();
	}
  }

  // Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
// Set the date input's value to today's date
document.getElementById('date').value = today;

function resetForm() {
	const today = new Date().toISOString().split('T')[0];
	document.getElementById('date').value = today;
	form.reset();
  }
  

  