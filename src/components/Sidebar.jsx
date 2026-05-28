import {
  CalendarDays,
  BookOpen,
  StickyNote,
  Star,
  ClipboardList,
  GraduationCap,
} from "lucide-react";

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <h2>StudyPlan</h2>

      <nav>
        <button
          className={activeTab === "schedule" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("schedule")}
        >
          <CalendarDays size={18} />
          <span>Schedule</span>
        </button>

        <button
          className={activeTab === "courses" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen size={18} />
          <span>Courses</span>
        </button>

        <button
          className={activeTab === "notes" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("notes")}
        >
          <StickyNote size={18} />
          <span>Notes</span>
        </button>

        <button
          className={activeTab === "favorites" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("favorites")}
        >
          <Star size={18} />
          <span>Favorites</span>
        </button>

        <button
          className={
            activeTab === "assignments" ? "nav-link active" : "nav-link"
          }
          onClick={() => setActiveTab("assignments")}
        >
          <ClipboardList size={18} />
          <span>Assignments</span>
        </button>

        <button
          className={activeTab === "exams" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("exams")}
        >
          <GraduationCap size={18} />
          <span>Exams</span>
        </button>

        <button
          className={activeTab === "calendar" ? "nav-link active" : "nav-link"}
          onClick={() => setActiveTab("calendar")}
        >
          <CalendarDays size={18} />
          <span>Calendar</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
