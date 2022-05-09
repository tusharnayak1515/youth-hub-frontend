import React, { Fragment, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../redux";
import MsgLoading from "../../UI/MsgLoading";

import styles from "./currentChat.module.css";

const CurrentChat = ({ profile, receiver, click }) => {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector(
    (state) => state.messageReducer,
    shallowEqual
  );
  const [newMsg, setNewMsg] = useState("");

  const onMsgChange = (e) => {
    e.preventDefault();
    setNewMsg(e.target.value);
  };

  const onSendMsg = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newMsg !== "") {
        dispatch(
          actionCreators.sendMessage({ text: newMsg, receiver: receiver._id })
        );
        setNewMsg("");
      }
    }
  };

  useEffect(() => {
    // console.log("run");
    if (receiver) {
      dispatch(actionCreators.getMessages(receiver._id));
    }
  }, [messages.length, dispatch, receiver]);

  if (isLoading) {
    return <MsgLoading />;
  }

  return (
    <div className={styles.currentChat}>
      {click && receiver && messages.length !== 0 && (
        <div className={styles.receiver}>
          <img src={receiver.profilepic} alt={receiver.username} />
          <h2>{receiver.name}</h2>
        </div>
      )}
      <div className={styles.messageArea}>
        {click && messages.length !== 0 && receiver ? (
          messages.map((chat) => {
            return (
              <Fragment key={chat._id}>
                {chat.sender._id === profile._id && (
                  <div className={styles.me}>
                    {chat.text ? (
                      <h3>{chat.text}</h3>
                    ) : (
                      chat.images !== [] && (
                        <img src={chat.images[0]} alt="User Media" />
                      )
                    )}
                    <img
                      src={chat.sender.profilepic}
                      alt={chat.sender.username}
                      className={styles.mypic}
                    />
                  </div>
                )}

                {chat.sender._id === receiver._id && (
                  <div className={styles.other}>
                    <img
                      src={chat.sender.profilepic}
                      alt={chat.sender.username}
                      className={styles.userpic}
                    />
                    <h3>{chat.text}</h3>
                  </div>
                )}
              </Fragment>
            );
          })
        ) : (
          <div className={styles.default}>
            <h1>Your messages will be displayed here!</h1>
          </div>
        )}
      </div>
      {click && receiver && messages.length !== 0 && (
        <div className={styles.messageBox}>
          <input
            type="text"
            name="text"
            placeholder="Enter your message"
            value={newMsg}
            onChange={onMsgChange}
            onKeyDown={onSendMsg}
          />
        </div>
      )}
    </div>
  );
};

export default CurrentChat;