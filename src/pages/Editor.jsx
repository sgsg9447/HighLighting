import React from "react";
import Header from "../components/Header/Header";

import VideoPlayer from "../components/editor/VideoPlayer";
import ChatViewer from "../components/editor/ChatViewer";
import DataChart from "../components/editor/DataChart";
import BookMarker from "../components/editor/BookMarker";
import CommunicationTool from "../components/editor/CommunicationTool";
import EditorTimePointerProvider from "../providers/EditorTimePointerProvider";
import "./Editor.scss";

import useResult from "../hooks/useResult";
import { useState, useEffect } from "react";

function Editor() {
  const { url, duration, chatDistribution, chatSuper, audio, video } =
    useResult();
  const [chatDistributionData, setChatDistributionData] = useState([]);
  const [chatSuperData, setChatSuperData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [propUrl, setPropUrl] = useState();
  const [propDuration, setPropDuration] = useState();

  // 채팅 데이터 수신1
  useEffect(() => {
    console.time("mapValueToObj-ChatDistribution");
    // 로컬스토리지에서 채팅 분포 데이터 받아올 때
    if (!chatDistribution) {
      // 분포도
      const localChatDistribution = localStorage.getItem(
        "localChatDistribution"
      );
      const arrayChatDistribution = JSON.parse(
        "[" + localChatDistribution + "]"
      );
      const objlocalChatDistribution = arrayChatDistribution.map(
        (value, index) => ({ x: index, y: value })
      );
      setChatDistributionData(objlocalChatDistribution);
      console.log("chatDistributionData <- localChatDistribution");
    }
    // POST를 통해 직접 받아올 때
    else {
      setChatDistributionData(
        chatDistribution.map((value, index) => ({ x: index, y: value }))
      );
    }
    console.timeEnd("mapValueToObj-ChatDistribution");
  }, []);

  // 채팅 데이터 수신2
  useEffect(() => {
    console.time("mapValueToObj-ChatSet");
    // 로컬스토리지에서 슈퍼챗 데이터 받아올 때
    if (!chatSuper) {
      // 슈퍼챗
      const localChatSuper = localStorage.getItem("localChatSuper");
      const arrayChatSuper = JSON.parse("[" + localChatSuper + "]");
      const objlocalChatSuper = arrayChatSuper.map((value, index) => ({
        x: index,
        y: value,
      }));
      setChatSuperData(objlocalChatSuper);
      console.log("chatSuperData <- localChatSuper");
    }
    // POST를 통해 직접 받아올 때
    else {
      setChatSuperData(
        chatSuper.map((value, index) => ({ x: index, y: value }))
      );
    }
    console.timeEnd("mapValueToObj-ChatSet");
  }, []);

  // 비디오 데이터 수신
  useEffect(() => {
    console.time("mapValueToObj-Chart-Video");
    if (!video) {
      const localVideo = localStorage.getItem("localVideo");
      const arrayVideo = JSON.parse("[" + localVideo + "]");
      const objVideo = arrayVideo.map((value, index) => ({
        x: index,
        y: value,
      }));
      setVideoData(objVideo);
      console.log("VideoData <- localVideo");
    } else {
      setVideoData(video.map((value, index) => ({ x: index, y: value })));
    }
    console.timeEnd("mapValueToObj-Chart-Video");
  }, []);

  // 오디오 데이터 수신
  useEffect(() => {
    console.time("mapValueToObj-Chart-Audio");
    if (!audio) {
      const localAudio = localStorage.getItem("localAudio");
      const arrayAudio = JSON.parse("[" + localAudio + "]");
      const objAudio = arrayAudio.map((value, index) => ({
        x: index,
        y: value,
      }));
      setAudioData(objAudio);
      console.log("AudioData <- localAudio");
    } else {
      setAudioData(audio.map((value, index) => ({ x: index, y: value })));
    }
    console.timeEnd("mapValueToObj-Chart-Audio");
  }, []);

  // URL 주소(url: AppStateProvider으로부터, localUrl: 로컬스토리지로부터)
  useEffect(() => {
    if (!url) {
      const tmpLocalUrl = localStorage.getItem("prevUrl");
      setPropUrl(tmpLocalUrl);
      console.log("UrlData <- localUrl", tmpLocalUrl);
    } else {
      setPropUrl(url);
    }
  }, []);

  useEffect(() => {
    if (!duration) {
      const tmpLocalDuration = localStorage.getItem("localDuration");
      setPropDuration(tmpLocalDuration);
      console.log("duration <- localDuration", tmpLocalDuration);
    } else {
      setPropDuration(duration);
    }
  }, []);

  return (
    <>
      <Header />
      <EditorTimePointerProvider>
        <div className="upperlayer">
          <div className="VideoPlayerCover">
            <VideoPlayer url={propUrl} />
          </div>

          <div className="ChatViewerCover">
            <ChatViewer />
          </div>

          <div className="CommunicationToolCover">
            <CommunicationTool duration={propDuration} />
          </div>
        </div>

        <div className="lowerlayer">
          <div className="BookMarkerCover">
            <BookMarker />
          </div>

          <div className="DataChartCover">
            <DataChart
              id="DataChart"
              title="TrippleChartPlayer"
              dataList={[
                chatDistributionData,
                videoData,
                audioData,
                chatSuperData,
              ]}
              url={propUrl}
            />
          </div>
        </div>
      </EditorTimePointerProvider>
    </>
  );
}

export default React.memo(Editor);
