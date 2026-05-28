function DashboardCards({
  todayCourses,
  pendingAssignments,
  exams,
  upcomingExams,
  totalStudyHours,
}) {
  return (
    <div className="dashboard-cards">
      <div className="dashboard-card purple-card">
        <div className="card-icon">📅</div>

        <div>
          <span>Today's Classes</span>
          <strong>{todayCourses.length}</strong>
          <p>View schedule →</p>
        </div>
      </div>

      <div className="dashboard-card green-card">
        <div className="card-icon">✅</div>

        <div>
          <span>Assignments</span>
          <strong>{pendingAssignments}</strong>
          <p>{pendingAssignments} pending</p>
        </div>
      </div>

      <div className="dashboard-card orange-card">
        <div className="card-icon">🎓</div>

        <div>
          <span>Exams</span>
          <strong>{exams.length}</strong>
          <p>{upcomingExams.length} upcoming</p>
        </div>
      </div>

      <div className="dashboard-card blue-card">
        <div className="card-icon">🕒</div>

        <div>
          <span>Study Time</span>
          <strong>{totalStudyHours}h</strong>
          <p>This week</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
