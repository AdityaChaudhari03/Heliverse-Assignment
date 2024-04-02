import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import UserList from "./components/UserList";
import TeamMembers from "./components/TeamMembers";
import UserDetails from "./components/UserDetails";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto p-4">
          <Routes>
            <Route exact path="/" element={<UserList />} />
            <Route exact path="/team-members" element={<TeamMembers />} />
            <Route exact path="/user-details" element={<UserDetails />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
