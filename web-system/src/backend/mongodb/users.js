import axios from "axios";

const api = "http://localhost:5000/api";
//const api = 'https://yarlprops.web.app/api'

export const addUserM = async (  firstName,  lastName,  displayName,  email,  role,  password) => {
  try {
    const mongoRes = await axios.post(`${api}/users`, {
      firstName,
      lastName,
      displayName,
      email,
      role,
      password,
    });
    console.log("added mongo: ", mongoRes);
  } catch (e) {
    console.log("Mongo error: ", e);
  }
};

export const logUser = async (email, password) => {
  try {
    const user = await axios.get(`${api}/login`, { email, password });
  } catch (e) {}
};
