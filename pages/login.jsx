import React,{ useContext, useState } from "react";
import { UserContext } from "../state/stateprovider";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import axios from 'axios'
import { Button, TextField, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import PanToolIcon from '@material-ui/icons/PanTool';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Link from 'next/link'


const Login = () => {
  const ctx = useContext(UserContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const router = useRouter();
  if (ctx.user) {
    router.push("/");
  }
  const login = () => {
    ctx.setLod(true);
    axios
      .post(`https://mern-chat-server2019.herokuapp.com/login`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("user_token", JSON.stringify(res.data.token));
        localStorage.setItem("user_data", JSON.stringify(res.data.data));
        ctx.setToken(res.data.token);
        ctx.setUser(res.data.data);
        ctx.setLod(false);
        ctx.setRed(<DoneAllIcon />);
        ctx.setOpen(true);
        ctx.setnotice(`Succesfully login as ${res.data.data.name}`);
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        ctx.setRed(<PanToolIcon />);
        ctx.setOpen(true);
        ctx.setnotice(err.code);
        ctx.setLod(false);
      });
  };

  return (
    <div className="container flex login">
      <form className="flex" action="">
        <InsertCommentIcon className="msg_icon" />
        <hr />
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          id="outlined-basic"
          label="E-mail"
          variant="outlined"
        />
        <hr />
        <TextField
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="outlined-basic"
          label="Password"
          variant="outlined"
        />
        <hr />
        <Button onClick={login} variant="contained" color="primary">
          Login
        </Button>
        <Typography variant="caption">
          New to chat server?<Link href="/signup">Sign up</Link>
        </Typography>
      </form>
    </div>
  );
};

export default Login;
