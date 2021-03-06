import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../redux";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ConvoLoading from "../../UI/ConvoLoading";

import styles from "./myConversations.module.css";

const MyConversations = ({
  profile,
  setClick,
  setCurrentCnv,
  setReceiver,
  onlineUsers,
  setSender,
}) => {
  const dispatch = useDispatch();
  const { conversations, messages, load } = useSelector(
    (state) => state.messageReducer,
    shallowEqual
  );
  const myConversations =
    conversations &&
    [...conversations].filter(
      (cnv) =>
        cnv.recipients[0]._id === profile._id ||
        cnv.recipients[1]._id === profile._id
    );
  // console.log(myConversations);

  const onCnvClick = (receiver, sender, cnv) => {
    // console.log("sender1: ",sender);
    // console.log("receiver1: ",receiver);
    setCurrentCnv(cnv);
    setReceiver(receiver);
    setSender(sender);
    setClick(true);
  };

  useEffect(() => {
    dispatch(actionCreators.getConversations());
  }, [messages, conversations?.length, dispatch]);

  return (
    <div className={styles.mycnvs}>
      {profile !== [] && (
        <>
          <div className={styles.top}>
            <img src={profile.profilepic} alt={profile.username} />
            <h2>{profile.username}</h2>
          </div>
          <div className={styles.bottom}>
            {load && <ConvoLoading />}
            {myConversations && myConversations !== [] &&
              myConversations?.map((cnv) => {
                // console.log("sender: ",cnv.recipients[0]);
                // console.log("receiver: ",cnv.recipients[1]);
                return (
                  <div key={cnv._id} className={styles.cflex}>
                    <div
                      className={styles.cnv}
                      onClick={() =>onCnvClick(cnv.recipients[1],cnv.recipients[0],cnv)}
                    >
                      <img
                        // style={{ width: "4rem" }}
                        src={
                          cnv.recipients[0]._id === profile._id
                            ? cnv.recipients[1].profilepic
                              ? cnv.recipients[1].profilepic
                              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                            : cnv.recipients[0].profilepic
                            ? cnv.recipients[0].profilepic
                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                        }
                        alt=""
                      />
                      <div className={styles.flex}>
                        <h2>
                          {cnv.recipients[0]._id === profile._id
                            ? cnv.recipients[1].name
                              ? cnv.recipients[1].name
                              : "Deleted User"
                            : cnv.recipients[0].name
                            ? cnv.recipients[0].name
                            : "Deleted User"}
                          {onlineUsers.includes(
                            cnv.recipients[0]._id === profile._id
                              ? cnv.recipients[1]._id
                              : cnv.recipients[1]._id
                          ) ? (
                            <FiberManualRecordIcon style={{ color: "green" }} />
                          ) : (
                            <FiberManualRecordIcon style={{ color: "red" }} />
                          )}
                        </h2>
                        <p>
                          {cnv.recipients[0]._id === profile._id
                            ? "You"
                            : cnv.recipients[0].username}
                          : {cnv.text ? cnv.text : 'Send message to start a conversation'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyConversations;
