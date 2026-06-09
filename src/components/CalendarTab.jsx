import Calendar from "react-calendar";

function CalendarTab({
  selectedDate,
  setSelectedDate,
  tileClassName,
  tileContent,
  assignments,
  exams,
  courseList,
}) {
  const selectedDateString = selectedDate.toLocaleDateString("en-CA");

  const selectedDayName = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const selectedAssignments = assignments.filter(
    (assignment) => assignment.dueDate === selectedDateString,
  );

  const selectedExams = exams.filter(
    (exam) => exam.date === selectedDateString,
  );

  const selectedClasses = courseList
    .filter((course) => course.date === selectedDateString)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedEvents = [
    ...selectedClasses,
    ...selectedAssignments,
    ...selectedExams,
  ];
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
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
        />
        <div className="calendar-side-panel">
          <div className="calendar-legend">
            <div className="legend-item">
              <span className="dot class-dot"></span>
              Classes
            </div>

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
            {selectedEvents.length === 0 ? (
              <p className="empty-day">No events for this day.</p>
            ) : (
              <>
                {selectedClasses.map((course) => (
                  <div className="calendar-class-card" key={course.id}>
                    <strong>📘 {course.title}</strong>
                    <p>
                      {course.startTime} - {course.endTime} · {course.room}
                    </p>
                  </div>
                ))}

                {selectedAssignments.map((assignment) => (
                  <div className="assignment-card" key={assignment.id}>
                    <strong>📌 {assignment.title}</strong>
                    <p>{assignment.course}</p>
                  </div>
                ))}

                {selectedExams.map((exam) => (
                  <div className="exam-card" key={exam.id}>
                    <strong>🎓 {exam.title}</strong>
                    <p>{exam.course}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalendarTab;
