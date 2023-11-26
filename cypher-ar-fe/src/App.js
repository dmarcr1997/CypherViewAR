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
    AccountBalanceQuery
} from '@hashgraph/sdk';
import axios from 'axios';

function App() {
  const [addr, setAddr] = useState("");
  const [cachedAcct, setCachedAcct] = useState("");
  const [cachedBalance, setCachedBalance] = useState("");
  
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
      const info = await getInfo();
      drawRect(obj, ctx, info)  
    }
  };

  const getInfo = async () => {
    let acct;
    let balance;
    if(addr !== ""){
      if(cachedAcct !== ""){
        acct = cachedAcct;
      } else {
        const queryInfo = new AccountInfoQuery()
        .setAccountId(addr); //add account id here
        const accountInfo = await queryInfo.execute(client);
        acct = `0x${accountInfo.contractAccountId}`;
        setCachedAcct(acct);
      }
      if(cachedBalance !== ""){
        balance = cachedBalance;
      } else {
        const query = new AccountBalanceQuery()
        .setAccountId(addr);
        //Submit the query to a Hedera network
        const accountBalance = await query.execute(client);
        balance = accountBalance.hbars.toString();
        setCachedBalance(balance);
      }
    }

    return { acct, balance }
  }

  const setAddressData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getHederaAddress'); // Replace with your actual Node.js server URL
      const data = response.data;
      setAddr(data.address);
    } catch (error) {
      console.error('getAddress error:', error);
    }
  };


  useEffect(()=>{
    runCoco();
    setAddressData();
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