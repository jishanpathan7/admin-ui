import axios from "axios";

import { processUsersResponse } from "../utilities/UsersUtility";

const API_URL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const getUsers = (setUsers) => {
  axios
    .get(API_URL)
    .then((response) => {
      setUsers(processUsersResponse(response.data));
    })
    .catch((error) => {
      getLocalUsers(setUsers);
    });
};

const getLocalUsers = (setUsers) => {
  axios
    .get("./members.json")
    .then((response) => {
      setUsers(processUsersResponse(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

export { getUsers };