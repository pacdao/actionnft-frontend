import * as React from "react";

const HrefLink = ({ isBold = true, href, children }) => {
  return (
    <>
      {" "}
      <a style={{ color: "#000000" }} target="_blank" rel="noreferrer" href={href}>
        {isBold ? <strong>{children}</strong> : children}
      </a>{" "}
    </>
  );
};

export default HrefLink;
