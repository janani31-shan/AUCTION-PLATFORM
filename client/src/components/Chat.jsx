// YourComponent.js
import React from 'react';
import styles from "./css/CopyButton.module.css";

function Chat() {

  const handleRedirect = () => {
    // Redirect to the specified URL when the button is clicked
    window.open('https://auction-chat.netlify.app/', '_blank');
  };

  return (
    <div>
      <button className={styles["cpy-btn"]} onClick={handleRedirect}>Chat</button>
    </div>
  );
}

export default Chat;
