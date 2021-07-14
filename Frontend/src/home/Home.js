import React from 'react';
import HomeImg from './imgs/home.png'

export default class Home extends React.Component {
    render() {
        return (
            <div style ={ { backgroundImage: HomeImg } }>
                <img src={HomeImg} alt={"Home"}/>
            </div>
        )
    }
}