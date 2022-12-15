import {formatDateMx} from '../../helpers/miselanius';

const categorys = (key)=>{
    switch(parseInt(key)){
        case 0:
            return '1a';
        case 1:
            return '1b';
        default:
            return key;
    }
}

const access__ = (key)=>{
    switch(key){
        case 1:
            return 'JUGADOR';
        case 2:
            return 'ADMINISTRADOR';
        default:
            return key;
    }
}

export const UserCarpet = ({
    id,
    email,
    name,
    number,
    img,
    access,
    birth_at,
    category,
    alias,
   /* disabledAlias,
    disabledMail,
    disabledName,
    disabledNumber,
    disabledBirth,*/
    disabledAccess,
    disabledCategory,
    deleteUser,
    doubleClick,
    blur,
    updateData,
    focus,
    btnMoreInfo,
    changeBtnInfo
})=>{

    return(
            <div className="col-md-4" style={{marginBottom:50}}>
                <div style={{
                    background:"#fff",
                    padding:10,
                    borderRadius:6,
                    position:"relative",
                    boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"
                    }}>
                    <div style={{position:"absolute",top:-40,left:20}}><img style={{width:'70px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"}} alt="avatar" src={img} /></div>
                    {
                        parseInt(access) === 2
                            &&
                        <div style={{position:"absolute",top:-23,right:20}}><span style={{background:"#A87B05",padding:4,color:"#FFF",borderTopLeftRadius:5,borderTopRightRadius:5}}>Administrador</span></div>
                    }
                    
                    <div className="d-flex justify-content-end mt-4 position-relative">
                        <span className="position-absolute" style={{top:-18,right:20,color:"#CCC"}}>Nombre</span>
                        <span className="text-uppercase">{name}</span>
                        {/* <input 
                            type="text" 
                            name={id} 
                            className="form-control text-uppercase" 
                            value={name} 
                            onChange={(e)=>updateData(e.target.name,e.target.value,'name')} 
                            onDoubleClick={(e)=>doubleClick(e,'disabledName')} 
                            onFocus={(e)=>focus(e,'name')} 
                            onBlur={(e)=>blur(e,'name','disabledName')} 
                            readOnly={disabledName}
                            style={{textAlign:"right"}}
                        /> */}
                    </div>
                    
                    <div className="d-flex justify-content-end mt-4 position-relative">
                        <span className="position-absolute" style={{top:-18,right:20,color:"#CCC"}}>Alias</span>
                        <span className="text-uppercase">{alias ? alias : '\u00A0'}</span>
                        {/* <input 
                            type="text" 
                            name={id} 
                            className="form-control text-uppercase" 
                            value={alias ? alias : ""} 
                            onChange={(e)=>updateData(e.target.name,e.target.value,'alias')} 
                            onDoubleClick={(e)=>doubleClick(e,'disabledAlias')} 
                            onFocus={(e)=>focus(e,'alias')} 
                            onBlur={(e)=>blur(e,'alias','disabledAlias')} 
                            readOnly={disabledAlias} 
                            readOnly={true}
                            style={{textAlign:"right"}}
                        /> */}
                    </div>

                    <div className="d-flex justify-content-center"><hr style={{width:"100%"}}/></div>

                    <div className="accordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header d-flex justify-content-between">
                                <button 
                                    className="btn-toggle d-flex justify-content-center"
                                    type="button" 
                                    onClick={()=>changeBtnInfo(id)} 
                                    style={{padding:5}}
                                >
                                    { btnMoreInfo ? <i className="fa fa-plus-circle fa-2x" aria-hidden="true"></i> : <i className="fa fa-minus-circle fa-2x" aria-hidden="true"></i> }
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${btnMoreInfo ? '' : 'show'}`} >
                                <div className="accordion-body">

                                    <div className="mt-3 mb-3 position-relative">
                                        <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>E-mail</span>
                                        <span className="text-lowercase">{email}</span>
                                        {/* <input 
                                            type="text" 
                                            name={id} 
                                            className="form-control" 
                                            value={email ? email : ""} 
                                            onChange={(e)=>updateData(e.target.name,e.target.value,'email')} 
                                            onDoubleClick={(e)=>doubleClick(e,'disabledMail')} 
                                            onFocus={(e)=>focus(e,'email')} 
                                            onBlur={(e)=>blur(e,'email','disabledMail')} 
                                            readOnly={disabledMail}
                                           
                                        /> */}
                                    </div>
                                    <div className="mt-4 mb-3 d-flex justify-content-between position-relative">
                                        <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Teléfono</span>
                                        <span>{number ? number : '\u00A0'}</span>
                                        {/* <input 
                                            type="text" 
                                            name={id} 
                                            className="form-control" 
                                            value={number ? number : ""} 
                                            onChange={(e)=>updateData(e.target.name,e.target.value,'number')} 
                                            onDoubleClick={(e)=>doubleClick(e,'disabledNumber')} 
                                            onFocus={(e)=>focus(e,'number')} 
                                            onBlur={(e)=>blur(e,'number','disabledNumber')} 
                                            readOnly={disabledNumber} 
                                            
                                        /> */}
                                    </div>
                                    <div className="mt-4 d-flex justify-content-between position-relative">
                                        <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Fecha de nacimiento</span>
                                        <span>{birth_at ? formatDateMx(birth_at) : '\u00A0'}</span>
                                        {/* <input 
                                            type="date" 
                                            name={id} 
                                            className="form-control" 
                                            value={birth_at ? birth_at : ""} 
                                            onChange={(e)=>updateData(e.target.name,e.target.value,'birth_at')} 
                                            onDoubleClick={(e)=>doubleClick(e,'disabledBirth')} 
                                            onFocus={(e)=>focus(e,'birth_at')} 
                                            onBlur={(e)=>blur(e,'birth_at','disabledBirth')} 
                                            readOnly={disabledBirth} 
                                            readOnly={true}
                                        /> */}
                                    </div>

                                    <div className="d-flex justify-content-center mb-2"><hr style={{width:"100%"}}/></div>

                                    <div className="mb-3 d-flex justify-content-between position-relative">
                                        <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Categoria</span>

                                        {
                                            disabledCategory

                                                ?
                                                    <input 
                                                        className="form-control" 
                                                        name={id}
                                                        onDoubleClick={(e)=>doubleClick(e,'disabledCategory')}
                                                        readOnly
                                                        value={categorys(category)}
                                                    />
                                                   
                                                :

                                                <select 
                                                    className="form-control" 
                                                    autoFocus 
                                                    name={id}
                                                    onChange={(e)=>updateData(e.target.name,e.target.value,'category')} 
                                                    onFocus={(e)=>focus(e,'category')} 
                                                    onBlur={(e)=>blur(e,'category','disabledCategory')} 
                                                    value={category}
                                                >
                                                    <option value="0">1a</option>
                                                    <option value="1">1b</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                        }
                                       
                                    </div>
                                    <div className="d-flex justify-content-between position-relative">
                                        {/* <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Tipo de usuario</span>
                                        {
                                            disabledAccess

                                                ?

                                                <input 
                                                    className="form-control" 
                                                    style={{marginRight:5}} 
                                                    name={id}
                                                    onDoubleClick={(e)=>doubleClick(e,'disabledAccess')} 
                                                    readOnly
                                                    value={access__(access)}
                                                />

                                                :

                                                <select 
                                                    className="form-control" 
                                                    autoFocus
                                                    style={{marginRight:5}} 
                                                    name={id}
                                                    onChange={(e)=>updateData(e.target.name,e.target.value,'access')} 
                                                    onFocus={(e)=>focus(e,'access')} 
                                                    onBlur={(e)=>blur(e,'access','disabledAccess')} 
                                                    value={access}
                                                >
                                                    <option value="1">JUGADOR</option>
                                                    <option value="2">ADMINISTRADOR</option>
                                                </select>

                                        } */}
                                       
                                        <button type="button" className="btn btn-outline-danger" onClick={()=>deleteUser(name,id,img)}><i className="fa fa-trash fa-2x" aria-hidden="true"></i></button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                   
                </div>
            </div>
    )
}
