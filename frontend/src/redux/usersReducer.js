import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], 
  filteredUsers: [], 
  searchTerm: "",
  filters: {
    domain: "",
    gender: "",
    availability: "",
  },
  selectedUsers: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
      state.filteredUsers = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    filterUsers(state) {
      state.filteredUsers = state.users.filter((user) => {
        const searchTermMatch =
          user.last_name
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase()) ||
          user.first_name
            .toLowerCase()
            .includes(state.searchTerm.toLowerCase());
        const domainMatch = state.filters.domain
          ? user.domain === state.filters.domain
          : true;
        const genderMatch = state.filters.gender
          ? user.gender === state.filters.gender
          : true;
        const availabilityMatch = state.filters.availability
          ? user.available.toString() === state.filters.availability
          : true;
        return (
          searchTermMatch && domainMatch && genderMatch && availabilityMatch
        );
      });
    },
    selectUser(state, action) {
      const userId = action.payload;
      const user = state.users.find((user) => user.id === userId);
      state.selectedUsers.push(user);
    },
  },
});

export const { setUsers, setSearchTerm, setFilters, filterUsers, selectUser } =
  usersSlice.actions;

export default usersSlice.reducer;
