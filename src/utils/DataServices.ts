import { IUserData, IUserInfo } from "./Interfaces";

const url =
  "https://robinsonblog-h6fyg9ghabbbf4a2.westus-01.azurewebsites.net/";
// this variable will be used in our getBlog by user id fetch when we set them up

let userData: IUserData;

// Create account fetch
export const createAccount = async (user: IUserInfo) => {
  const res = await fetch(`${url}User/CreateUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  // if our response is not ok, we will run this block
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

//Login fetch
export const login = async (user: IUserInfo) => {
  const res = await fetch(`${url}User/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }

  const data = await res.json();
  return data;
};
//get Logged in data fetch
export const getLoggedInUserData = async (username: string) => {
  const res = await fetch(`${url}/User/GetUserInfoByUsername/${username}`);
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }
  userData = await res.json();
  //we are going to use this data inside of a variable we will make a separate function for implementation
  return userData;
};

//get the user's data

export const loggedInData = () => {
  return userData;
};

//we are checking if the token is in our storage (see if were logged in)

export const checkToken = () => {
  let result = false;

  if (typeof window !== null) {
    const LSData = localStorage.getItem("Token");
    if (LSData != null) result = true;
  }
  return result;
};
