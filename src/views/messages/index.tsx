import React, { Suspense, useEffect, useState } from "react";
import { Layout, Avatar, Spin } from "antd";
import { purple } from "@ant-design/colors";
import styled from "styled-components";
import george from "@/assets/georgeh.jpg";
import ChatDesc from "@/views/messages/component/RightContainer/chatDesc";
import RightContainer from "./component/RightContainer";
import ChatList from "@/views/messages/component/LeftContainer/chatList";
import V_Menu from "@/components/menu";
import { LayoutContext } from "@/views/messages/contexts";
import { RightContainerProps } from "./component/RightContainer";
const { Sider, Content } = Layout;
// const {Header}=Layout
const Messages: React.FC = () => {
  //@ts-ignore
  // const [outSiderWidth, setOutSiderWidth] = useState(60);
  // const [innerSiderWidth, setInnerSiderWidth] = useState(350);
  // const [spinning, setSpinning] = React.useState<boolean>(false);
  const contentData: RightContainerProps = {
    receiverId: "user001",
    receiverAvatarUrl: george,
    receiverName: "George H",
    reciverStatus: "在线",
  };
  return (
    // <LayoutContext.Provider value={{ outSiderWidth, innerSiderWidth }}>
    <Suspense fallback={"load"}>
      <Layout style={{ height: "100%" }}>
        {/* 内侧边栏 */}
        <InnerSider width={300}>
          <ChatList />
        </InnerSider>
        {/* 内容区 */}
        <MainContent>
          <Resizer />
          {/* <ChatDesc /> */}
          <RightContainer {...contentData} />
        </MainContent>
      </Layout>
    </Suspense>
    // </LayoutContext.Provider>
  );
};

// const OutterSider = styled(Sider)`
//   width: ${(props) => props.width};
//   height: 100%;
//   background: ${purple[6]} !important;
//   text-align: center;

//   & li {
//     margin: 0;
//     padding: 0;
//     display: flex;
//     justify-content: center;
//   }
// `;
// const UserAvatar = styled(Avatar)`
//   margin: 20px 0;
// `;
const InnerSider = styled(Sider)`
  background-color: transparent !important;
  height: 100%;
  & .ant-layout-sider-children {
    height: 100%;
  }
  & > div {
    display: flex;
    flex-direction: column;
  }
`;
const MainContent = styled(Content)`
  display: flex;
  flex-direction: row;
`;

const Resizer = styled.div`
  display: inline-block !important;
  /* left: -5px; */
  /* background-color: red; */
  width: 2px;
  height: 100%;
  cursor: ew-resize;
`;
export default Messages;
