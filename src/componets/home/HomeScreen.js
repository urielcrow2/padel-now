import { useContext , memo, useEffect, useState} from 'react';
import { Lazy, Pagination, Autoplay} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import {customeContext} from '../../context/context';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './slide.css';

import img1 from'./img/1.jpeg';
import img2 from'./img/2.jpg';
import img3 from'./img/3.jpeg';
import img4 from'./img/4.jpg';

const HomeScreen = memo(() => {

    const { setContext } = useContext(customeContext);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Inicio'
            })
        );
    },[setContext]);

    useEffect(()=>{

        const onResize = ()=>{
            setWidthScreen( window.innerWidth )
        }

        window.addEventListener('resize',onResize);

        return () => {
            window.removeEventListener('resize',onResize);
        }

    },[]);

    return (
        <div className="main-content">
            <div className="main-content-inner">
            
                                <div className="swiper-container">
                                    <Swiper
                                        style={{
                                        "--swiper-navigation-color": "#098BCE",
                                        "--swiper-pagination-color": "#098BCE",
                                        }}
                                        lazy={true}
                                        pagination={{ type: "progressbar",}}
                                        navigation={true}
                                        modules={[Lazy, Pagination,Autoplay]}
                                        className="mySwiper"
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false,
                                            }}
                                    >
                                        <SwiperSlide>
                                        <img
                                            src={widthScreen <= 720 ? img1 : img2}
                                            className="swiper-lazy"
                                            alt="image7"
                                        />
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                        <img
                                            src={widthScreen <= 720 ? img3 : img4}
                                            className="swiper-lazy"
                                            alt="image9"
                                        />
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                                        </SwiperSlide>
                                    
                                    </Swiper>
                             
                </div>
            </div>
        </div>
    )
})

export default HomeScreen;
