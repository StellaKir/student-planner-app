import "./App.css";
import { useState, useEffect } from "react";
import { courses } from "./data/courses";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function App() {
  const [courseList, setCourseList] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : courses;
  });

  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courseList));
  }, [courseList]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(time) {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("day").value = "Monday";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("room").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("color").value = "blue";
  }

  function openAddModal() {
    setEditingId(null);
    setShowFormModal(true);

    setTimeout(() => {
      clearForm();
    }, 0);
  }

  function addCourse() {
    const title = document.getElementById("title").value.trim();
    const day = document.getElementById("day").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const room = document.getElementById("room").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const color = document.getElementById("color").value;

    if (!title || !start || !end || !room) {
      alert("Please fill in all fields.");
      return;
    }

    if (toMinutes(start) >= toMinutes(end)) {
      alert("Start time must be before end time.");
      return;
    }

    const conflict = courseList.some((course) => {
      if (course.id === editingId) return false;
      if (course.day !== day) return false;

      const newStart = toMinutes(start);
      const newEnd = toMinutes(end);
      const existingStart = toMinutes(course.startTime);
      const existingEnd = toMinutes(course.endTime);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflict) {
      alert("Time conflict! You already have a course at that time.");
      return;
    }

    const existingCourse = courseList.find((course) => course.id === editingId);

    const newCourse = {
      id: editingId || Date.now(),
      title,
      day,
      startTime: start,
      endTime: end,
      room,
      notes,
      color,
      completed: existingCourse ? existingCourse.completed : false,
    };

    if (editingId) {
      const updatedCourses = courseList.map((course) =>
        course.id === editingId ? newCourse : course,
      );

      setCourseList(updatedCourses);
      setEditingId(null);
    } else {
      setCourseList([...courseList, newCourse]);
    }

    setShowFormModal(false);
  }

  function deleteCourse(id) {
    setCourseToDelete(id);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    const updatedCourses = courseList.filter(
      (course) => course.id !== courseToDelete,
    );

    setCourseList(updatedCourses);

    if (editingId === courseToDelete) {
      setEditingId(null);
    }

    setShowDeleteModal(false);
    setCourseToDelete(null);
  }

  function editCourse(course) {
    setEditingId(course.id);
    setShowFormModal(true);

    setTimeout(() => {
      document.getElementById("title").value = course.title;
      document.getElementById("day").value = course.day;
      document.getElementById("start").value = course.startTime;
      document.getElementById("end").value = course.endTime;
      document.getElementById("room").value = course.room;
      document.getElementById("notes").value = course.notes || "";
      document.getElementById("color").value = course.color;
    }, 0);
  }

  function toggleComplete(id) {
    const updatedCourses = courseList.map((course) =>
      course.id === id ? { ...course, completed: !course.completed } : course,
    );

    setCourseList(updatedCourses);
  }

  function cancelEdit() {
    setEditingId(null);
    setShowFormModal(false);
  }

  function toggleExpand(id) {
    setExpandedCourse(expandedCourse === id ? null : id);
  }

  function clearAllCourses() {
    setCourseList([]);
    setShowClearModal(false);
    setEditingId(null);
  }

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && course.completed) ||
      (statusFilter === "pending" && !course.completed);

    return matchesSearch && matchesStatus;
  });

  const totalCourses = courseList.length;
  const completedCourses = courseList.filter(
    (course) => course.completed,
  ).length;
  const pendingCourses = totalCourses - completedCourses;

  const progress =
    totalCourses === 0
      ? 0
      : Math.round((completedCourses / totalCourses) * 100);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <aside className="sidebar">
        <h2>StudyPlan</h2>

        <nav>
          <a>Schedule</a>
          <a>Courses</a>
          <a>Notes</a>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>My Schedule</h1>
            <p>Organize your weekly university classes</p>
          </div>

          <div className="header-actions">
            <button onClick={openAddModal}>Add Course</button>

            <button
              className="theme-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              className="clear-btn"
              onClick={() => setShowClearModal(true)}
            >
              Clear All
            </button>
          </div>
        </header>

        <div className="stats">
          <div className="stat-card">
            <span>Total Courses</span>
            <strong>{totalCourses}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCourses}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingCourses}</strong>
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
        </div>

        <section className="schedule">
          {days.map((day) => {
            const dayCourses = filteredCourses
              .filter((course) => course.day === day)
              .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

            return (
              <div className="day" key={day}>
                <h3>{day}</h3>

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
        </section>
      </main>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h2>{editingId ? "Edit Course" : "Add New Course"}</h2>

            <div className="form">
              <input placeholder="Course name" id="title" />

              <select id="day">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>

              <select id="start">
                <option value="">Start time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>

              <select id="end">
                <option value="">End time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>

              <input placeholder="Room" id="room" />

              <textarea placeholder="Notes..." id="notes" rows="3"></textarea>

              <select id="color">
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>

              <button onClick={addCourse}>
                {editingId ? "Update Course" : "Add Course"}
              </button>

              <button className="cancel-edit-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Remove Class</h2>
            <p>Are you sure you want to remove this class?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>

              <button className="confirm-btn" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Clear Schedule</h2>
            <p>Are you sure you want to remove all courses?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowClearModal(false)}
              >
                No
              </button>

              <button className="confirm-btn" onClick={clearAllCourses}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
