"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (user) return; // Prevent multiple API hits if user is already set
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });
        console.log(response);
        
  
        if (response.ok) {
          const { data } = await response.json();
          setUser(data);
        } else {
          console.error("Authentication failed");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    };
  
    checkAuthentication();
  }, [user]); // Dependency on user, will run only when 'user' changes
  
  console.log(user);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "DELETE",
      credentials: "include", // Include cookies to clear them on the server
    });

    if (response.ok) {
      router.push("/login");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name || "User"}!</p> {/* Display user name */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
