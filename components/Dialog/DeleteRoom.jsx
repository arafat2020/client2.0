import { Button, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";

import DoneAllIcon from '@material-ui/icons/DoneAll';
import { UserContext } from "../../state/stateprovider";
import Spinner from "../Spinner";


const DeleteRoom = ({ room, id }) => {
  const [ld, setLd] = useState(false);
  const [roomname, setRoom] = useState();
  const ctx = useContext(UserContext);
  const dltRoom = () => {
    console.log(id);
      console.log(ctx.token.token);
      setLd(true)
    if (ctx.token.token) {
      axios
        .delete(`https://mern-chat-server2019.herokuapp.com/room`, {
          headers: {
            Authorization: `Bearer ${ctx.token.token}`,
          },

          data: {
            id: id,
          },
        })
        .then((dl) => {
          console.log(dl);
          if (dl.data.dlt) {
           
            ctx.setdialog({
              openDialog: false,
              title: "",
              content: null,
            });
            
            }
            setLd(false)
            ctx.setRoom('')
            ctx.socket.emit("msgUdate", dl);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="delete_room">
      {ld ? (
        <Spinner width={70} />
      ) : (
        <div>
          <Typography variant="caption">
            Are you sure that you wnat to delete room <strong>{room}</strong>?
            <br />
            To delete The room type the room name then click
          </Typography>
          <form>
            <TextField
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              id="outlined-basic"
              label="Room Nmae"
              variant="outlined"
            />
            <Button
              className="btn"
              onClick={dltRoom}
              disabled={room != roomname && true}
              variant="contained"
              color="secondary"
            >
              Delete Room
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeleteRoom;