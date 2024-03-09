import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Tooltip, Avatar } from "antd";
import { VideoCameraAddOutlined, UserAddOutlined } from "@ant-design/icons";
import { IconButton } from "@/components/icons/iconButton";
import george from "@/assets/georgeh.jpg";
import ChatRecord from "./ChatRecord";
import ChatFooter from "./ChatFooter";

export type RightContainerProps = {
  receiverAvatarUrl?: string;
  reciverStatus?: string;
  receiverId: string;
  receiverName?: string;
};

type MsgType = {
  isMe: boolean;
  data: string;
};

const chat = [
  { isMe: true, data: `\n \n 11111111111111` },
  { isMe: true, data: "sjdashddwkwlqa" },
  { isMe: false, data: "sjdashda" },
  { isMe: true, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  {
    isMe: false,
    data: "sjdashddkalllllllllllllllllllllllllllllllllllllllllldjkjfhjhjhjjhjhjh  da",
  },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashdapO😂" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
  { isMe: false, data: "sjdashda" },
];
const RightContainer: React.FC<RightContainerProps> = (props) => {
  const [chatMessages, setChatMessages] = useState<MsgType[]>(chat);
  //   const [msgValue, setMsgValue] = useState<string>("");
  //   const [openEmoji, setOpenEmoji] = useState(false);
  //   const [openPopover, setOpenPopover] = useState(false);
  //   const textAreaRef = useRef<HTMLTextAreaElement>();
  const contentRef = useRef<HTMLDivElement | null>(null);

  function pushMsg(msg: MsgType) {
    setChatMessages([...chatMessages, msg]);
  }
  return (
    <>
      <Container>
        {/* <div style={{ height: "100%", width: "100%", display: "flex" }}>
      <Empty description={false} imageStyle={{ height: 160 }} style={{ margin: "auto " }}></Empty>
    </div> */}
        <div className="container-wrap">
          {/* <ContentHeader /> */}
          <div className="header">
            <div className="header-left h-item">
              <div className="header-userinfo">
                <span className="user-avatar">
                  <Avatar src={props.receiverAvatarUrl} size={40} />
                </span>
                <span className="user-info">
                  <div className="title">{props.receiverName}</div>
                  <div className="status">{props.reciverStatus}</div>
                </span>
              </div>
            </div>
            <div className="header-right h-item">
              <Tooltip title={<span style={{ fontSize: 12 }}>视频通话</span>}>
                <IconButton icon={<VideoCameraAddOutlined />} />
              </Tooltip>

              <Tooltip title={<span style={{ fontSize: 12 }}>创建群组</span>}>
                <IconButton icon={<UserAddOutlined />} />
              </Tooltip>
            </div>
          </div>
          {/* <Layout> */}
          <div className="content" ref={contentRef}>
            <div>
              {chatMessages.map((item, index) => {
                return (
                  <ChatRecord
                    key={`${index}`}
                    isMe={item.isMe}
                    imgUrl={george}
                    data={item.data}
                  ></ChatRecord>
                );
              })}
            </div>
          </div>

          <div className="footer">
            <ChatFooter {...{ contentRef, pushMsg }} />
          </div>
          {/* <SendMessageBar>
              <Popover title="不能发送空的消息哦😘" open={openPopover}>
                <TextArea
                  ref={textAreaRef}
                  allowClear
                  placeholder="发送给George"
                  value={msgValue}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onChange={(e) => {
                    setMsgValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.key === "Enter") {
                      setMsgValue(msgValue + "\n");
                      // alert("shift")
                    }
                    if (e.key === "Enter") {
                      e.preventDefault();
                      return e.shiftKey || sendMessage(msgValue!);
                    }
                  }}
                />
              </Popover>

              <EmojiWrap>
                <EmojiPicker isOpen={openEmoji}>
                  <Picker
                    data={data}
                    onEmojiSelect={(emo: { native: string }) => {
                      textAreaRef.current!.focus();
                      setMsgValue(msgValue + emo.native);
                    }}
                    skinTonePosition="search"
                    // theme="dark"
                    // onClickOutside={() => setOpenEmoji(false)}
                  />
                </EmojiPicker>
                <IconButton
                  icon={<EmojiOutlined />}
                  onClick={() => {
                    textAreaRef.current!.focus();
                    setOpenEmoji(!openEmoji);
                  }}
                />
              </EmojiWrap>

              {/* <SendOutlined twoToneColor={purple[5]} /> */}
          {/* <Button
                type="primary"
                icon={<SendOutlined />}
                disabled={msgValue.length === 0}
                onClick={() => sendMessage(msgValue!)}
              >
                发送
              </Button>
            </SendMessageBar>  */}
          {/* </Layout> */}
        </div>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: inline-block;
  & .container-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;

    & .header {
      padding: 20px;
      /* position: absolute; */
      top: 0;
      width: 100%;
      /* width: calc(100% - ${(props) => `${props.innersiderwidth + props.outsiderwidth}px`}); */
      z-index: 99;
      opacity: 1;
      height: 60px;
      background-color: #fff;
      display: flex;

      justify-content: space-between;
      align-items: center;
      &-left {
        & .header-userinfo {
          display: flex;

          & .user-avatar {
            /* height: 100%; */
          }
          & .user-info {
            margin: 0 10px;
            & .title {
            }
            & .status {
            }
          }
        }
      }
      &-right {
      }
    }
    & .content {
      /* flex-shrink: 0; */
      min-width: 500px;
      z-index: 10;
      overflow-y: scroll;
    }
    & .footer {
      display: flex;
      align-items: center;
      z-index: 99;
    }
  }
`;

export default RightContainer;
