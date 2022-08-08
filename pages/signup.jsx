import React, { useContext, useState } from "react";
import { UserContext } from "../state/stateprovider";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import axios from "axios";
import { Button, TextField, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import PanToolIcon from "@material-ui/icons/PanTool";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Link from "next/link";

const Signup = () => {
  const ctx = useContext(UserContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setname] = useState();
  const [consfp, setConfp] = useState();
  const router = useRouter();
  if (ctx.user) {
    router.push("/");
  }
  const login = () => {
    ctx.setLod(true);
    axios
      .post(`http://localhost:5000/user`, {
        name,
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        ctx.setLod(false);
        ctx.setRed(<DoneAllIcon />);
        ctx.setOpen(true);
        ctx.setnotice(`Succesfully sign up,now login`);
        router.push("/login");
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
    <div className="container flex login signu">
      <form className="flex" action="">
        <InsertCommentIcon className="msg_icon" />
        <hr />
        <TextField
          onChange={(e) => setname(e.target.value)}
          type="text"
          id="outlined-basic"
          label="User Name"
          variant="outlined"
        />
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
        <TextField
          onChange={(e) => setConfp(e.target.value)}
          type="password"
          id="outlined-basic"
          label="Conferm Password"
          variant="outlined"
        />
        {consfp != password && (
          <Typography variant="caption">
            <strong>Password should be matched</strong>
          </Typography>
        )}
        <hr />
        <Button
          disabled={password != consfp || (!password && true)}
          onClick={login}
          variant="contained"
          color="primary"
        >
          Login
        </Button>
        <Typography variant="caption">
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
      </form>
    </div>
  );
};

export default Signup;
