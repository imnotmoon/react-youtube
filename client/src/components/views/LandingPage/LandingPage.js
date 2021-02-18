import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, avatar, Col, Typography, Row, Avatar } from 'antd';
import Axios from 'axios';
import moment, { min } from 'moment';
const { Title } = Typography;
const { Meta }  = Card;


export default function LandingPage() {

    const [Video, setVideo] = useState([])

    // DOM이 로드되자마자 무엇을 처음 할것인지
    // 2번째 파라미터인 input이 없다면 DOM이 업데이트 될때 한번만.
    // React Hook
    useEffect(() => {
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success) {
                console.log(response.data.videos)
                setVideo(response.data.videos)
            } else {
                alert('비디오를 가져오는데 실패했습니다.')
            }
        })
        
    }, [])

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
