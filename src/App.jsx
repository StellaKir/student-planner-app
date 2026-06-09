import "react-calendar/dist/Calendar.css";
import "./App.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/header.css";
import "./styles/dashboard.css";
import "./styles/schedule.css";
import "./styles/courses.css";
import "./styles/assignments.css";
import "./styles/notes.css";
import "./styles/exams.css";
import "./styles/calendar.css";
import "./styles/responsive.css";
import "./styles/darkmode.css";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AssignmentsTab from "./components/AssignmentsTab";
import NotesTab from "./components/NotesTab";
import ExamsTab from "./components/ExamsTab";
import CalendarTab from "./components/CalendarTab";
import ScheduleTab from "./components/ScheduleTab";
import CoursesTab from "./components/CoursesTab";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const todayName = new Date().toLocaleDateString("en-US", {
  weekday: "long",
});

function App() {
  const [courseList, setCourseList] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [savedCourses, setSavedCourses] = useState(() => {
    const saved = localStorage.getItem("savedCourses");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingSavedCourseId, setEditingSavedCourseId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  const [expandedCourse, setExpandedCourse] = useState(null);

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("exams");
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);

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
    localStorage.setItem("savedCourses", JSON.stringify(savedCourses));
  }, [savedCourses]);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

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
    const title = document.getElementById("title").value;
    const date = document.getElementById("class-date").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const room = document.getElementById("room").value.trim();

    const selectedCourse = savedCourses.find(
      (course) => course.title === title,
    );

    if (!title || !date || !start || !end || !room) {
      alert("Please fill in all fields.");
      return;
    }

    if (!selectedCourse) {
      alert("Please select a saved course.");
      return;
    }

    if (toMinutes(start) >= toMinutes(end)) {
      alert("Start time must be before end time.");
      return;
    }

    const conflict = courseList.some((course) => {
      if (course.id === editingId) return false;
      if (course.date !== date) return false;

      const newStart = toMinutes(start);
      const newEnd = toMinutes(end);
      const existingStart = toMinutes(course.startTime);
      const existingEnd = toMinutes(course.endTime);

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflict) {
      alert("Time conflict! You already have a class at that time.");
      return;
    }

    const existingCourse = courseList.find((course) => course.id === editingId);

    const newCourse = {
      id: editingId || Date.now(),
      courseId: selectedCourse.id,
      title: selectedCourse.title,
      teacher: selectedCourse.teacher,
      notes: selectedCourse.notes,
      color: selectedCourse.color,
      date,
      day: new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      startTime: start,
      endTime: end,
      room,
      status: existingCourse ? existingCourse.status : "pending",
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
      document.getElementById("class-date").value = course.date || "";
      document.getElementById("start").value = course.startTime;
      document.getElementById("end").value = course.endTime;
      document.getElementById("room").value = course.room;
      document.getElementById("notes").value = course.notes || "";
      document.getElementById("color").value = course.color;
    }, 0);
  }

  function editSavedCourse(course) {
    setEditingSavedCourseId(course.id);
    setShowFormModal(true);

    setTimeout(() => {
      document.getElementById("title").value = course.title;
      document.getElementById("teacher").value = course.teacher || "";
      document.getElementById("notes").value = course.notes || "";
      document.getElementById("color").value = course.color;
    }, 0);
  }

  function editNote(note) {
    setEditingNoteId(note.id);
    setShowNoteForm(true);

    setTimeout(() => {
      document.getElementById("note-course").value = note.course;
      document.getElementById("note-text").value = note.text;
      document.getElementById("note-file").value = "";
    }, 0);
  }

  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  function deleteNoteFile(noteId, fileId) {
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              files: note.files.filter((file) => file.id !== fileId),
            }
          : note,
      ),
    );
  }

  function toggleComplete(id) {
    const updatedCourses = courseList.map((course) =>
      course.id === id ? { ...course, completed: !course.completed } : course,
    );

    setCourseList(updatedCourses);
  }

  function deleteSavedCourse(id) {
    setSavedCourses(savedCourses.filter((course) => course.id !== id));
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

    const matchesColor = colorFilter === "all" || course.color === colorFilter;

    return matchesSearch && matchesStatus && matchesColor;
  });

  const totalCourses = courseList.length;
  const completedCourses = courseList.filter(
    (course) => course.status === "completed",
  ).length;

  const missedCourses = courseList.filter(
    (course) => course.status === "missed",
  ).length;

  const pendingCourses = courseList.filter(
    (course) => !course.status || course.status === "pending",
  ).length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(
    (assignment) => assignment.completed,
  ).length;
  const pendingAssignments = totalAssignments - completedAssignments;
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

  function getDaysUntil(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const difference = targetDate - today;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }
  const upcomingAssignments = assignments
    .filter((assignment) => {
      const daysUntil = getDaysUntil(assignment.dueDate);
      return !assignment.completed && daysUntil >= 0 && daysUntil <= 2;
    })
    .sort((a, b) => getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate));

  const upcomingExams = exams
    .filter((exam) => {
      const daysUntil = getDaysUntil(exam.date);
      return daysUntil >= 0 && daysUntil <= 7;
    })
    .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));
  const remindersCount = upcomingAssignments.length + upcomingExams.length;

  function formatReminderText(type, dateString) {
    const daysUntil = getDaysUntil(dateString);

    if (daysUntil === 0) {
      return type === "assignment" ? "Due today" : "Exam today";
    }

    if (daysUntil === 1) {
      return type === "assignment" ? "Due tomorrow" : "Exam tomorrow";
    }

    return type === "assignment"
      ? `Due in ${daysUntil} days`
      : `Exam in ${daysUntil} days`;
  }

  function getReminderStatus(dateString) {
    const daysUntil = getDaysUntil(dateString);

    if (daysUntil === 0) return "TODAY";
    if (daysUntil === 1) return "TOMORROW";

    return "UPCOMING";
  }

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

  function toggleAssignment(id) {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === id
        ? { ...assignment, completed: !assignment.completed }
        : assignment,
    );

    setAssignments(updatedAssignments);
  }

  function deleteAssignment(id) {
    const updatedAssignments = assignments.filter(
      (assignment) => assignment.id !== id,
    );

    setAssignments(updatedAssignments);
  }

  function addExam() {
    const title = document.getElementById("exam-title").value.trim();
    const date = document.getElementById("exam-date").value;
    const course = document.getElementById("exam-course").value;

    if (!title || !date || !course) {
      alert("Please fill in all exam fields.");
      return;
    }

    const newExam = {
      id: Date.now(),
      title,
      date,
      course,
    };

    setExams([...exams, newExam]);
    setShowExamForm(false);

    document.getElementById("exam-title").value = "";
    document.getElementById("exam-date").value = "";
    document.getElementById("exam-course").value = "";
  }

  function updateExamResult(id, result) {
    setExams(
      exams.map((exam) => (exam.id === id ? { ...exam, result } : exam)),
    );
  }

  function editAssignment(assignment) {
    document.getElementById("assignment-title").value = assignment.title;
    document.getElementById("assignment-date").value = assignment.dueDate;
    document.getElementById("assignment-course").value = assignment.course;
    document.getElementById("assignment-notes").value = assignment.notes || "";

    setEditingAssignmentId(assignment.id);
  }

  function cancelAssignmentEdit() {
    setEditingAssignmentId(null);

    document.getElementById("assignment-title").value = "";
    document.getElementById("assignment-date").value = "";
    document.getElementById("assignment-course").value = "";
    document.getElementById("assignment-notes").value = "";
  }

  function openAssignmentModal() {
    setEditingAssignmentId(null);
    setShowAssignmentModal(true);
  }

  function closeAssignmentModal() {
    setEditingAssignmentId(null);
    setShowAssignmentModal(false);
  }

  function addNote() {
    const course = document.getElementById("note-course").value;
    const text = document.getElementById("note-text").value.trim();
    const fileInput = document.getElementById("note-file");

    if (!course || !text) {
      alert("Please select a course and write a note.");
      return;
    }

    const existingNote = notes.find((note) => note.id === editingNoteId);
    const existingFiles = existingNote?.files || [];

    const files = Array.from(fileInput.files);

    const saveNote = (newFiles) => {
      const updatedNote = {
        id: editingNoteId || Date.now(),
        course,
        text,
        files: [...existingFiles, ...newFiles],
        createdAt:
          existingNote?.createdAt ||
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      };

      if (editingNoteId) {
        setNotes(
          notes.map((note) => (note.id === editingNoteId ? updatedNote : note)),
        );
        setEditingNoteId(null);
      } else {
        setNotes([...notes, updatedNote]);
      }

      setShowNoteForm(false);
    };

    if (files.length === 0) {
      saveNote([]);
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                id: Date.now() + Math.random(),
                name: file.name,
                data: reader.result,
              });
            };

            reader.readAsDataURL(file);
          }),
      ),
    ).then(saveNote);
  }

  function addAssignment() {
    const title = document.getElementById("assignment-title").value.trim();
    const dueDate = document.getElementById("assignment-date").value;
    const course = document.getElementById("assignment-course").value;
    const notes = document.getElementById("assignment-notes").value.trim();

    if (!title || !dueDate || !course) {
      alert("Please fill in all fields.");
      return;
    }

    const newAssignment = {
      id: editingAssignmentId || Date.now(),
      title,
      dueDate,
      course,
      notes,
      completed: editingAssignmentId
        ? assignments.find((a) => a.id === editingAssignmentId)?.completed
        : false,
    };
    if (editingAssignmentId) {
      setAssignments(
        assignments.map((assignment) =>
          assignment.id === editingAssignmentId ? newAssignment : assignment,
        ),
      );

      setEditingAssignmentId(null);
    } else {
      setAssignments([...assignments, newAssignment]);
    }

    document.getElementById("assignment-title").value = "";
    document.getElementById("assignment-date").value = "";
    document.getElementById("assignment-notes").value = "";

    setShowAssignmentModal(false);
  }

  function tileClassName({ date, view }) {
    if (view !== "month") return "";

    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "today-highlight";
    }

    if (date < today && date.toDateString() !== today.toDateString()) {
      return "past-day";
    }

    return "";
  }

  function tileContent({ date, view }) {
    if (view !== "month") return null;

    const formattedDate = date.toLocaleDateString("en-CA");

    const hasClass = courseList.some((course) => course.date === formattedDate);

    const hasAssignment = assignments.some(
      (assignment) => assignment.dueDate === formattedDate,
    );

    const hasExam = exams.some((exam) => exam.date === formattedDate);

    return (
      <div className="calendar-dots">
        {hasClass && <span className="calendar-dot class-dot"></span>}

        {hasAssignment && <span className="calendar-dot assignment-dot"></span>}

        {hasExam && <span className="calendar-dot exam-dot"></span>}
      </div>
    );
  }

  function addSavedCourse() {
    const title = document.getElementById("title").value.trim();
    const teacher = document.getElementById("teacher").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const color = document.getElementById("color").value;

    if (!title) {
      alert("Please add a course name.");
      return;
    }

    const newCourse = {
      id: editingSavedCourseId || Date.now(),
      title,
      teacher,
      notes,
      color,
    };

    if (editingSavedCourseId) {
      setSavedCourses(
        savedCourses.map((course) =>
          course.id === editingSavedCourseId ? newCourse : course,
        ),
      );

      setEditingSavedCourseId(null);
    } else {
      setSavedCourses([...savedCourses, newCourse]);
    }

    setShowFormModal(false);
  }

  function updateClassStatus(id, status) {
    setCourseList(
      courseList.map((course) =>
        course.id === id ? { ...course, status } : course,
      ),
    );
  }

  function toggleExam(id) {
    const updatedExams = exams.map((exam) =>
      exam.id === id ? { ...exam, completed: !exam.completed } : exam,
    );

    setExams(updatedExams);
  }

  function deleteExam(id) {
    const updatedExams = exams.filter((exam) => exam.id !== id);

    setExams(updatedExams);
  }

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1 className="logo-login">
            <span className="logo-main">Plan</span>
            <span className="logo-accent">Oras</span>
          </h1>

          <p>Sign in to manage your university schedule</p>
          <p className="demo-note">
            Note: This is a demo app. You can log in using any username and
            password.
          </p>

          <input type="text" placeholder="Username" id="login-username" />

          <input type="password" placeholder="Password" id="login-password" />

          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main">
        <Header
          username={username}
          openAddModal={openAddModal}
          activeTab={activeTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {activeTab === "schedule" && (
          <ScheduleTab
            days={days}
            todayCourses={todayCourses}
            upcomingExams={upcomingExams}
            pendingAssignments={pendingAssignments}
            exams={exams}
            totalStudyHours={totalStudyHours}
            completedCourses={completedCourses}
            pendingCourses={pendingCourses}
            totalCourses={totalCourses}
            progress={progress}
            filteredCourses={filteredCourses}
            toMinutes={toMinutes}
            toggleExpand={toggleExpand}
            missedCourses={missedCourses}
            updateClassStatus={updateClassStatus}
          />
        )}

        {activeTab === "courses" && (
          <CoursesTab
            savedCourses={savedCourses}
            openCourseModal={openAddModal}
            deleteSavedCourse={deleteSavedCourse}
            editSavedCourse={editSavedCourse}
          />
        )}

        {activeTab === "notes" && (
          <NotesTab
            notes={notes}
            addNote={addNote}
            editNote={editNote}
            deleteNote={deleteNote}
            editingNoteId={editingNoteId}
            setEditingNoteId={setEditingNoteId}
            deleteNoteFile={deleteNoteFile}
            savedCourses={savedCourses}
            showNoteForm={showNoteForm}
            setShowNoteForm={setShowNoteForm}
          />
        )}

        {activeTab === "assignments" && (
          <AssignmentsTab
            assignments={assignments}
            completedAssignments={completedAssignments}
            pendingAssignments={pendingAssignments}
            toggleAssignmentComplete={toggleAssignment}
            deleteAssignment={deleteAssignment}
            editAssignment={editAssignment}
            openAssignmentModal={openAssignmentModal}
          />
        )}

        {activeTab === "exams" && (
          <ExamsTab
            exams={exams}
            deleteExam={deleteExam}
            toggleExamComplete={toggleExam}
            updateExamResult={updateExamResult}
            savedCourses={savedCourses}
            addExam={addExam}
            showExamForm={showExamForm}
            setShowExamForm={setShowExamForm}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            assignments={assignments}
            exams={exams}
            courseList={courseList}
          />
        )}
      </main>

      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h2>
              {editingAssignmentId ? "Edit Assignment" : "Add Assignment"}
            </h2>

            <div className="form">
              <input
                type="text"
                placeholder="Assignment title"
                id="assignment-title"
              />

              <input type="date" id="assignment-date" />

              <select id="assignment-course">
                <option value="">Select Course</option>

                {savedCourses.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>

              <select id="assignment-priority">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <textarea
                id="assignment-notes"
                placeholder="Assignment notes..."
                rows="3"
              ></textarea>

              <button onClick={addAssignment}>
                {editingAssignmentId ? "Update Assignment" : "Add Assignment"}
              </button>

              <button
                className="cancel-edit-btn"
                onClick={closeAssignmentModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h2>
              {activeTab === "courses"
                ? editingSavedCourseId
                  ? "Edit Course"
                  : "Add Course"
                : editingId
                  ? "Edit Class"
                  : "Add Class"}
            </h2>

            <div className="form">
              {activeTab === "courses" ? (
                <>
                  <input placeholder="Course name" id="title" />

                  <input placeholder="Teacher name" id="teacher" />

                  <textarea
                    placeholder="Notes..."
                    id="notes"
                    rows="3"
                  ></textarea>

                  <select id="color">
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>

                  <button onClick={addSavedCourse}>
                    {editingSavedCourseId ? "Update Course" : "Add Course"}
                  </button>
                </>
              ) : (
                <>
                  <select id="title">
                    <option value="">Select course</option>

                    {savedCourses.map((course) => (
                      <option key={course.id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>

                  <input type="date" id="class-date" />

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

                  <button onClick={addCourse}>
                    {editingId ? "Update Class" : "Add Class"}
                  </button>
                </>
              )}

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
