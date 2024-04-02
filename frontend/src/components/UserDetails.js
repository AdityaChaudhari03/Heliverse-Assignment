import React from "react";

const UserDetails = ({ user }) => {
  return (
    <div>
      <h3>User Details:</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserDetails;
