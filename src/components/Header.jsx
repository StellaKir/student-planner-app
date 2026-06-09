function Header({ username, openAddModal, activeTab }) {
  return (
    <header className="header">
      <div>
        <h1>Good morning, {username}! 👋</h1>
        <p>Here's what's happening today.</p>
      </div>

      <div className="header-actions">
        {activeTab === "schedule" && (
          <button onClick={openAddModal}>+ Add Class to Schedule</button>
        )}
      </div>
    </header>
  );
}

export default Header;
