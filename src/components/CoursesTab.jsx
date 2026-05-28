function CoursesTab({
  courseList,
  formatTime,
  openAddModal,
  editCourse,
  deleteCourse,
  toggleComplete,
}) {
  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Courses</h2>
          <p>Manage all your university classes.</p>
        </div>

        <button onClick={openAddModal}>+ Add New Course</button>
      </div>

      <div className="course-list">
        {courseList.length === 0 ? (
          <p className="empty-day">No courses added yet.</p>
        ) : (
          courseList.map((course) => (
            <div className={`list-card ${course.color}`} key={course.id}>
              <div>
                <strong>{course.title}</strong>

                <p>
                  {course.day} · {formatTime(course.startTime)} -{" "}
                  {formatTime(course.endTime)}
                </p>

                <small>{course.room}</small>

                {course.notes && <p className="course-notes">{course.notes}</p>}
              </div>

              <div className="course-actions">
                <span className={course.completed ? "status done" : "status"}>
                  {course.completed ? "Completed" : "Pending"}
                </span>

                <button onClick={() => editCourse(course)}>Edit</button>

                <button onClick={() => toggleComplete(course.id)}>
                  {course.completed ? "Undo" : "Complete"}
                </button>

                <button
                  className="assignment-delete-btn"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default CoursesTab;
