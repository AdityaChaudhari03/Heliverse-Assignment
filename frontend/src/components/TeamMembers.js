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
      .get("https://heliverse-assignment-1.onrender.com/api/team")
      .then((response) => {
        console.log(response);
        setTeamMembers(response?.data?.members);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
        setError("Error fetching team members");
        setLoading(false);
      });
  }, []);

  const handleDetailsClick = async (memberId) => {
    try {
      const response = await axios.get(`https://heliverse-assignment-1.onrender.com/api/team/${memberId}`);
      console.log("Member details:", response.data);
      // Handle displaying member details in your UI
    } catch (error) {
      console.error("Error fetching member details:", error);
      // Handle error
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white border border-gray-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Domain:</span> {member.domain}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Gender:</span> {member.gender}
                </p>
                <button onClick={() => handleDetailsClick(member._id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Details
            </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
