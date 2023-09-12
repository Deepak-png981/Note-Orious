//Fetch and display notes on page load
window.onload = async () => {
    try {
        const response = await fetch('/notes');
        const notes = await response.json();
        notes.forEach(addNoteToList);
    } catch (err) {
        console.error('Error in fetching notes : ', err);
    }
};

document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    try {
        const response = await fetch('/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        const data = await response.json();
        if (response.status === 201) {
            addNoteToList(data);
        } else {
            console.log('Error adding note : ', data.message);
        }
    }
    catch (err) {
        console.error('Error : ', err);
    }
    //after successfully adding the note , clear the input fields
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
})

function showNoteModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class = "modal-content">
            <button class = "modal-close">&times;</button>
            <h2>${title}</h2>
            <p>${content}</p>
        </div>
    `;
    modal.querySelector('.modal-close').onclick = () => modal.remove();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}


function addNoteToList(note) {
    const li = document.createElement('li');
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = `${note.title} : ${note.content}`;
    noteContent.onclick = () => showNoteModal(note.title, note.content);
    li.appendChild(noteContent);


    //edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.onclick = () => editNote(note._id);
    li.appendChild(editButton);

    //delete kerne ke liye
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteNote(note._id);
    li.appendChild(deleteButton);

    document.getElementById('notesList').appendChild(li);
}

async function editNote(noteId) {
    const newTitle = prompt('Enter new title');
    const newContent = prompt('Enter new content');
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        })
        if (response.status !== 200) {
            const data = await response.json();
            console.error('Error updating note : ', data.message);
        } else {
            //reload
            location.reload();
        }
    } catch (err) {
        console.error('Error ', err);
    }
}

async function deleteNote(noteId) {
    try {
        const response = await fetch(`/notes/${noteId}`, {
            method: 'DELETE'
        });
        if (response.status !== 200) {
            const data = await response.json();
            console.error('Error deleting the note : ', data.message);
        } else {
            //reload the page to reflect the changes again
            location.reload();
        }
    } catch (err) {
        console.error('Error : ', err);
    }
}