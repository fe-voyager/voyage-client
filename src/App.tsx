// import { SpeakerLayou } from "./layout/speakerLayout";
// import { DefaultLayout } from "./layout/defaultLayout";
import routes from "./router";
// import GlobalStyl from "./style/theme";
import { useRoutes } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { purple } from "@ant-design/colors";
import MainLayout from "./layout/mainLayout";
import SocketProvider from "@/components/SocketProvider";
import styled from "styled-components";
function App() {
  // const socket = io("http://localhost:5000");
  // socket.emit("chat", Date.now(), "111");

  return (
    // <Container>
    //   <div className="left">left</div>
    // </Container>
    <SocketProvider>
      <ConfigProvider
        theme={{
          // algorithm:theme.darkAlgorithm,
          token: {
            colorPrimary: `${purple[4]}`,
            controlItemBgHover: purple[0],
            colorBgSpotlight: `rgba(0, 0, 0, 0.75)`,
            controlOutlineWidth: 5,
            // fontSize: 12,
            // borderRadius: 15,
          },
        }}
      >
        <MainLayout>{useRoutes(routes)}</MainLayout>
      </ConfigProvider>
    </SocketProvider>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: red;
`;
export default App;
