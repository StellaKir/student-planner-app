import { useState } from "react";

function ExamsTab({
  exams,
  deleteExam,
  savedCourses,
  addExam,
  showExamForm,
  setShowExamForm,
  updateExamResult,
}) {
  const [examToDelete, setExamToDelete] = useState(null);
  const [examToFinish, setExamToFinish] = useState(null);

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
                  exam.result === "passed"
                    ? "exam-passed"
                    : exam.result === "failed"
                      ? "exam-failed"
                      : ""
                }`}
              >
                <button
                  className="exam-delete-x"
                  onClick={() => setExamToDelete(exam)}
                >
                  ×
                </button>

                <div>
                  <strong>{exam.title}</strong>
                  <p>{exam.course}</p>
                  <small>{exam.date}</small>

                  {exam.result && (
                    <span className={`exam-result-badge ${exam.result}`}>
                      {exam.result === "passed" ? "Passed" : "Failed"}
                    </span>
                  )}
                </div>

                <div className="exam-right">
                  <button
                    className="assignment-complete-btn"
                    onClick={() => setExamToFinish(exam)}
                  >
                    Done
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {examToFinish && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Exam Result</h2>
            <p>How did it go?</p>

            <div className="modal-buttons">
              <button
                className="done-btn"
                onClick={() => {
                  updateExamResult(examToFinish.id, "passed");
                  setExamToFinish(null);
                }}
              >
                Passed
              </button>

              <button
                className="missed-btn"
                onClick={() => {
                  updateExamResult(examToFinish.id, "failed");
                  setExamToFinish(null);
                }}
              >
                Failed
              </button>
            </div>

            <button
              className="cancel-edit-btn"
              onClick={() => setExamToFinish(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {examToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Exam</h2>
            <p>Are you sure you want to delete this exam?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setExamToDelete(null)}
              >
                No
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  deleteExam(examToDelete.id);
                  setExamToDelete(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

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
