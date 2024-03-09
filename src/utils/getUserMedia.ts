/**
 *
 * @param mediaConstraints
 * @returns Promise<MediaStream>
 */

import { ForwardedRef, MutableRefObject } from "react";

//媒体约束有两种(媒体流约束、媒体轨道约束)：MediaStreamConstraints、MediaTrackConstraints
export function getLocalMedia(mediaConstraints: MediaStreamConstraints): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(mediaConstraints);
}

export interface IDevice {
  id: number | string;
  label: string;
  kind: string | number;
  groupId: string | number;
}

interface ILocalDevice {
  videoIn: IDevice[];
  audioIn: IDevice[];
  audioOut: IDevice[];
}

//获取本体媒体设备
export const getLocalDevice = async (
  constraint: MediaStreamConstraints,
  errCallback: () => {}
): Promise<ILocalDevice> => {
  const localDevice: ILocalDevice = {
    videoIn: [], //摄像头
    audioIn: [], //麦克风
    audioOut: [], //听筒
  };

  const mediaStream = await getLocalMedia(constraint);
  if (!mediaStream) {
    errCallback();
  } else {
    destoryMediaTrack(mediaStream);
    //获取媒体设备，必须先使用getUserMedia获取用户媒体才能拿到所有媒体设备
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log("devices:", devices);
    devices.forEach((device) => {
      let obj: IDevice = {
        id: device.deviceId,
        label: device.label,
        kind: device.kind,
        groupId: device.groupId,
      };

      if (device.kind === "audioinput") localDevice.audioIn.push(obj);
      if (device.kind === "audiooutput") localDevice.audioOut.push(obj);
      if (device.kind === "videoinput") localDevice.videoIn.push(obj);
    });
  }
  return localDevice;
};

const destoryMediaTrack = (mediaStream: MediaStream) => {
  if (mediaStream.getTracks()) {
    mediaStream
      .getTracks() /*获取媒体流中的所有轨道*/
      .forEach((track) => {
        console.log("track:", track);
        track.stop();
      });
  }
};

//获取本地媒体流添加到PeerConnection
/* Get local media stream added to PeerConnection */

export const initRtcPc = async (
  constraint: MediaStreamConstraints = { video: true, audio: true },
  onSuccessCallback?: (offer: RTCSessionDescriptionInit) => void
): Promise<[RTCPeerConnection, MediaStream]> => {
  const peerConnetion = new RTCPeerConnection();
  const localMediaStream = await getLocalMedia(constraint);

  for (let track of localMediaStream.getTracks()) {
    peerConnetion.addTrack(track, localMediaStream);
  }

  //TODO: 本地渲染 video stream
  // const offer = await peerConnetion.createOffer();
  // console.log("offer:", offer);
  // await peerConnetion.setLocalDescription(offer);

  // _onPeerConnectionEvent(peerConnetion)
  // onSuccessCallback && onSuccessCallback(offer);
  return [peerConnetion, localMediaStream];
};

export const initRemoteRTC =
  () =>
  async (
    constraint: MediaStreamConstraints,
    onSuccessCallback?: (offer: RTCSessionDescriptionInit) => void
  ): Promise<[RTCPeerConnection, MediaStream]> => {
    const peerConnetion = new RTCPeerConnection();
    const localMediaStream = await getLocalMedia(constraint);

    for (let track of localMediaStream.getTracks()) {
      peerConnetion.addTrack(track);
    }
    //TODO: 本地渲染 video stream
    // const offer = await peerConnetion.createOffer();
    // console.log("offer:", offer);
    // await peerConnetion.setLocalDescription(offer);

    // _onPeerConnectionEvent(peerConnetion)
    // onSuccessCallback && onSuccessCallback(offer);

    return [peerConnetion, localMediaStream];
  };

function _onPeerConnectionEvent(pc: RTCPeerConnection) {
  //监听媒体轨道事件
  pc.ontrack = (e) => {
    console.log("ontrack监听:", e);
  };
  //监听ICE候选事件
  /**
   * 在以下三种情况下会触发该事件
   * 1：分享新的候选
   * 2：代表最后一轮候选结束
   * 3：代表ICE收集完成
   */
  /*https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/icecandidate_event */
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      //TODO: 将该源的信息发送给远端信号服务器
    } else {
      console.log("本次协商没有更多选择了");
    }
    console.log("onicecandidate监听:", e);
  };
  //监听需要重新协商事件
  pc.onnegotiationneeded = (e) => {
    console.log("onnegotiationneeded监听:", e);
  };
  //datachannel事件
  pc.ondatachannel = (e) => {
    console.log("datachannel事件:", e);
  };
  //ice连接状态改变
  pc.oniceconnectionstatechange = (e) => {
    console.log("ice连接状态改变:", e);
  };
  //信令状态改变
  pc.onsignalingstatechange = (e) => {
    console.log("信令状态改变:", e);
  };
  //连接状态改变
  pc.onconnectionstatechange = (e) => {
    console.log("连接状态改变：", e);
  };
  //监听ice收集状态
  pc.onicegatheringstatechange = (e) => {
    let connection = e.target as RTCPeerConnection;
    switch (connection.iceGatheringState) {
      case "new":
        console.log("[ICE Status]: new");
        break;
      case "gathering":
        console.log("[ICE Status]: gathering");
        break;
      case "complete":
        console.log("[ICE Status]: complete");
        break;
    }
  };
}

export function setDomByStream(
  type: "local" | "remote",
  ref: React.MutableRefObject<HTMLVideoElement | undefined> | React.RefObject<HTMLVideoElement>,
  stream: MediaStream
) {
  // |MediaStreamTrack| readonly MediaStream[]

  if (type === "local") {
    console.log("本地媒体流：", stream);
    ref.current!.srcObject = stream as MediaStream;
    ref.current!.onloadedmetadata = (e) => {
      ref.current!.play();
    };
  } else if (type === "remote") {
    console.log("远程媒体流：", stream.getTracks());
    console.log(ref.current);
    // let newStream = new MediaStream();
    // newStream.addTrack(stream as MediaStreamTrack);
    ref.current!.srcObject = stream as MediaStream;
    // ref.current!.muted = true;
    ref.current!.onloadedmetadata = (e) => {
      ref.current!.play();
    };
  }
}

// export const setDomByStream = (type: "local" | "remote", videoRef: MutableRefObject<HTMLVideoElement | null>, stream: MediaStream | null) => {
//   if (videoRef && videoRef.current) {
//     if (type === "local" || type === "remote") {
//       // 检查 stream 是否为有效的 MediaStream 对象
//       if (stream instanceof MediaStream || stream === null) {
//         videoRef.current.srcObject = stream;
//       } else {
//         console.error("Invalid stream type:", stream);
//       }
//     }
//   }
// };
