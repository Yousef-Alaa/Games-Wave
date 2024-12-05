import { createPortal } from 'react-dom'
import { Spin } from 'antd'

function Loading() {
    return createPortal(
            <Spin size="large" tip="Loading..." fullscreen />,
            document.body
        )
}

export default Loading;