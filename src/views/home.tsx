import { useEffect, useRef, useState } from "react";
import Video from "../components/video";
import { initRtcPc, setDomByStream } from "../utils/getUserMedia";
import { Button, Input, Space, Modal, message } from "antd";
import {
  AudioFilled,
  VideoCameraFilled,
  AudioMutedOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { io } from "socket.io-client";

export interface Singaling {
  callerID: string | number;
  calleeID: string | number;
  singal: RTCSessionDescriptionInit;
}

const socket = io("http://localhost:9999");

function Home() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const [callerID, setCallerID] = useState<string | number>();
  const [calleeID, setCalleeID] = useState<string | number>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceive, setIsReceive] = useState(true);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    console.log("---------componentDidMount----------------");
    return () => {
      console.log("---------componentDidUnMount----------------");
    };
  }, []);
  var peerConnection: RTCPeerConnection;
 
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsReceive(true);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsReceive(false);
    setIsModalOpen(false);
  };

  const handleEvent = (pc: RTCPeerConnection) => {
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("candidate:", e.candidate);
        socket.emit("candidate", {
          callee: callerID,
          caller: callerID,
          candidate: e.candidate,
        });
      }
    };
    pc.ondatachannel = (e) => {
      e.channel.onopen = () => {
        console.log("建立datachanel连接:");
      };
      e.channel.onmessage = (data) => {
        console.log("收到消息：", data);
      };
      e.channel.onclose = () => {
        console.log("datachanel断开连接");
      };
    };
    pc.ontrack = (e) => {
      console.log("onTrack:", e);

      setDomByStream("remote", remoteVideo, e.streams[0]);
    };
  };
  function videoToAudio(pc: RTCPeerConnection) {
    const senders = pc.getSenders();
    console.log("senders:", senders);
    console.log(pc);
    const send = senders.find((s) => s.track!.kind === "video"); //找到视频发送方信息
    send && (send.track!.enabled = send.track!.enabled); //控制视频显示与否 即仅音频模式
  }

  function establish() {
    socket.on("wait-offer", async (msg: Singaling) => {
      if (msg.calleeID === callerID) {
        console.log("收到offer信令", msg.calleeID, callerID);
        showModal();
        if (isReceive) {
          const [pc, localStream] = await initRtcPc();
          handleEvent(pc);
          setDomByStream("local", localVideo, localStream);
          await pc.setRemoteDescription(msg.singal);
          const answerSingal = await pc.createAnswer();
          await pc.setLocalDescription(answerSingal);

          socket.on("wait-candidate", (data) => {
            console.log("----交换候选-----");
            if (data.callee === callerID) {
              console.log("交换候选");
              pc.addIceCandidate(data.candidate);
            }
          });
          console.log("remotePc:", pc);
          socket.emit("answer", {
            calleeID: msg.calleeID,
            callerID: msg.callerID,
            singal: answerSingal,
          });
          // const channel = await pc.createDataChannel("chat", {
          //   protocol: "json",
          //   ordered: true,
          // });
          peerConnection = pc;
          console.log("PeerConnection:", pc);
        } else {
          message.info("已拒绝请求");
        }
      }
    });
    message.success("设置成功");
  }

  const initLocalRTC = async () => {
    const [pc, localStream] = await initRtcPc({ video: video, audio: audio });
    setDomByStream("local", localVideo, localStream);
    handleEvent(pc);
    const offer = await pc.createOffer();
    peerConnection = pc;
    console.log("offer:", offer);
    await pc.setLocalDescription(offer);
    socket.emit("offer", { calleeID, callerID, singal: offer });
    socket.on("wait-candidate", async (data) => {
      console.log("-----交换候选-----");
      if (data.caller === calleeID) {
        console.log("交换候选");
        await pc.addIceCandidate(data.candidate);
      }
    });
    await socket.on("wait-answer", async (data: Singaling) => {
      if (data.callerID === callerID) {
        console.log("收到answer信令");
        await pc.setRemoteDescription(data.singal);
        console.log("pc:", pc);
        const channel = await pc.createDataChannel("chat", {
          protocol: "json",
          ordered: true,
        });
        if (channel.readyState === "open") {
          channel.send("hello");
        }
      }
    });
    console.log("PeerConnection:", pc);
  };

  return (
    <div>
      <Space direction="vertical" size="large">
        {/* <Button onClick={() => showModal()}>open</Button>  */}
        <Space align="center">
          <Input
            placeholder="设置你的id"
            value={callerID}
            onChange={(e) => {
              setCallerID(e.target.value);
            }}
          ></Input>
          <Button
            type="primary"
            onClick={() => {
              establish();
            }}
          >
            确定
          </Button>
        </Space>
        <Space align="center">
          <Input
            placeholder="输入邀请人id"
            value={calleeID}
            onChange={(e) => setCalleeID(e.target.value)}
          ></Input>
          <Button
            type="primary"
            onClick={() => {
              initLocalRTC();
            }}
          >
            邀请
          </Button>
        </Space>
        <Space>
          <Button shape="round" onClick={() => setAudio(!audio)}>
            {audio ? <AudioFilled /> : <AudioMutedOutlined />}
          </Button>
          <Button
            shape="round"
            onClick={() => {
              setVideo(!video);
              videoToAudio(peerConnection);
            }}
          >
            {video ? <VideoCameraFilled /> : <VideoCameraAddOutlined />}
          </Button>
        </Space>
        <Space size="middle">
          <Video
            id="local"
            width={400}
            height={150}
            ref={localVideo}
            reverse={true}
            bgColor="black"
          ></Video>
          <Video
            id="remote"
            width={400}
            height={150}
            ref={remoteVideo}
            reverse={true}
            bgColor="black"
          ></Video>
        </Space>
      </Space>
      <Modal
        title="新通话"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="接听"
        cancelText="拒绝"
      >
        <p>来自{}的通话邀请</p>
      </Modal>
    </div>
  );
}

export default Home;
