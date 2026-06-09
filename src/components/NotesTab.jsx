function NotesTab({
  notes,
  addNote,
  savedCourses,
  showNoteForm,
  setShowNoteForm,
}) {
  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Notes</h2>
          <p>Keep your study notes organized by course.</p>
        </div>

        <button onClick={() => setShowNoteForm(true)}>+ Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-day">No notes added yet.</p>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-card-header">
                <div>
                  <strong>{note.course}</strong>
                  <span>{note.createdAt}</span>
                </div>
              </div>

              <p>{note.text}</p>

              {note.fileName && (
                <small className="attached-file">📎 {note.fileName}</small>
              )}
            </div>
          ))
        )}
      </div>

      {showNoteForm && (
        <div className="modal-overlay">
          <div className="form-modal note-modal">
            <h2>Add Note</h2>

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

              <label className="file-upload-btn">
                Upload file
                <input type="file" id="note-file" />
              </label>

              <button onClick={addNote}>Save Note</button>

              <button
                className="cancel-edit-btn"
                onClick={() => setShowNoteForm(false)}
              >
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
