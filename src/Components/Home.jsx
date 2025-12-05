import React, { useEffect, useState } from "react";
import "../Css/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const storedHistory = localStorage.getItem("loginHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, [navigate]);

  const handleLogout = () => {
    const logoutTime = new Date().toLocaleString();

    if (user) {
      const storedHistory =
        JSON.parse(localStorage.getItem("loginHistory")) || [];

      const updatedHistory = storedHistory.map((session) => {
        const sameSessionById =
          session.sessionId && session.sessionId === user.sessionId;
        const oldSessionSameUserNoId =
          !session.sessionId &&
          (session.uid === user.uid ||
            session.phone === user.phone ||
            session.email === user.email);

        if (
          (sameSessionById || oldSessionSameUserNoId) &&
          !session.logoutTime
        ) {
          return { ...session, logoutTime };
        }

        return session;
      });

      localStorage.setItem("loginHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      const updatedUser = { ...user, logoutTime };
      localStorage.setItem("lastSession", JSON.stringify(updatedUser));
    }

    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return null;

  let displayId = "Guest";

  if (user.email) {
    displayId = user.email;
  } else if (user.phone) {
    // remove +91
    displayId = user.phone.replace("+91", "");
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Home Page</h1>

      <p className="home-welcome">
        Welcome <span>{displayId}</span> 👋
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
                <th>Email / Phone</th>
                <th>Login Time</th>
                <th>Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session, index) => {
                const id =
                  session.email ||
                  session.phone?.replace("+91", "") ||
                  "Unknown";

                return (
                  <tr key={session.sessionId}>
                    <td>{index + 1}</td>
                    <td>{id}</td>
                    <td>{session.loginTime}</td>
                    <td>{session.logoutTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
