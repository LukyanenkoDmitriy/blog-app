import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 40,
    }}
    spin
  />
)

const Load = () => <Spin indicator={antIcon} />

export default Load
