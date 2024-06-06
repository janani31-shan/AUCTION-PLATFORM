import React from "react";

import styles from "./css/Spinner.module.css";

const Spinner = () => {
  return (
    <div class={styles["spinner"]}>
      <div class={styles["loader l1"]}></div>
      <div class={styles["loader l2"]}></div>
    </div>
  );
};

export default Spinner;
