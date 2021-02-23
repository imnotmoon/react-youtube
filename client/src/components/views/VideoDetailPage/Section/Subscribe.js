import Axios from 'axios'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState()

    useEffect(() => {

        let variable = {userTo: props.userTo}
        
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
        
        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }
        
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })

    })

    const onSubscribe = () => {

        let subscribeVariable = {
            // 내 아이디와 동영상 올린사람의 아이디
            userTo : props.userTo,
            userFrom : props.userFrom
        }

        // 이미 구독중이라면
        if(Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        // 구독 취소 성공 -> state 수정.
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)      // 지금 상태와 반대
                    } else {
                        alert('구독 취소하는데 실패했습니다.')
                    }
                })
        // 아직 구독중이 아니라면
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        // 구독 성공 -> state 수정
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)      // 지금 상태와 반대
                    } else {
                        alert('구독하는데 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <button
                style={{ backgroundColor: `${Subscribed ? '#CC0000' : 'grey'}`, borderRadius: '4px', color: `${Subscribed ? 'white' : 'white'}`, padding: '10px, 16px',
                fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'}}
                onClick={onSubscribe}
        >
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe' }
        </button>
        </div>
    )
}

export default Subscribe
