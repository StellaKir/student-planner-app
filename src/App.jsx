import "./App.css";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  BookOpen,
  StickyNote,
  Moon,
  Sun,
  Star,
} from "lucide-react";
import { courses } from "./data/courses";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const todayName = new Date().toLocaleDateString("en-US", {
  weekday: "long",
});

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
  const [activeTab, setActiveTab] = useState("schedule");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "",
  );

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
    document.getElementById("priority").value = "low";
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
    const priority = document.getElementById("priority").value;
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
      priority,
      completed: existingCourse ? existingCourse.completed : false,
      favorite: existingCourse ? existingCourse.favorite : false,
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
      document.getElementById("priority").value = course.priority || "low";
      document.getElementById("color").value = course.color;
    }, 0);
  }

  function toggleComplete(id) {
    const updatedCourses = courseList.map((course) =>
      course.id === id ? { ...course, completed: !course.completed } : course,
    );

    setCourseList(updatedCourses);
  }

  function toggleFavorite(id) {
    const updatedCourses = courseList.map((course) =>
      course.id === id ? { ...course, favorite: !course.favorite } : course,
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

  function exportSchedule() {
    const data = JSON.stringify(courseList, null, 2);
    const file = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "student-schedule.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  const filteredCourses = courseList.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && course.completed) ||
      (statusFilter === "pending" && !course.completed);

    const matchesColor = colorFilter === "all" || course.color === colorFilter;

    return matchesSearch && matchesStatus && matchesColor;
  });

  const totalCourses = courseList.length;
  const completedCourses = courseList.filter(
    (course) => course.completed,
  ).length;
  const pendingCourses = totalCourses - completedCourses;
  const totalStudyMinutes = courseList.reduce((total, course) => {
    return total + (toMinutes(course.endTime) - toMinutes(course.startTime));
  }, 0);

  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;
  const dailyStudyLoad = days.map((day) => {
    const minutes = courseList
      .filter((course) => course.day === day)
      .reduce((total, course) => {
        return (
          total + (toMinutes(course.endTime) - toMinutes(course.startTime))
        );
      }, 0);

    return {
      day,
      hours: Math.round((minutes / 60) * 10) / 10,
    };
  });
  const progress =
    totalCourses === 0
      ? 0
      : Math.round((completedCourses / totalCourses) * 100);

  const todayCourses = courseList
    .filter((course) => course.day === todayName)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const upcomingCourse = todayCourses.find(
    (course) => toMinutes(course.startTime) >= currentMinutes,
  );

  function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setUsername(username);
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    setUsername("");
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>StudyPlan</h1>

          <p>Sign in to manage your university schedule</p>

          <input type="text" placeholder="Username" id="login-username" />

          <input type="password" placeholder="Password" id="login-password" />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <button
        className="theme-toggle floating-theme"
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <aside className="sidebar">
        <h2>StudyPlan</h2>

        <nav>
          <button
            className={
              activeTab === "schedule" ? "nav-link active" : "nav-link"
            }
            onClick={() => setActiveTab("schedule")}
          >
            <>
              <CalendarDays size={18} />
              Schedule
            </>
          </button>

          <button
            className={activeTab === "courses" ? "nav-link active" : "nav-link"}
            onClick={() => setActiveTab("courses")}
          >
            <>
              <BookOpen size={18} />
              Courses
            </>
          </button>

          <button
            className={activeTab === "notes" ? "nav-link active" : "nav-link"}
            onClick={() => setActiveTab("notes")}
          >
            <>
              <StickyNote size={18} />
              Notes
            </>
          </button>

          <button
            className={
              activeTab === "favorites" ? "nav-link active" : "nav-link"
            }
            onClick={() => setActiveTab("favorites")}
          >
            <Star size={18} />
            Favorites
          </button>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <div>
              <h1>My Schedule</h1>
              <p>Organize your weekly university classes</p>
            </div>

            <div className="profile-box">
              <div className="avatar">{username.charAt(0).toUpperCase()}</div>

              <div>
                <strong>{username}</strong>
                <p>Student</p>
                <button className="profile-logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button onClick={openAddModal}>Add Course</button>

            <button className="export-btn" onClick={exportSchedule}>
              Export
            </button>

            <button
              className="clear-btn"
              onClick={() => setShowClearModal(true)}
            >
              Clear All
            </button>
          </div>
        </header>

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

          <div className="stat-card">
            <span>Weekly Hours</span>
            <strong>{totalStudyHours}h</strong>
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

        {activeTab === "schedule" && (
          <section className="schedule">
            {days.map((day) => {
              const dayCourses = filteredCourses
                .filter((course) => course.day === day)
                .sort(
                  (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
                );

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
                          course.favorite
                            ? "favorite-btn active"
                            : "favorite-btn"
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
          </section>
        )}
        {activeTab === "courses" && (
          <section className="tab-section">
            <h2>All Courses</h2>

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
                    </div>

                    <span
                      className={course.completed ? "status done" : "status"}
                    >
                      {course.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
        {activeTab === "notes" && (
          <section className="tab-section">
            <h2>Course Notes</h2>

            <div className="course-list">
              {courseList.filter((course) => course.notes).length === 0 ? (
                <p className="empty-day">No notes added yet.</p>
              ) : (
                courseList
                  .filter((course) => course.notes)
                  .map((course) => (
                    <div
                      className={`list-card ${course.color}`}
                      key={course.id}
                    >
                      <div>
                        <strong>{course.title}</strong>
                        <p>{course.notes}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}

        {activeTab === "favorites" && (
          <section className="tab-section">
            <h2>Favorite Courses</h2>

            <div className="course-list">
              {courseList.filter((course) => course.favorite).length === 0 ? (
                <p className="empty-day">No favorite courses yet.</p>
              ) : (
                courseList
                  .filter((course) => course.favorite)
                  .map((course) => (
                    <div
                      className={`list-card ${course.color}`}
                      key={course.id}
                    >
                      <div>
                        <strong>{course.title}</strong>
                        <p>
                          {course.day} · {formatTime(course.startTime)} -{" "}
                          {formatTime(course.endTime)}
                        </p>
                        <small>{course.room}</small>
                      </div>

                      <span
                        className={course.completed ? "status done" : "status"}
                      >
                        {course.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}
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

              <select id="priority">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

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
