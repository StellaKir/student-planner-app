function ExamsTab({
  exams,
  deleteExam,
  toggleExamComplete,
  savedCourses,
  addExam,
  showExamForm,
  setShowExamForm,
}) {
  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Exams</h2>
          <p>Track your upcoming exams.</p>
        </div>

        <button onClick={() => setShowExamForm(true)}>+ Add Exam</button>
      </div>

      <div className="exam-list">
        {exams.length === 0 ? (
          <p className="empty-day">No exams added yet.</p>
        ) : (
          [...exams]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((exam) => (
              <div
                key={exam.id}
                className={`exam-card ${
                  exam.completed ? "completed-assignment" : ""
                }`}
              >
                <div>
                  <strong>{exam.title}</strong>

                  <p>{exam.course}</p>

                  <small>{exam.date}</small>
                </div>

                <div className="exam-right">
                  <button
                    className="assignment-complete-btn"
                    onClick={() => toggleExamComplete(exam.id)}
                  >
                    {exam.completed ? "Completed" : "Mark Done"}
                  </button>

                  <button
                    className="assignment-delete-btn"
                    onClick={() => deleteExam(exam.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {showExamForm && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h2>Add Exam</h2>

            <div className="form">
              <input id="exam-title" placeholder="Exam title" />

              <select id="exam-course">
                <option value="">Select Course</option>

                {savedCourses.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>

              <input type="date" id="exam-date" />

              <button onClick={addExam}>Save Exam</button>

              <button
                className="cancel-edit-btn"
                onClick={() => setShowExamForm(false)}
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

export default ExamsTab;
