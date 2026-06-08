function AssignmentsTab({
  assignments,
  completedAssignments,
  pendingAssignments,
  toggleAssignmentComplete,
  deleteAssignment,
  editAssignment,
  openAssignmentModal,
}) {
  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Assignments</h2>
          <p>Manage your assignments and deadlines.</p>
        </div>

        <button onClick={openAssignmentModal}>+ Add Assignment</button>
      </div>

      <h2>Assignments</h2>

      <div className="assignment-stats">
        <div className="assignment-stat-card">
          <span>Total</span>
          <strong>{assignments.length}</strong>
        </div>

        <div className="assignment-stat-card">
          <span>Completed</span>
          <strong>{completedAssignments}</strong>
        </div>

        <div className="assignment-stat-card">
          <span>Pending</span>
          <strong>{pendingAssignments}</strong>
        </div>
      </div>

      <div className="assignment-list">
        {[...assignments]
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .map((assignment) => (
            <div
              key={assignment.id}
              className={`assignment-card ${
                assignment.completed ? "completed-assignment" : ""
              }`}
            >
              <div>
                <strong>{assignment.title}</strong>

                <p>{assignment.course}</p>

                <small>Due: {assignment.dueDate}</small>

                {assignment.notes && (
                  <p className="assignment-notes">{assignment.notes}</p>
                )}
              </div>

              <div className="assignment-right">
                <button
                  className="assignment-edit-btn"
                  onClick={() => editAssignment(assignment)}
                >
                  Edit
                </button>

                <button
                  className="assignment-complete-btn"
                  onClick={() => toggleAssignmentComplete(assignment.id)}
                >
                  {assignment.completed ? "Completed" : "Mark Done"}
                </button>

                <button
                  className="assignment-delete-btn"
                  onClick={() => deleteAssignment(assignment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default AssignmentsTab;
