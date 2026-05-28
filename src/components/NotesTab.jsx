function NotesTab({ notes, addNote, courseList }) {
  return (
    <section className="tab-section">
      <h2>Notes</h2>

      <div className="note-form">
        <select id="note-course">
          <option value="">Select Course</option>

          {courseList.map((course) => (
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

        <input type="file" id="note-file" />

        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-day">No notes added yet.</p>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div>
                <strong>{note.course}</strong>

                <span>{note.createdAt}</span>
              </div>

              <p>{note.text}</p>

              {note.fileName && <small>Attached file: {note.fileName}</small>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default NotesTab;
