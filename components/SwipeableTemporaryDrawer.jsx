import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import { UserContext } from "../state/stateprovider";
import ExitToAppTwoTone from "@material-ui/icons/ExitToAppTwoTone";
import MeetingRoomTwoToneIcon from "@material-ui/icons/MeetingRoomTwoTone";
import { IconButton, Typography } from "@material-ui/core";
import DeleteSweepTwoToneIcon from "@material-ui/icons/DeleteSweepTwoTone";
import axios from "axios";
import CreateRoom from "./Dialog/CreateRoom";
import DeleteRoom from "./Dialog/DeleteRoom";
const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const ctx = useContext(UserContext);
  const [room, setRoom] = useState([]);
  useEffect(() => {
    console.log(ctx);
    if (ctx.token || ctx.ioLoader == "room_ld") {
      axios
        .get(`https://mern-chat-server2019.herokuapp.com/room`, {
          headers: {
            Authorization: `Bearer ${ctx.token.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setRoom(res.data);
          if (ctx.ioLoader.type == 'room_ld') {
            ctx.setIoloader({
              type:''
            })
          }
        });
    }
  }, [ctx.token,ctx.ioLoader]);

  return (
    <div>
      <React.Fragment>
        <SwipeableDrawer
          anchor="left"
          open={ctx.dr}
          onClose={() => ctx.setDr(false)}
          onOpen={() => ctx.setDr(true)}
        >
          <div
            role="presentation"
            // onClick={() => ctx.setDr(false)}
            // onKeyDown={() => ctx.setDr(false)}
          >
            <List>
              <ListItem onClick={
                () => {
                  localStorage.removeItem("user_token");
                  localStorage.removeItem("user_data");
                  ctx.setGetload(true);
                  ctx.setDr(false)
                }
              } button>
                <ListItemIcon>
                  <ExitToAppTwoTone />
                </ListItemIcon>
                <ListItemText primary={`Logout(${ctx.user.name})`} />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem onClick={
                () => {
                  ctx.setdialog({
                  openDialog: true,
                  title: "Create Room",
                  content: <CreateRoom />,
                  })
                  ctx.setDr(false)
                }
              } button>
                <ListItemIcon>
                  <MeetingRoomTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary={"Create Room"} />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <Typography variant="caption">Your room</Typography>
              </ListItem>
            </List>
            <List>
              {room.map((room) => { 
               return( room.creator == ctx.user.name && (
                  <ListItem key={room._id} button>
                    <ListItemIcon>
                      <IconButton onClick={()=> ctx.setdialog({
                          openDialog: true,
                          title: "Delete Room",
                          content: <DeleteRoom room={room.roomName} id={room._id} />,
                         
                        })} color="secondary" >
                        <DeleteSweepTwoToneIcon />
                      </IconButton>
                    </ListItemIcon>
                   <ListItemText
                     onClick={() => {
                       ctx.setRoom(room.roomName)
                       ctx.setDr(false)
                     }}
                     primary={room.roomName} />
                  </ListItem>
                ))
              })}
            </List>
            <Divider />
            <List>
              <ListItem>
                <Typography variant="caption">Others room</Typography>
              </ListItem>
            </List>
            {room.map((room) => { 
               return( room.creator != ctx.user.name && (
                  <ListItem key={room._id} button>
                   <ListItemText
                     onClick={()=>{
                      ctx.setRoom(room.roomName)
                      ctx.setDr(false)
                    }}
                     primary={room.roomName} />
                  </ListItem>
                ))
              })}
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
// room.creator == ctx.user.name
