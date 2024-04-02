import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/team")
      .then((response) => {
        setTeamMembers(response?.data?.members);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
        setError("Error fetching team members");
        setLoading(false);
      });
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, {});
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Error fetching user details");
    }
  };

  if (loading) {
    return <div>Loading team members...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <nav className="bg-gray-700 p-4 mb-8 text-xl">
        <ul className="flex justify-between">
          <li>
            <Link
              to="/"
              className="text-white hover:bg-blue-500 px-4 py-2 rounded-md"
            >
              User List
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>
        {selectedUser ? (
          <div>
            <h3>User Details:</h3>
            <pre>{JSON.stringify(selectedUser, null, 2)}</pre>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <li
                key={member._id}
                className="border border-gray-300 p-4 rounded-md"
                onClick={() => handleUserClick(member._id)}
              >
                <h2 className="text-blue-500 hover:underline">
                  {member._id}
                </h2>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;

