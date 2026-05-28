function Header({ username, openAddModal }) {
  return (
    <header className="header">
      <div>
        <h1>Good morning, {username}! 👋</h1>
        <p>Here's what's happening today.</p>
      </div>

      <div className="header-actions">
        <button onClick={openAddModal}>+ Add New</button>
      </div>
    </header>
  );
}

export default Header;
