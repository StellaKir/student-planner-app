import DashboardCards from "./DashboardCards";

function ScheduleTab({
  days,
  todayName,
  todayCourses,
  upcomingCourse,
  upcomingAssignments,
  upcomingExams,
  pendingAssignments,
  exams,
  totalStudyHours,
  formatTime,
  formatReminderText,
  getReminderStatus,
  getDaysUntil,
  completedCourses,
  pendingCourses,
  totalCourses,
  progress,
  dailyStudyLoad,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  colorFilter,
  setColorFilter,
  filteredCourses,
  toMinutes,
  toggleExpand,
  expandedCourse,
  toggleFavorite,
  deleteCourse,
  editCourse,
  toggleComplete,
}) {
  return (
    <>
      <DashboardCards
        todayCourses={todayCourses}
        pendingAssignments={pendingAssignments}
        exams={exams}
        upcomingExams={upcomingExams}
        totalStudyHours={totalStudyHours}
      />

      <div className="today-section">
        <div className="today-header">
          <div>
            <h2>Today's Classes</h2>
            <p>{todayName}</p>
          </div>

          {upcomingCourse && (
            <div className="upcoming-badge">
              Next: {upcomingCourse.title} at{" "}
              {formatTime(upcomingCourse.startTime)}
            </div>
          )}
        </div>

        <div className="today-list">
          {todayCourses.length === 0 ? (
            <p className="empty-day">No classes for today 🎉</p>
          ) : (
            todayCourses.map((course) => (
              <div className={`today-card ${course.color}`} key={course.id}>
                <div>
                  <strong>{course.title}</strong>

                  <span className={`priority ${course.priority || "low"}`}>
                    {course.priority || "low"}
                  </span>

                  <p>
                    {formatTime(course.startTime)} -{" "}
                    {formatTime(course.endTime)}
                  </p>
                </div>

                <span>{course.room}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="reminders-section">
        <div className="reminders-header">
          <h2>Reminders</h2>
          <span>
            {upcomingAssignments.length + upcomingExams.length} upcoming
          </span>
        </div>

        <div className="reminders-list">
          {upcomingAssignments.length === 0 && upcomingExams.length === 0 ? (
            <p className="empty-day">No upcoming reminders 🎉</p>
          ) : (
            <>
              {upcomingAssignments.map((assignment) => (
                <div
                  className="reminder-card assignment-reminder"
                  key={assignment.id}
                >
                  <div className="reminder-top">
                    <strong>{assignment.title}</strong>

                    <span
                      className={`reminder-badge ${
                        getDaysUntil(assignment.dueDate) === 0
                          ? "badge-urgent"
                          : getDaysUntil(assignment.dueDate) === 1
                            ? "badge-tomorrow"
                            : "badge-upcoming"
                      }`}
                    >
                      {getReminderStatus(assignment.dueDate)}
                    </span>
                  </div>

                  <p>
                    Assignment · {assignment.course} ·{" "}
                    {formatReminderText("assignment", assignment.dueDate)}
                  </p>
                </div>
              ))}

              {upcomingExams.map((exam) => (
                <div
                  className={`reminder-card exam-reminder ${
                    getDaysUntil(exam.date) === 0
                      ? "urgent-reminder"
                      : getDaysUntil(exam.date) === 1
                        ? "tomorrow-reminder"
                        : ""
                  }`}
                  key={exam.id}
                >
                  <div className="reminder-top">
                    <strong>{exam.title}</strong>

                    <span
                      className={`reminder-badge ${
                        getDaysUntil(exam.date) === 0
                          ? "badge-urgent"
                          : getDaysUntil(exam.date) === 1
                            ? "badge-tomorrow"
                            : "badge-upcoming"
                      }`}
                    >
                      {getReminderStatus(exam.date)}
                    </span>
                  </div>

                  <p>
                    Exam · {exam.course} ·{" "}
                    {formatReminderText("exam", exam.date)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Course Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="daily-load">
        <h2>Daily Study Load</h2>

        <div className="daily-load-list">
          {dailyStudyLoad.map((item) => (
            <div className="daily-load-item" key={item.day}>
              <span>{item.day}</span>
              <strong>{item.hours}h</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
        >
          <option value="all">All Colors</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
        </select>

        <button
          className="reset-filters-btn"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setColorFilter("all");
          }}
        >
          Reset
        </button>
      </div>

      <section className="tab-section">
        <div className="schedule">
          {days.map((day) => {
            const dayCourses = filteredCourses
              .filter((course) => course.day === day)
              .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

            return (
              <div className="day" key={day}>
                <h3>
                  {day}
                  <span className="day-count">
                    {dayCourses.length}{" "}
                    {dayCourses.length === 1 ? "class" : "classes"}
                  </span>
                </h3>

                {dayCourses.length === 0 && (
                  <p className="empty-day">No classes scheduled</p>
                )}

                {dayCourses.map((course) => (
                  <div
                    className={`course ${course.color} ${
                      course.completed ? "completed-course" : ""
                    }`}
                    key={course.id}
                    onClick={() => toggleExpand(course.id)}
                  >
                    <button
                      className={
                        course.favorite ? "favorite-btn active" : "favorite-btn"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(course.id);
                      }}
                    >
                      ★
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course.id);
                      }}
                    >
                      ×
                    </button>

                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        editCourse(course);
                      }}
                    >
                      Edit
                    </button>

                    <strong>{course.title}</strong>

                    <span className={`priority ${course.priority || "low"}`}>
                      {course.priority || "low"}
                    </span>

                    <span>
                      {formatTime(course.startTime)} -{" "}
                      {formatTime(course.endTime)}
                    </span>

                    {expandedCourse === course.id && (
                      <>
                        <small>{course.room}</small>

                        <button
                          className="complete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(course.id);
                          }}
                        >
                          {course.completed ? "Completed" : "Mark Complete"}
                        </button>

                        {course.notes && (
                          <p className="course-notes">{course.notes}</p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default ScheduleTab;
