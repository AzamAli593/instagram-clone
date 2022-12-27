import React from "react";

function Loader() {
  return (
    <div style={{ display: "flex" }}>
      <img
        src="/LoaderIcon.png"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "contain",
          margin: "20vmax auto"
        }}
      />
    </div>
  );
}

export default Loader;
