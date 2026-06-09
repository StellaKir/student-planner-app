import { useState } from "react";

function CoursesTab({
  savedCourses,
  openCourseModal,
  deleteSavedCourse,
  editSavedCourse,
}) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Courses</h2>
          <p>Manage your saved university courses.</p>
        </div>

        <button onClick={openCourseModal}>+ Add Course</button>
      </div>

      {savedCourses.length === 0 ? (
        <p className="empty-day">No courses added yet.</p>
      ) : (
        <div className="courses-grid">
          {savedCourses.map((course) => (
            <div
              className={`course-box ${course.color}`}
              key={course.id}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="course-box-icon">
                {course.title.charAt(0).toUpperCase()}
              </div>

              <h3>{course.title}</h3>

              {course.teacher && <p>{course.teacher}</p>}

              <span>View details →</span>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal course-details-modal">
            <button
              className="modal-close-btn"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>

            <div className={`course-box-icon ${selectedCourse.color}`}>
              {selectedCourse.title.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedCourse.title}</h2>

            {selectedCourse.teacher && (
              <p>
                <strong>Teacher:</strong> {selectedCourse.teacher}
              </p>
            )}

            {selectedCourse.notes ? (
              <p>
                <strong>Notes:</strong> {selectedCourse.notes}
              </p>
            ) : (
              <p>No notes for this course.</p>
            )}

            <div className="modal-buttons">
              <button
                onClick={() => {
                  editSavedCourse(selectedCourse);
                  setSelectedCourse(null);
                }}
              >
                Edit
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  setCourseToDelete(selectedCourse);
                  setSelectedCourse(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {courseToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Course</h2>
            <p>Are you sure you want to delete this course?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setCourseToDelete(null)}
              >
                No
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  deleteSavedCourse(courseToDelete.id);
                  setCourseToDelete(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CoursesTab;
