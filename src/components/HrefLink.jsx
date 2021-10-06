import * as React from "react";

const HrefLink = ({ href, children }) => {
  return (
    <>
      {" "}
      <a style={{ color: "#000000" }} target="_blank" rel="noreferrer" href={href}>
        <strong>{children}</strong>
      </a>{" "}
    </>
  );
};

export default HrefLink;
