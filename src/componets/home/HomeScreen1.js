import {useContext,memo,useEffect,useState,useRef} from 'react';
import {Lazy,Pagination,Autoplay,Navigation} from 'swiper';
import {Swiper,SwiperSlide } from 'swiper/react';
import {customeContext} from '../../context/context';
import {ButtonWhatsApp} from '../utils/whatsapp/ButtonWhatsApp';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './slide.css';

import img1 from'./img/vertical-01.jpg';
import img1b from'./img/land-01.jpg';
import img2 from'./img/vertical-02.jpg';
import img2b from'./img/land-02.jpg';
import img3 from'./img/vertical-03.jpg';
import img3b from'./img/land-03.jpg';
import img4 from'./img/vertical-04.jpeg';
import img4b from'./img/land-04.jpg';
import img5 from'./img/vertical-05.jpg';
import img5b from'./img/land-05.jpg';

import img6 from'./img/vertical-06.jpeg';
import img6b from'./img/land-06.jpeg';
import img7 from'./img/vertical-07.jpeg';
import img7b from'./img/land-07.jpeg';


export const HomeScreen1 = memo(() => {

    const { setContext } = useContext(customeContext);
    const [widthScreen,setWidthScreen] = useState(window.innerWidth);
    const swiperRef =  useRef(null);

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

    useEffect(()=>{
        setTimeout(()=>{
            swiperRef.current.swiper.autoplay.start();//Obligamos al swiper al autoplay, por alguna razón no inicie automático en el celular
        },300)
    },[swiperRef]);

   
    return (
        <div className="main-content">
            <div className="main-content-inner">

                <div className="swiper-container position-relative">
                    <Swiper
                        ref={swiperRef}
                        style={{
                        "--swiper-navigation-color": "#098BCE",
                        "--swiper-pagination-color": "#098BCE",
                        }}
                        lazy={true}
                        pagination={{ type: "progressbar",}}
                        navigation={true}
                        modules={[Lazy, Pagination,Autoplay,Navigation]}
                        className="mySwiper"
                        autoplay={{
                                delay:1500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                        }}
                        speed={500}
                        // onClick={(swiper)=>{
                        //     swiper.autoplay.stop();
                        //     console.log(swiper)
                        //     setTimeout(()=>{
                        //         swiper.autoplay.start();//Obligamos al swiper al autoplay, por alguna razón no inicie automático en el celular
                        //     },5000)
                        // }}
                        // allowTouchMove={false}
                        // pagination={{
                        //     clickable: true,
                        // }}
                    >
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img6 : img6b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img7 : img7b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img1 : img1b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img2 : img2b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="redes-sociales">
                                <div className="logo-instagram">
                                    <a href="https://www.instagram.com/padelcaremx/" target="_blank">
                                        <i className="fa fa-instagram"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="redes-sociales-link">
                                <a href="https://www.instagram.com/padelcaremx/" target="_blank" className="btn btn-primary redes-sociales-link">
                                    PEDIDOS
                                </a>
                            </div>
                            <img
                                src={widthScreen <= 720 ? img3 : img3b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img5 : img5b}
                                className="swiper-lazy"
                                alt="image9"
                            />
                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src={widthScreen <= 720 ? img4 : img4b}
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


