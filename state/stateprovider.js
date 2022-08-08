import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { io } from "socket.io-client";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [dr, setDr] = useState(false);
  const [token, setToken] = useState();
  const [load, setLod] = useState(false);
  const [getLad, setGetload] = useState(true);
  const [room, setRoom] = useState();
  const [open, setOpen] = useState(false);
  const [notice, setnotice] = useState('');
  const [red,setRed] =useState('');
  const [ioLoader, setIoloader] = useState({
    type: "",
  });
  const [dialog, setdialog] = useState({
    openDialog: false,
    title: "",
    content: null,
  });
  const socket = io(`https://mern-chat-server2019.herokuapp.com`, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  useEffect(() => {
    try {
      socket.on("connect", (socket) => {
        console.log("io connected");
      });
    } catch (error) {
      console.log(error);
    }
  }, [socket]);
  useEffect(() => {
    socket.on("msgUdate", (snet) => {
     
      setIoloader({
        type:"msg_ld"
      })
    })
    socket.on("msgUdate", (sent) => {
    console.log(sent);
    setIoloader({
        type:"room_ld"
      })
  });
  }, [socket]);
  useEffect(() => {
    const verify = async () => {
      await setToken(localStorage.getItem("user_token") != 'undefined' && JSON.parse(localStorage.getItem("user_token")));
      await setUser(localStorage.getItem("user_data") != 'undefined' && JSON.parse(localStorage.getItem("user_data")));
      if (token?.token) {
        await axios
          .get(`https://mern-chat-server2019.herokuapp.com/verify`, {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          })
          .then((res) => {
            setGetload(false);
            setLod(false);
          })
          .catch((err) => {
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_data");
            setGetload(false);
            setLod(false);
          });
      } else {
        setTimeout(() => {
          setGetload(false);
          setLod(false);
        }, 1000);
      }
    };
    verify();

    // clear()
  }, [getLad, token?.token]);

  function clear() {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
  }
  // clear()
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        dr,
        setDr,
        token,
        setToken,
        load,
        setLod,
        room,
        setRoom,
        dialog,
        setdialog,
        getLad,
        setGetload,
        ioLoader,
        setIoloader,
        socket,
        open, setOpen,
        notice, setnotice,
        red,setRed
      }}
    >
      {load || getLad ? <Spinner vh /> : children}
    </UserContext.Provider>
  );
};
