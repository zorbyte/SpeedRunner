import React, { FC } from "react"
import { Link } from "react-router-dom";
import { ASSETS_DIR } from "../constants";

const TitleScreen: FC = () => {
  return (
    <>
      <div style={{ display: "block", position: "fixed", top: "40%", left: "5%", transform: "translate(-50 %, -50 %)" }}>
        <img width="700" src={`${ASSETS_DIR}GameName.png`} />
        <br />
        <div style={{ display: "block", textAlign: "center", alignContent: "center" }}>
          <Link to="/game"><button>Visit game</button></Link>
        </div>
      </div>
    </>
  )
}

export default TitleScreen;