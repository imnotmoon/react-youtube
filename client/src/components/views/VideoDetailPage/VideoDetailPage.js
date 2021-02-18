import React, {useEffect, useState} from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'

function VideoDetailPage(props) {

    const [VideoDetail, setVideoDetail] = useState([])

    // url에서 videoId에 해당하는 부분을 가져온다.
    // App.js 의 Route에서 videoId로 매핑해놨음.
    const videoId = props.match.params.videoId

    const variable = {
        videoId : videoId
    }

    useEffect(() => {

        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setVideoDetail(response.data.videoDetail)
            } else {
                alert('비디오 정보를 가져오는데 실패했습니다.')
            }
        })
    }, [])


    if(VideoDetail.writer) {
        return (
            <Row gutter={[16, 24]}>
                <Col lg={18} xs={24} >
                    {/* 비디오, info, 구독버튼, comment 등 */}
                    <div style={{ width:'100%', padding: '3rem 4rem'}}>
                        
                        {/* video */}
                        <video style={{ width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />



                        {/* info */}
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} /> }
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />

                        </List.Item>



                        {/* comment */}
                    </div>

                </Col>
                <Col lg={6} xs={24} >
                    Side Videos
                </Col>
            </Row>
        )
    } else {
        return (
            <div>...loading</div>
        )
    }
}

export default VideoDetailPage
