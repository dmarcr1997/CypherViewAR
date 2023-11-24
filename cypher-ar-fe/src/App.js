// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import {
    Client,
    AccountId,
    PrivateKey,
    AccountInfoQuery,
} from '@hashgraph/sdk';

function App() {
  if (!process.env.REACT_APP_ACCOUNT_ID ||
      !process.env.REACT_APP_ACCOUNT_PRIVATE_KEY) {
      throw new Error('Please set required keys in .env file.');
  }
  const accountId = AccountId.fromString(process.env.REACT_APP_ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(process.env.REACT_APP_ACCOUNT_PRIVATE_KEY);
  const client = Client.forTestnet().setOperator(accountId, accountKey);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    //load cocossd model
    const net = await cocossd.load();
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      drawRect(obj, ctx)  
    }
  };

  const getInfo = async () => {
    const query = new AccountInfoQuery()
    .setAccountId(""); //add account id here
    const accountInfo = await query.execute(client);
    console.log(accountInfo);
  }

  useEffect(()=>{
    runCoco();
    getInfo();
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;