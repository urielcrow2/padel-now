import React, {useState,useEffect} from 'react';
import './pager.css';

export const Pager = React.memo(({totalRegistrosPorPagina = 30,totalRegistros=0,pageAdyacent = 3,paginaActual = 1,pagina}) => {

    const [pageCurrent,setPageCurrent] = useState(paginaActual);
    
    useEffect(() => {
        setPageCurrent(paginaActual)
    }, [paginaActual])

    const totalPages = parseInt( Math.ceil(totalRegistros / totalRegistrosPorPagina) );

    //Si las paginas que serán generadas son menor a 2 ya no creamos el paginador
    if(totalPages < 2)
        return <></>

    const pagerInit = generateIndex(totalPages);

    const goPage = (pag)=>{

        if(pag < 1 || pag > totalPages || pag === pageCurrent)
            return;
        
        setPageCurrent( pag );//Actualizamos la pag en el paginador

        const inicio = generateLimit(pag,totalRegistrosPorPagina);
        const temp = {
            pag,
            limit : [inicio,totalRegistrosPorPagina]
        }

        pagina(temp);//Retornamos al componente que llamo el paginador
    }

    return (
        <section className="paginacion">
            <ul>
                <li onClick={()=>goPage( Math.max(pageCurrent - 1,0)  )} className={`${pageCurrent === 1 ? 'disabled' : ''}`} > <i className='fas fa-angle-double-left'></i> </li>
                    {
                        totalPages <= pageAdyacent ?

                        pagerInit.map(page=>(
                            li(page,pageCurrent,goPage)
                        )) :

                        pagerInit.map(page=>{

                            ///Primer caso <123...8>
                            if ( pageCurrent < pageAdyacent){
                                if(page > pageAdyacent){
                                    if(page === totalPages ){
                                        return (
                                            <div className= "element-empty" key={page}>
                                                <span>...</span>
                                                { li(page,pageCurrent,goPage) }
                                            </div>
                                        )
                                    }  
                                    return<div className= "element-empty" key={page}></div>;
                                }
                                return li(page,pageCurrent,goPage);
                            }

                            //Segundo caso <1...234...8>
                            else if ( (totalPages + 2 - pageAdyacent) > pageCurrent ){

                                if(page === 1){
                                    return (
                                        <div className= "element-empty" key={page}>
                                            {li(page,pageCurrent,goPage)}
                                            <span>...</span>
                                        </div>
                                    )
                                }

                                if( page < totalPages){
                                    if( page <= pageCurrent + parseInt( pageAdyacent / 2) && page >= pageCurrent - parseInt( pageAdyacent / 2)  )
                                        return li(page,pageCurrent,goPage);
                                    return <div className= "element-empty" key={page}></div>
                                }

                                return (
                                    <div className= "element-empty" key={page}>
                                        <span>...</span>
                                        {li(page,pageCurrent,goPage)}
                                    </div>
                                )
                            }

                            //Tercer caso <1...678>
                            else{

                                if(page === 1 ){
                                    return (
                                        <div className= "element-empty" key={page}>
                                            {li(page,pageCurrent,goPage)}
                                            <span>...</span>
                                        </div>
                                    )
                                }  
                               
                                if(page < totalPages - pageAdyacent + 1)
                                    return<div className= "element-empty" key={page}></div>;
    
                                return li(page,pageCurrent,goPage);

                            }

                        })

                    }         
                <li onClick={()=>goPage( Math.min( pageCurrent + 1 , totalPages + 1 ))} className={`${pageCurrent === totalPages ? 'disabled' : ''}`}>  <i className='fas fa-angle-double-right'></i> </li>
            </ul>
        </section>
    )
});

const generateIndex = (total)=>{
    let temp = [];
    for(let i = 1; i <= total; i++)
       temp.push(i);
    return temp
}

export const generateLimit = (pag,total)=>{
    return ( pag > 1) ? pag * total - total : 0;
}

const li = (page,pageCurrent,goPage) => (<li onClick={()=>goPage(page)} className={ page === pageCurrent ? 'active' : ''  } key={page}> { page } </li>)


