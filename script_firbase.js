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

	// Get a reference to the Firebase Realtime Database instance


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

// function saveEntryToFirebase(title, date, content) {
//   console.log(title + " - " + content);
//   var newEntryRef = firebase.database().ref('entries').push();
//   newEntryRef.set({
//     title: title,
//     date: date,
//     content: content
//   }, function(error) {
//     if (error) {
//       console.error('Error adding document: ', error);
//     } else {
//       console.log('Document written with ID: ', newEntryRef.key);
//     }
// 	// hide the loading screen
// document.getElementById("loading-screen").style.display = "none";
//   });
// }
function saveEntryToFirebase(title, date, content) {
	var path = window.location.pathname.split('/').filter(Boolean).pop();
	if (!path) {
	  console.error('No path provided in URL');
	  return;
	}
	
	var newEntryRef = firebase.database().ref('entries/' + path).push();
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
	});
  }
  
function loadEntriesFromFirebase() {
	const entriesDiv = document.getElementById('entries');
	const entriesRef = firebase.database().ref('entries');
  
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
			<button class="delete-button">&times;</button>
		  </div>
		  <p>${entry.date}</p>
		  <div style="white-space: pre-wrap;">${entry.content}</div>
		`;
  
		const deleteButton = entryDiv.querySelector('.delete-button');
		deleteButton.addEventListener('click', () => {
		  const confirmed = confirm('Are you sure you want to delete this entry?');
		  if (confirmed) {
			const entryId = entryDiv.dataset.id;
			firebase.database().ref('entries/' + entryId).remove();
		  }
		});
  
		entriesDiv.prepend(entryDiv);
	  });
	  document.getElementById("loading-screen").style.display = "none";

	});
  }
  

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
	form.reset();
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

  