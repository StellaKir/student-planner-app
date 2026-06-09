import { Moon, Sun } from "lucide-react";

function Header({ username, openAddModal, activeTab, darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div>
        <h1>Good morning, {username}! 👋</h1>
        <p>Here's what's happening today.</p>
      </div>

      <div className="header-actions">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {activeTab === "schedule" && (
          <button onClick={openAddModal}>+ Add Class to Schedule</button>
        )}
      </div>
    </header>
  );
}

export default Header;
