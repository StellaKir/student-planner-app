import { useState } from "react";

function NotesTab({
  notes,
  addNote,
  editNote,
  deleteNote,
  deleteNoteFile,
  editingNoteId,
  setEditingNoteId,
  savedCourses,
  showNoteForm,
  setShowNoteForm,
}) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const sortedNotes = [...notes].sort((a, b) =>
    a.course.localeCompare(b.course),
  );

  const editingNote = notes.find((note) => note.id === editingNoteId);

  function closeNoteForm() {
    setEditingNoteId(null);
    setShowNoteForm(false);
  }

  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Notes</h2>
          <p>Keep your study notes organized by course.</p>
        </div>

        <button onClick={() => setShowNoteForm(true)}>+ Add Note</button>
      </div>

      {sortedNotes.length === 0 ? (
        <p className="empty-day">No notes added yet.</p>
      ) : (
        <div className="notes-grid">
          {sortedNotes.map((note) => (
            <div
              className="note-box"
              key={note.id}
              onClick={() => setSelectedNote(note)}
            >
              <div className="note-icon">📝</div>

              <h3>{note.course}</h3>

              <p>{note.text}</p>

              {note.files?.length > 0 && (
                <small>{note.files.length} attached file(s)</small>
              )}

              <small>{note.createdAt}</small>
            </div>
          ))}
        </div>
      )}

      {selectedNote && (
        <div className="modal-overlay">
          <div className="modal note-details-modal">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedNote(null)}
            >
              ×
            </button>

            <div className="note-icon">📝</div>

            <h2>{selectedNote.course}</h2>

            <p>{selectedNote.text}</p>

            {selectedNote.files?.length > 0 && (
              <div className="attached-files-list">
                {selectedNote.files.map((file) => (
                  <a
                    className="attached-file"
                    href={file.data}
                    download={file.name}
                    key={file.id}
                  >
                    📎 {file.name}
                  </a>
                ))}
              </div>
            )}

            <div className="modal-buttons">
              <button
                onClick={() => {
                  editNote(selectedNote);
                  setSelectedNote(null);
                }}
              >
                Edit
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  setNoteToDelete(selectedNote);
                  setSelectedNote(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {noteToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Note</h2>
            <p>Are you sure you want to delete this note?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setNoteToDelete(null)}
              >
                No
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  deleteNote(noteToDelete.id);
                  setNoteToDelete(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showNoteForm && (
        <div className="modal-overlay">
          <div className="form-modal note-modal">
            <h2>{editingNoteId ? "Edit Note" : "Add Note"}</h2>

            <div className="form">
              <select id="note-course">
                <option value="">Select Course</option>

                {savedCourses.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>

              <textarea
                id="note-text"
                placeholder="Write your notes..."
                rows="4"
              ></textarea>

              {editingNote?.files?.length > 0 && (
                <div className="existing-files">
                  <strong>Current files</strong>

                  {editingNote.files.map((file) => (
                    <div className="existing-file-row" key={file.id}>
                      <a href={file.data} download={file.name}>
                        📎 {file.name}
                      </a>

                      <button
                        type="button"
                        onClick={() => deleteNoteFile(editingNote.id, file.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="file-upload-btn">
                Upload file
                <input type="file" id="note-file" multiple />
              </label>

              <button onClick={addNote}>
                {editingNoteId ? "Update Note" : "Save Note"}
              </button>

              <button className="cancel-edit-btn" onClick={closeNoteForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NotesTab;
