import { Button, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import axios from "axios";
import { UserContext } from "../../state/stateprovider";
import Spinner from "../Spinner";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const DeleteMsg = ({ _id, msg }) => {
  const [edited, setEdited] = useState(msg);
  const [value, setValue] = useState(0);
  const [ld, setLd] = useState(false);
  const ctx = useContext(UserContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const edittor = () => {
    setLd(true);
    axios
      .put(
        `https://mern-chat-server2019.herokuapp.com/udt_msg`,
        {
          id: _id,
          msg: edited,
        },
        {
          headers: {
            Authorization: `Bearer ${ctx.token.token}`,
          },
        }
      )
      .then((ed) => {
        console.log(ed);
       
        ctx.setdialog({
          openDialog: false,
          title: "",
          content: null,
        });
        setLd(false);
        ctx.socket.emit("msgUdate", ed);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletMsg = () => {
    setLd(true);
    axios
      .delete(`https://mern-chat-server2019.herokuapp.com/dlt_msg`, {
        headers: {
          Authorization: `Bearer ${ctx.token.token}`,
        },

        data: {
          id: _id,
        },
      })
      .then((ed) => {
        console.log(ed);
       
        ctx.setdialog({
          openDialog: false,
          title: "",
          content: null,
        });
        setLd(false);
        ctx.socket.emit("msgUdate", ed);
      })
      .catch((err) => {
        console.log(err);
        setLd(false);
      });
  };
  return (
    <div className="dlt_msg">
      <Typography variant="subtitle1">Take Action on Massage</Typography>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Update" />
          <Tab label="Delete" />
        </Tabs>
      </Paper>
      <SwipeableViews index={value} onChangeIndex={handleChange}>
        <TabPanel className="dlt_msg_dis" value={value} index={0}>
          {ld ? (
            <Spinner width={75} />
          ) : (
            <div className="updt_msg">
              <TextField
                onChange={(e) => setEdited(e.target.value)}
                type="text"
                id="outlined-basic"
                label="Edit"
                variant="outlined"
                defaultValue={msg}
              />
              <Button className="btn" onClick={edittor} variant="contained" color="primary">
                <EditIcon />
              </Button>
            </div>
          )}
        </TabPanel>
        <TabPanel className="dlt_msg_dis" value={value} index={1}>
          {ld ? (
           <Spinner width={75} />
          ) : (
            <div>
              <Typography>Are you Sure?</Typography>
              <Button onClick={deletMsg} variant="contained" color="secondary">
                <DeleteOutlineIcon />
              </Button>
            </div>
          )}
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

export default DeleteMsg;