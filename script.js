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
		entryDiv.innerHTML = `
			<h2>${entry.title}</h2>
			<p>${entry.date}</p>
			<div class="content">${entry.content}</div>
		`;
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
		<div class="content">${content}</div>
	`;
	entriesDiv.prepend(entryDiv);

	saveEntryToLocalStorage(title, date, content);

	form.reset();
});

loadEntriesFromLocalStorage();
