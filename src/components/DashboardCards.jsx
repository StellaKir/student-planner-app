function DashboardCards({
  todayCourses,
  pendingAssignments,
  exams,
  upcomingExams,
  totalStudyHours,
}) {
  const cards = [
    {
      title: "Today's Classes",
      value: todayCourses.length,
      text: "View schedule →",
      icon: "📅",
      color: "purple",
    },
    {
      title: "Assignments",
      value: pendingAssignments,
      text: `${pendingAssignments} pending`,
      icon: "✅",
      color: "green",
    },
    {
      title: "Exams",
      value: exams.length,
      text: `${upcomingExams.length} upcoming`,
      icon: "🎓",
      color: "orange",
    },
    {
      title: "Study Time",
      value: `${totalStudyHours}h`,
      text: "This week",
      icon: "🕒",
      color: "blue",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div className={`dashboard-card ${card.color}-card`} key={card.title}>
          <div className="card-icon">{card.icon}</div>

          <div className="card-content">
            <span>{card.title}</span>
            <strong>{card.value}</strong>
            <p>{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
