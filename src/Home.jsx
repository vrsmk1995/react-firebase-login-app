import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [history,setHistory]=useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/"); // redirect to login if no user found
      return;
    }

    setUser(JSON.parse(storedUser));
    const storedHistory = localStorage.getItem("loginHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, [navigate]);

  const handleLogout = () => {
    const logoutTime = new Date().toLocaleString();

    // Update logout time before removing user
    if (user) {
      const storedHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
      // const updatedUser = { ...user, logoutTime };

      // Update the corresponding entry in login history
      const updatedHistory = storedHistory.map((session) =>
        session.sessionId === user.sessionId ? { ...session, logoutTime } : session
      );
      localStorage.setItem("lastSession", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      console.log("Updated History:", updatedHistory);
      const updatedUser = { ...user, logoutTime };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    // Remove active user
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  if (!user) return null; 

  return (
    <div className="home-container">
      <h1 className="home-title">Home Page</h1>

      <p className="home-welcome">
        Welcome <span>{user.email}</span> 👋
      </p>

      <h3 className="home-subtitle">
        Current Login Time: <span>{user.loginTime}</span>
      </h3>

      <button className="home-logout-btn" onClick={handleLogout}>
        Log Out
      </button>

      {/* Login History Section */}
      <div className="home-history">
        <h2 className="home-history-title">Login History</h2>

        {history.length === 0 ? (
          <p>No login history found.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session, index) => (
                <tr key={session.sessionId}>
                  <td>{index + 1}</td>
                  <td>{session.email}</td>
                  <td>{session.loginTime}</td>
                  <td>{session.logoutTime || "Still Logged In / Closed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button className="home-logout-btn" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
