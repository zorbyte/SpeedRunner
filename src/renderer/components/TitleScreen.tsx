import React, { FC } from "react"
import { A } from "hookrouter";

const TitleScreen: FC = () => {
  return (
    <>
      <div style={{ display: "block", position: "fixed", top: "40%", left: "5%", transform: "translate(-50 %, -50 %)" }}>
        <img width="700" src="/out/assets/GameName.png" />
        <br />
        <div style={{ display: "block", textAlign: "center", alignContent: "center" }}>
          <A href="/game"><button>Visit game</button></A>
        </div>
      </div>
    </>
  )
}

export default TitleScreen;