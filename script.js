const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const noResult = document.getElementById('no-result');

addNoteBtn.addEventListener('click', addNote);

function addNote() {
    const note = document.createElement('div');
    note.className = 'note';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/trash.jpg';
    deleteIcon.alt = 'Delete';
    deleteIcon.style.width = '16px';
    deleteIcon.style.height = '16px';
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.addEventListener('click', () => note.remove());

    const pinBtn = document.createElement('button');
    pinBtn.className = 'pin-btn';
    const pinIcon = document.createElement('img');
    pinIcon.src = 'assets/pin-tack.jpg';
    pinIcon.alt = 'Pin';
    pinIcon.style.width = '16px';
    pinIcon.style.height = '16px';
    pinBtn.appendChild(pinIcon);
    pinBtn.addEventListener('click', () => {
        if (pinBtn.classList.contains('pinned')) {
            unpinNote(note, pinIcon);
        } else {
            pinNote(note, pinIcon);
        }
    });

    const colors = [
        { src: 'assets/white-col.jpg', alt: 'White', color: 'ffffff' },
        { src: 'assets/yellow-col.jpg', alt: 'Yellow', color: 'e9c66a' },
        { src: 'assets/blue-col.jpg', alt: 'Blue', color: '99d0ef' }
    ];
    const defaultColBtn = document.createElement('button');
    defaultColBtn.className = 'default-col-btn';
    const defaultColIcon = document.createElement('img');
    defaultColIcon.src = colors[0].src; // Set the src attribute
    defaultColIcon.alt = colors[0].alt; // Set the alt attribute    
    defaultColIcon.style.width = '16px';
    defaultColIcon.style.height = '16px';
    defaultColBtn.appendChild(defaultColIcon);

    // Change note colour
    const tooltipColors = document.createElement('div');
    tooltipColors.className = 'tooltip-colors';
    tooltipColors.style.display = 'none';

    colors.forEach(color => {
        const colorIcon = document.createElement('img');
        colorIcon.src = color.src;
        colorIcon.alt = color.alt;
        colorIcon.setAttribute('data-color', color.color);
        colorIcon.style.width = '16px';
        colorIcon.style.height = '16px';
        tooltipColors.appendChild(colorIcon);
    });

    defaultColBtn.appendChild(tooltipColors);

    defaultColBtn.addEventListener('mouseover', () => {
        tooltipColors.style.display = 'block';
    });

    defaultColBtn.addEventListener('mouseout', () => {
        tooltipColors.style.display = 'none';
    });

    buttonContainer.appendChild(defaultColBtn);
    buttonContainer.appendChild(pinBtn);
    buttonContainer.appendChild(deleteBtn);

    const noteTitle = document.createElement('div');
    noteTitle.className = 'note-title';
    noteTitle.contentEditable = true;
    addPlaceholderBehavior(noteTitle, 'Title');
    noteTitle.textContent = 'Title';
    
    const noteList = document.createElement('ul');
    const listItem = document.createElement('li');
    const listItemInput = document.createElement('div');
    listItemInput.className = 'list-item-input';
    listItemInput.contentEditable = true;
    addPlaceholderBehavior(listItemInput, 'List item');

    listItemInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of Enter key
            const newListItem = createListItem();
            noteList.appendChild(newListItem);
            newListItem.querySelector('.list-item-input').focus();
        }
    });

    listItemInput.textContent = 'List item';
    listItem.appendChild(listItemInput);
    noteList.appendChild(listItem);
    

    note.appendChild(buttonContainer);
    note.appendChild(noteTitle);
    note.appendChild(noteList);
    notesContainer.appendChild(note);
    initializeColorPicker(note);
}

function addPlaceholderBehavior(element, placeholder) {
    element.addEventListener('focus', function() {
        if (element.textContent === placeholder) {
            element.textContent = '';
        }
    });
    element.addEventListener('blur', function() {
        if (element.textContent === '') {
            element.textContent = placeholder;
        }
    });    
}

function pinNote(note, pinIcon) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.removeChild(note);
    notesContainer.insertBefore(note, notesContainer.firstChild);
    pinIcon.src = 'assets/pin-tack-filled.jpg';
    note.querySelector('.pin-btn').classList.add('pinned');
}

function unpinNote(note, pinIcon) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.removeChild(note);
    notesContainer.appendChild(note);
    pinIcon.src = 'assets/pin-tack.jpg';
    note.querySelector('.pin-btn').classList.remove('pinned');
}

function initializeColorPicker(noteElement) {
    noteElement.querySelectorAll('.tooltip-colors img').forEach(option => {
        option.addEventListener('click', (event) => {
            const selectedColor = event.target.getAttribute('data-color');
            event.target.closest('.note').style.backgroundColor = `#${selectedColor}`;
            const imgElement = noteElement.querySelector('.default-col-btn img');
            if (imgElement) {
                imgElement.src = event.target.src; // Change the default icon to the selected color
            }
        });
    });
}

function createListItem() {
    const listItem = document.createElement('li');
    const listItemInput = document.createElement('div');
    listItemInput.className = 'list-item-input';
    listItemInput.contentEditable = true;
    addPlaceholderBehavior(listItemInput, 'List item');

    listItemInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of Enter key
            const newListItem = createListItem();
            listItem.parentNode.appendChild(newListItem);
            newListItem.querySelector('.list-item-input').focus();
        }
    });

    listItemInput.textContent = 'List item';
    listItem.appendChild(listItemInput);
    return listItem;
}

function filterNotes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const notes = notesContainer.querySelectorAll('.note');
    let hasResults = false;

    notes.forEach(note => {
        const noteText = note.innerText.toLowerCase();
        if (noteText.includes(searchTerm)) {
            note.style.display = 'block';
            hasResults = true;
        } else {
            note.style.display = 'none';
        }
    });

    noResult.style.display = hasResults ? 'none' : 'block';
}

function clearSearch() {
    document.getElementById('search').value = '';
    filterNotes();
}