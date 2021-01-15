import { Fragment, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { setItem, getItem } from "@wit03/async-localstorage";

// eslint-disable-next-line no-unused-vars
import style from "./style.css";

import firebase from "../../components/firebase";
import "firebase/firestore";

const Home = () => {
  let db = firebase.firestore();
  const [checked, setChecked] = useState(false);
  const [userId, setUserId] = useState("userid");
  useEffect(() => {
    if (localStorage.getItem("userID") === null) {
      console.log("localstorage not exist:");
      setItem("userID", Math.floor(Math.random() * 900000) + 100000)
        .then(() => {
          return getItem("userID");
        })
        .then((value) => {
          setUserId(value);
          db.collection("user")
            .doc(value)
            .set({ check: false })
            .then(() => {
              console.log("Document successfully written!");
            });
        });
    } else {
      console.log("localstorage exist: ");
      getItem("userID").then((value) => {
        console.log(value);
        setUserId(localStorage.getItem("userID"));
        db.collection("user")
          .doc(value)
          .set({ check: false })
          .then(() => {
            console.log("Document successfully written!");
          });
      });
    }
  }, []);
  const handleChange = (e) => {
    db.collection("user").doc(userId).set({ check: e.target.checked });
    setChecked(e.target.checked);
  };
  return (
    <Fragment>
      <h1>Tap to mute</h1>
      <input
        type="checkbox"
        id="switch"
        onChange={handleChange}
        checked={checked}
      />
      <label for="switch">Toggle</label>
      <h3 class={style.id}>Your ID: {userId}</h3>
    </Fragment>
  );
};

export default Home;
