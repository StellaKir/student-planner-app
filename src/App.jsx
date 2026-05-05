import "./App.css";
import { useState, useEffect } from "react";
import { courses } from "./data/courses";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function App() {
  const [courseList, setCourseList] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : courses;
  });

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courseList));
  }, [courseList]);

  function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function addCourse() {
    const title = document.getElementById("title").value.trim();
    const day = document.getElementById("day").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const room = document.getElementById("room").value.trim();

    if (!title || !start || !end || !room) {
      alert("Please fill in all fields.");
      return;
    }

    if (toMinutes(start) >= toMinutes(end)) {
      alert("Start time must be before end time.");
      return;
    }

    const conflict = courseList.some((course) => {
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

    const newCourse = {
      id: Date.now(),
      title,
      day,
      startTime: start,
      endTime: end,
      room,
      color: "blue",
    };

    setCourseList([...courseList, newCourse]);

    document.getElementById("title").value = "";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("room").value = "";
  }

  function deleteCourse(id) {
    const updatedCourses = courseList.filter((course) => course.id !== id);
    setCourseList(updatedCourses);
  }

  return (
    <div className="app">
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
        </header>

        <div className="form">
          <input placeholder="Course name" id="title" />

          <select id="day">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
          </select>

          <input type="time" id="start" />
          <input type="time" id="end" />
          <input placeholder="Room" id="room" />

          <button onClick={addCourse}>Add Course</button>
        </div>

        <section className="schedule">
          {days.map((day) => {
            const dayCourses = courseList.filter(
              (course) => course.day === day
            );

            return (
              <div className="day" key={day}>
                <h3>{day}</h3>

                {dayCourses.map((course) => (
                  <div className={`course ${course.color}`} key={course.id}>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCourse(course.id)}
                    >
                      ×
                    </button>

                    <strong>{course.title}</strong>
                    <span>
                      {course.startTime} - {course.endTime}
                    </span>
                    <small>{course.room}</small>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default App;