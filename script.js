const form = document.querySelector('form');
const entriesDiv = document.querySelector('#entries');
let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

function saveEntryToLocalStorage(title, date, content) {
  entries.push({ title, date, content });
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

function loadEntriesFromLocalStorage() {
	entries.forEach((entry) => {
	  const entryDiv = document.createElement('div');
	  entryDiv.classList.add('entry');
	  entryDiv.dataset.id = entry.id;
  
	  entryDiv.innerHTML = `
	  <html>
	  <div class="entry-header">
		<h2>${entry.title}</h2>
		<button class="delete-button">&times;</button>
	  </div>
	  <p>${entry.date}</p>
	  <div style="white-space: pre-wrap;">${entry.content}</div>

	</html>`;
	

	  const deleteButton = entryDiv.querySelector('.delete-button');
	  deleteButton.addEventListener('click', () => {
		const confirmed = confirm('Are you sure you want to delete this entry?');
		if (confirmed) {
		  entries = entries.filter((e) => e.title !== entry.title);
		  localStorage.setItem('diaryEntries', JSON.stringify(entries));
		  entryDiv.remove();
		}
	  });	  
	  entriesDiv.prepend(entryDiv);
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
  form.reset();
  location.reload();

});

entriesDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
	const index = e.target.dataset.index;
	e.target.parentElement.remove();
	deleteEntryFromLocalStorage(index);
  }
});

loadEntriesFromLocalStorage();

// Get today's date in yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
// Set the date input's value to today's date
document.getElementById('date').value = today;

const dateLabel = document.getElementById('date-label');
dateLabel.addEventListener('click', () => {
  const dateField = document.getElementById('date');
  dateField.click();
});

const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    header.classList.add('scroll');
  } else {
    header.classList.remove('scroll');
  }
});
function clearEntries() {
	if (confirm("Are you sure you want to clear all entries?")) {
	  localStorage.clear(); // Clear all data from local storage
	  document.getElementById("entries").innerHTML = ""; // Clear the entries display
	  location.reload();
	}
  }
  