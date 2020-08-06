import React from "react";

function Loader({ classes }) {
  return (
    <div className={classes.loader}>
      <i className="fa fa-cog fa-spin" />
    </div>
  );
}

export default Loader;
