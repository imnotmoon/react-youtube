import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, avatar, Col, Typography, Row, Avatar } from 'antd';
import Axios from 'axios';
import moment, { min } from 'moment';
const { Title } = Typography;
const { Meta }  = Card;

function SubscriptionPage() {

    const [Video, setVideo] = useState([])

    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));
        
        // antd Row gutter에서 16, 24로 설정했어서 가로로 24칸
        return (<Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`} >
                <div style={{position:'relative'}} >
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail' />
                    <div className="duration">
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name}</span>
            <span style={{marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>)
    })

    useEffect(() => {

        // '내가' 구독하는 동영상만 가져오기 위함
        const subscriptionVariable = {
            userFrom : localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideo', subscriptionVariable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data.videos)
                setVideo(response.data.videos)
            } else {
                alert('비디오를 가져오는데 실패했습니다.')
            }
        })
        
    }, [])


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>     
                {/* 반응형으로 Col. 윈도우 사이즈가 lg일때는 6행(4열), md일때는 8행(3열), xs일때는 24행(1열)*/}
                {renderCards}
            </Row>
        </div>
    )
}

export default SubscriptionPage
