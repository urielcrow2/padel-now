import React from 'react';
import './buttonFloat.css';


export const ButtonFloat = ( {hight=700}) =>{

    const [scrollPosition, setScrollPosition] = React.useState(0);
   
    const goTop = ()=>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    React.useEffect(() => {//Guardamos la posición del scroll

        function updatePosition() {
            setScrollPosition(window.pageYOffset);
        }

        window.addEventListener('scroll', updatePosition);
        updatePosition();

        return () => window.removeEventListener('scroll', updatePosition);

    }, [scrollPosition]);

    return (
        scrollPosition > hight 
        ? 
            <button type="button" className="btn buttonFloat" onClick={goTop}><i className="fas fa-arrow-up fa-2x" title="Up"></i></button> 
        :
            <></>
    )
}
