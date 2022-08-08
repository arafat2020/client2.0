import { Button, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../../state/stateprovider";
import Spinner from "../Spinner";


const CreateRoom = () => {
  const [ld, setLd] = useState(false);
  const [roomname, setRoom] = useState();
  const ctx = useContext(UserContext);
  const roomSender = (e) => {
    e.preventDefault();
    document.getElementById("roomForm").reset()
      if (ctx.token) {
        setLd(true)
      axios
        .post(
          `https://mern-chat-server2019.herokuapp.com/room`,
          {
            roomName: roomname,
            creator: ctx.user.name,
          },
          {
            headers: {
              Authorization: `Bearer ${ctx.token.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          ctx.setdialog({
            openDialog: false,
            title: "",
            content: null,
          });
            setLd(false)
            ctx.socket.emit("msgUdate", res.data);
         
        })
        .catch((err) => {
          console.log(err);
         
        });
    }
  };
  return (
    <div className="create_room">
      {ld ? (
        <Spinner width={80} />
      ) : (
        <div>
          <Typography variant="caption">
            Create Tour own room
          </Typography>
          <form id="roomForm" className="roomForm">
            <TextField
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              id="outlined-basic"
              label="Room Nmae"
              variant="outlined"
            />
            <Button
              className="btn"
              onClick={roomSender}
              disabled={!roomname && true}
              variant="contained"
              color="primary"
            >
              create Room
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;