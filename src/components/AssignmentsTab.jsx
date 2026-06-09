import { useState } from "react";

function AssignmentsTab({
  assignments,
  completedAssignments,
  pendingAssignments,
  toggleAssignmentComplete,
  deleteAssignment,
  editAssignment,
  openAssignmentModal,
}) {
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  return (
    <section className="tab-section">
      <div className="tab-header">
        <div>
          <h2>Assignments</h2>
          <p>Manage your assignments and deadlines.</p>
        </div>

        <button onClick={openAssignmentModal}>+ Add Assignment</button>
      </div>

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

      {assignments.length === 0 ? (
        <p className="empty-day">No assignments added yet.</p>
      ) : (
        <div className="assignment-grid">
          {[...assignments]
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((assignment) => (
              <div
                key={assignment.id}
                className={`assignment-box ${
                  assignment.completed ? "completed-assignment" : ""
                }`}
              >
                <div className="assignment-box-top">
                  <div className="assignment-icon">📌</div>

                  <span
                    className={
                      assignment.completed
                        ? "assignment-badge done"
                        : "assignment-badge pending"
                    }
                  >
                    {assignment.completed ? "Done" : "Pending"}
                  </span>
                </div>

                <h3>{assignment.title}</h3>

                <p>{assignment.course}</p>

                <small>Due: {assignment.dueDate}</small>

                {assignment.notes && (
                  <p className="assignment-notes">{assignment.notes}</p>
                )}

                <div className="assignment-actions">
                  <button
                    className="assignment-complete-btn"
                    onClick={() => toggleAssignmentComplete(assignment.id)}
                  >
                    {assignment.completed ? "Undo" : "Done"}
                  </button>

                  <button
                    className="assignment-edit-btn"
                    onClick={() => editAssignment(assignment)}
                  >
                    Edit
                  </button>

                  <button
                    className="assignment-delete-btn"
                    onClick={() => setAssignmentToDelete(assignment)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {assignmentToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Delete Assignment</h2>
            <p>Are you sure you want to delete this assignment?</p>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setAssignmentToDelete(null)}
              >
                No
              </button>

              <button
                className="confirm-btn"
                onClick={() => {
                  deleteAssignment(assignmentToDelete.id);
                  setAssignmentToDelete(null);
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

export default AssignmentsTab;
