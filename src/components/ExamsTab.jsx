function ExamsTab({ exams, deleteExam, toggleExamComplete }) {
  return (
    <section className="tab-section">
      <h2>Exams</h2>

      <div className="exam-list">
        {[...exams]
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

                <small>Date: {exam.date}</small>
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
          ))}
      </div>
    </section>
  );
}

export default ExamsTab;
