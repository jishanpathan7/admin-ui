import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import UsersList from "./components/UsersList/UsersList";
import { getUsers } from "./services/UserService";
import config from "./constants";
import { searchInUsers } from "./utilities/SearchUtility";
import { getRecordIndex } from "./utilities/PagingUtility";
import Pagination from "./components/Pagination/Pagination";

function App() {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const selectAllRef = useRef(null);

  useEffect(() => {
    getUsers(setUsers);
  }, []);

  const searchUsers = (e) => {
    setPage(1);
    setUsers(searchInUsers(users, e.target.value));
  };
  const deleteUser = (id) => {
    let tempUsers = users.filter((user) => user.id !== id);
    setUsers(tempUsers);
    setUpdate((prev) => !prev);
  };
  const editUser = (id) => {
    let tempUsers = users;
    let index = tempUsers.findIndex((user) => user.id === id);
    tempUsers[index].edit = true;
    setUsers(tempUsers);
    setUpdate((prev) => !prev);
  };

  const saveUser = (id, nameRef, emailRef, roleRef) => {
    let tempUsers = users;
    let index = tempUsers.findIndex((user) => user.id === id);
    tempUsers[index].name = nameRef.current.value;
    tempUsers[index].email = emailRef.current.value;
    tempUsers[index].role = roleRef.current.value;
    tempUsers[index].edit = false;
    setUsers(tempUsers);
    setUpdate((prev) => !prev);
  };

  const selectAll = (e) => {
    const listedUsers = users
      .filter((user) => user.show)
      .slice(index, index + config.PAGE_SIZE)
      .map((user) => user.id);
    let tempUsers = users.map((user) => {
      if (listedUsers.includes(user.id)) {
        user.selected = e.target.checked;
        return user;
      }
      return user;
    });
    setUsers(tempUsers);
    setUpdate((prev) => !prev);
  };

  const selectOne = (id) => {
    let tempUsers = users;
    let index = tempUsers.findIndex((user) => user.id === id);
    tempUsers[index].selected = !tempUsers[index].selected;
    setUsers(tempUsers);
    setUpdate((prev) => !prev);
  };
  const deleteSelected = () => {
    if (window.confirm("Selected users will be deleted ")) {
      setUsers((prev) => prev.filter((user) => !user.selected));
      selectAllRef.current.checked = false;
    }
  };
  const index = getRecordIndex(page);
  return (
    <div className="App">
      <input
        className="search"
        type={"text"}
        placeholder="Seach by name,email or role"
        onChange={searchUsers}
      />
      <UsersList
        page={page}
        setPage={setPage}
        selectAll={selectAll}
        selectAllRef={selectAllRef}
        selectOne={selectOne}
        saveUser={saveUser}
        editUser={editUser}
        deleteUser={deleteUser}
        users={users
          .filter((user) => user.show)
          .slice(index, index + config.PAGE_SIZE)}
      />
      <Pagination
        usersLength={users.filter((user) => user.show).length}
        page={page}
        setPage={setPage}
        deleteSelected={deleteSelected}
      ></Pagination>
    </div>
  );
}

export default App;
