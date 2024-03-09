import React, { Suspense } from "react";
import { Switch } from "antd";
import { MoonOutlined, SunFilled } from "@ant-design/icons";
function Setting() {
  return (
    <Suspense fallback="loading">
      <div>
        <Switch checkedChildren={<MoonOutlined />} unCheckedChildren={<SunFilled />} />
      </div>
    </Suspense>
  );
}

export default Setting;
