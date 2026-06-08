function CoursesTab({ savedCourses, openCourseModal, deleteSavedCourse }) {
  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Courses</h2>
          <p>Manage your saved university courses.</p>
        </div>

        <button onClick={openCourseModal}>+ Add Course</button>
      </div>

      <div className="course-list">
        {savedCourses.length === 0 ? (
          <p className="empty-day">No courses added yet.</p>
        ) : (
          savedCourses.map((course) => (
            <div className={`list-card ${course.color}`} key={course.id}>
              <div>
                <strong>{course.title}</strong>

                {course.teacher && <p>Teacher: {course.teacher}</p>}

                {course.notes && <p className="course-notes">{course.notes}</p>}
              </div>

              <div className="course-actions">
                <button
                  className="assignment-delete-btn"
                  onClick={() => deleteSavedCourse(course.id)}
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
