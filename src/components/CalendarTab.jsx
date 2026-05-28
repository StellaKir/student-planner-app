import Calendar from "react-calendar";

function CalendarTab({
  selectedDate,
  setSelectedDate,
  tileClassName,
  tileContent,
  assignments,
  exams,
}) {
  return (
    <section className="tab-section">
      <h2>Calendar</h2>

      <div className="calendar-wrapper">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          className="study-calendar"
          locale="en-US"
          tileClassName={tileClassName}
          tileContent={tileContent}
        />

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="dot assignment-dot"></span>
            Assignments
          </div>

          <div className="legend-item">
            <span className="dot exam-dot"></span>
            Exams
          </div>
        </div>

        <p className="selected-date">
          Selected date:{" "}
          <strong>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>
        </p>

        <div className="calendar-events">
          {[
            ...assignments.filter(
              (assignment) =>
                assignment.dueDate === selectedDate.toISOString().split("T")[0],
            ),

            ...exams.filter(
              (exam) => exam.date === selectedDate.toISOString().split("T")[0],
            ),
          ].length === 0 ? (
            <p className="empty-day">No events for this day.</p>
          ) : (
            <>
              {assignments
                .filter(
                  (assignment) =>
                    assignment.dueDate ===
                    selectedDate.toISOString().split("T")[0],
                )
                .map((assignment) => (
                  <div className="assignment-card" key={assignment.id}>
                    <div>
                      <strong>📌 {assignment.title}</strong>

                      <p>{assignment.course}</p>
                    </div>
                  </div>
                ))}

              {exams
                .filter(
                  (exam) =>
                    exam.date === selectedDate.toISOString().split("T")[0],
                )
                .map((exam) => (
                  <div className="exam-card" key={exam.id}>
                    <div>
                      <strong>🎓 {exam.title}</strong>

                      <p>{exam.course}</p>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default CalendarTab;
