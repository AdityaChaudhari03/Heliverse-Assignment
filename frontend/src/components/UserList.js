import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUsers,
  setSearchTerm,
  setFilters,
  filterUsers,
} from "../redux/usersReducer";
import axios from "axios";
import { Link, Route, Routes } from "react-router-dom";
import TeamMembers from "./TeamMembers";

const NavigationMenu = () => {
  return (
    <nav className="bg-gray-700 p-4 text-xl">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link
            to="/"
            className="text-white hover:bg-blue-500 px-4 py-2 rounded-md"
          >
            User List
          </Link>
        </li>
        <li>
          <Link
            to="/team-members"
            className="text-white hover:bg-blue-500 px-4 py-2 rounded-md"
          >
            Team Members
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { filteredUsers, searchTerm, filters } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    axios
      .get(
        `https://heliverse-assignment-77x1.onrender.com/api/users?page=${currentPage}`
      )
      .then((response) => {
        // console.log(response.data);
        dispatch(setUsers(response.data));
        setTotalPages(response.headers["x-total-pages"]);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [currentPage, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(filterUsers());
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilters({ [name]: value }));
    dispatch(filterUsers());
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSelectUser = (userId) => {
    console.log(userId);
    axios
      .post(
        `https://heliverse-assignment-77x1.onrender.com/api/teams/${userId}`
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error adding user to team:", error);
      });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <NavigationMenu />
      <Routes>
        <Route exact path="/" component={UserList} />
        <Route path="/team-members" component={TeamMembers} />
      </Routes>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-full px-4 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-400 w-full md:w-auto"
        />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex flex-col mb-4 md:flex-row md:mb-0 space-y-2 md:space-y-0 md:space-x-2">
            <select
              name="domain"
              value={filters.domain}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">All Domains</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="IT">IT</option>
              <option value="Management">Management</option>
              <option value="UI Designing">UI Designing</option>
              <option value="Business Development">Business Development</option>
            </select>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="">All Availabilities</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold mb-2">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Domain:</span> {user.domain}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Gender:</span> {user.gender}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Availability:</span>{" "}
              {user.available.toString()}
            </p>
            <button
              onClick={() => handleSelectUser(user._id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Team
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
