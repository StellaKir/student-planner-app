import DashboardCards from "./DashboardCards";

function ScheduleTab({
  days,
  todayCourses,
  upcomingExams,
  pendingAssignments,
  exams,
  totalStudyHours,
  completedCourses,
  pendingCourses,
  missedCourses,
  updateClassStatus,
  totalCourses,
  progress,
  filteredCourses,
  toMinutes,
}) {
  const today = new Date();

  const getWeekDates = () => {
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);

      return {
        day,
        date: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  };

  const weekDates = getWeekDates();

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sortedTodayCourses = [...todayCourses].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );

  const getCourseStatus = (course) => {
    const start = toMinutes(course.startTime);
    const end = toMinutes(course.endTime);

    if (currentMinutes > end) return "done";

    if (currentMinutes >= start && currentMinutes <= end) {
      return "active";
    }

    return "next";
  };

  const courseStats = Object.values(
    filteredCourses.reduce((acc, course) => {
      if (!acc[course.title]) {
        acc[course.title] = {
          title: course.title,
          color: course.color,
          count: 0,
        };
      }

      acc[course.title].count += 1;

      return acc;
    }, {}),
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const maxCourseCount =
    courseStats.length > 0
      ? Math.max(...courseStats.map((course) => course.count))
      : 1;

  return (
    <>
      <DashboardCards
        todayCourses={todayCourses}
        pendingAssignments={pendingAssignments}
        exams={exams}
        upcomingExams={upcomingExams}
        totalStudyHours={totalStudyHours}
      />

      <div className="dashboard-grid">
        <section className="dashboard-panel today-schedule-panel">
          <div className="panel-header">
            <h2>Today's Schedule</h2>
            <button>View full schedule →</button>
          </div>

          <div className="today-timeline">
            {todayCourses.length === 0 ? (
              <p className="empty-day">No classes for today 🎉</p>
            ) : (
              sortedTodayCourses.slice(0, 3).map((course) => {
                const status = getCourseStatus(course);
                return (
                  <div
                    className={`timeline-card ${course.color} ${
                      status === "active" ? "in-progress" : ""
                    } ${status === "next" ? "next-class" : ""}`}
                    key={course.id}
                  >
                    <div className="timeline-time">
                      <span>{course.startTime}</span>
                      <span>{course.endTime}</span>
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-title-row">
                        <strong>{course.title}</strong>

                        {course.status === "completed" && (
                          <span className="status-badge completed">
                            Completed
                          </span>
                        )}

                        {course.status === "missed" && (
                          <span className="status-badge missed">Missed</span>
                        )}

                        {(!course.status || course.status === "pending") && (
                          <span className="status-badge pending">Pending</span>
                        )}

                        {status === "done" && (
                          <small className="status-pill done">Done</small>
                        )}

                        {status === "active" && (
                          <small className="status-pill active">
                            In Progress
                          </small>
                        )}

                        {status === "next" && (
                          <small className="status-pill next">Next</small>
                        )}
                      </div>

                      <p>{course.room}</p>
                      <div className="class-status-actions">
                        <button
                          className="done-btn"
                          onClick={() =>
                            updateClassStatus(course.id, "completed")
                          }
                        >
                          Done
                        </button>

                        <button
                          className="missed-btn"
                          onClick={() => updateClassStatus(course.id, "missed")}
                        >
                          Missed
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="dashboard-panel study-progress-panel">
          <h2>Study Progress</h2>

          <div className="progress-circle" style={{ "--progress": progress }}>
            <span>{progress}%</span>
            <small>Completed</small>
          </div>

          <div className="progress-stats">
            <p>
              <strong>{completedCourses}</strong> completed
            </p>

            <p>
              <strong>{missedCourses}</strong> missed
            </p>

            <p>
              <strong>{pendingCourses}</strong> pending
            </p>
          </div>
        </section>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="dashboard-panel week-overview-panel">
          <div className="panel-header">
            <h2>This Week Overview</h2>
          </div>

          <div className="week-calendar">
            <div className="week-days">
              {weekDates.map((item) => (
                <div
                  className={`week-day ${item.isToday ? "active-day" : ""}`}
                  key={item.day}
                >
                  <span>{item.day.slice(0, 3)}</span>
                  <strong>{item.date}</strong>
                </div>
              ))}
            </div>

            <div className="week-grid">
              {days.map((day) => {
                const weekDate = weekDates.find((item) => item.day === day);

                const dayCourses = filteredCourses.filter(
                  (course) =>
                    course.day === day &&
                    Number(course.date?.split("-")[2]) === weekDate.date,
                );

                return (
                  <div className="week-column" key={day}>
                    {dayCourses.slice(0, 3).map((course) => (
                      <div
                        className={`mini-course ${course.color}`}
                        key={course.id}
                      >
                        <strong>{course.title}</strong>
                        <span>
                          {course.startTime} - {course.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="dashboard-panel top-courses-panel">
          <div className="panel-header">
            <h2>Top Courses</h2>
            <span>{filteredCourses.length} courses</span>
          </div>

          <div className="top-courses-list">
            {courseStats.map((course) => (
              <div className="top-course" key={course.id}>
                <div className={`course-dot ${course.color}`}></div>

                <div className="top-course-info">
                  <div className="top-course-title">
                    <span>{course.title}</span>
                    <small>
                      {course.count} {course.count === 1 ? "class" : "classes"}
                    </small>
                  </div>

                  <div className="top-course-bar">
                    <div
                      className={`top-course-fill ${course.color}`}
                      style={{
                        width: `${(course.count / maxCourseCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default ScheduleTab;
