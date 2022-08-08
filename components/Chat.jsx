import { Button, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { useContext, useEffect, useState } from "react";
import Msg from "./Msg";
import axios from "axios";
import { UserContext } from "../state/stateprovider";
import Spinner from "./Spinner";
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import FlipMove from 'react-flip-move';
const Chat = () => {
  const [msg, setMsg] = useState();
  const [massage, setMassage] = useState();
  const [load, setLod] = useState({
    type: "",
  });
  const ctx = useContext(UserContext);
  useEffect(() => {
    if (ctx.room) {
      setLod({
        type:'initial_load'
      });
    }
  }, [ctx.room])
  useEffect(() => {
    var myDiv = document.getElementsByClassName("msg_dis");
    console.log(myDiv[0].scrollHeight);
    myDiv[0].scrollTo(0, myDiv[0].scrollHeight);
  }, [ctx.room, ctx.ioLoader,load]);
  useEffect(() => {
    
    if (ctx.room || ctx.ioLoader.type=='msg_ld') {
      axios
        .post(
          `https://mern-chat-server2019.herokuapp.com/get_msg`,
          {
            room: ctx.room,
          },
          {
            headers: {
              Authorization: `Bearer ${ctx.token.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setMsg(res.data)
          setLod({
            type: "",
          });
          if (ctx.ioLoader.type == 'msg_ld') {
            ctx.setIoloader({})
          }
        }).catch(err=>{

        });
    } else {
      setMsg();
      setLod(false);
    }
  }, [ctx.room, ctx.token, ctx.ioLoader]);
 
  const msgSender = (e) => {
    e.preventDefault();
    setLod(true);
    document.getElementById("msgForm").reset();
    if (ctx.room) {
      setLod({
        type: "msg_load",
      });
      axios
        .post(
          `https://mern-chat-server2019.herokuapp.com/msg`,
          {
            room: ctx.room,
            msg: massage,
          },
          {
            headers: {
              Authorization: `Bearer ${ctx.token.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setMassage(null)
          setLod({
            type: "",
          });
          ctx.socket.emit("msgUdate", res.data);
        }).catch(err=>{
          ctx.setRoom(null)
          ctx.setRed(<SpeakerNotesOffIcon/>)
          ctx.setOpen(true)
          ctx.setnotice('Room bot found')
        })
    }
  };
  
  
  return (
    <div className="chat">
      <div className="msg_dis">
        {load.type == "initial_load" ? (
          <Spinner />
        ) : (
          msg && (
              
              <FlipMove duration={700} easing="ease-in-out">
                {
                  msg.map((msg) => {
                return (
                    <div key={msg._id}>
                      <Msg
                        key={msg._id}
                        id={msg._id}
                        left={ctx.user.name != msg.sender && true}
                        msg={msg.msg}
                        date={msg.createdAt}
                        sender={msg.sender}
                  />
                    </div>
                 
                );
              })
                }
              </FlipMove>
            
          )
        )}
      </div>
      <form id="msgForm" action={msgSender} className={`msg_inp ${!ctx.room && "hidden"}`}>
        {load.type == "msg_load" ? (
          <Spinner width={60} />
        ) : (
          <>
            <TextField
              className="inp"
              type="text"
              id="outlined-basic "
              label="Chat"
              variant="outlined"
              onChange={(e) => setMassage(e.target.value)}
            />
              <Button
              
              disabled={!massage && true}
                onClick={e => {
                  msgSender(e)
                }}
              className="btn"
              variant="contained"
              color="primary"
            >
              <SendIcon />
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default Chat;
