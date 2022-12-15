

export const AdminCarpet = ({
    id,
    name,
    email,
    number,
    img,
    disabledName,
    disabledEmail,
    disabledNumber,
    deleteAdmin,
    changeGeneral,
    focus,
    blur
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
                    
                    <div className="d-flex justify-content-end mt-4 position-relative">
                        <span className="position-absolute" style={{top:2,left:20,color:"#CCC"}}>Nombre</span>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control mt-4 text-uppercase" 
                            value={name ? name : ""} 
                            onChange={(e)=>changeGeneral(e.target.name,e.target.value,id)} 
                            onDoubleClick={()=>changeGeneral("disabledName",false,id)} 
                            onFocus={(e)=>focus(e)} 
                            onBlur = {(e)=>blur(e,'disabledName',id)}
                            readOnly={disabledName}
                        />
                    </div>
                    
                    <div className="d-flex justify-content-end position-relative">
                        <span className="position-absolute" style={{top:2,left:20,color:"#CCC"}}>E-mail</span>
                        <input 
                            type="text" 
                            name="email"
                            className="form-control mt-4 text-lowercase" 
                            value={email ? email : ""} 
                            onChange={(e)=>changeGeneral(e.target.name,e.target.value,id)} 
                            onDoubleClick={()=>changeGeneral("disabledEmail",false,id)} 
                            onFocus={(e)=>focus(e)} 
                            onBlur = {(e)=>blur(e,'disabledEmail',id)}
                            readOnly={disabledEmail}
                        />
                    </div>

                    <div className="d-flex justify-content-end align-items-center position-relative">
                        <span className="position-absolute" style={{top:2,left:20,color:"#CCC"}}>Teléfono</span>
                        <input 
                            type="text" 
                            name="number"
                            className="form-control mb-2 mt-4" 
                            value={number ? number : ""} 
                            onChange={(e)=>changeGeneral(e.target.name,e.target.value,id)} 
                            onDoubleClick={()=>changeGeneral("disabledNumber",false,id)} 
                            onFocus={(e)=>focus(e)} 
                            onBlur = {(e)=>blur(e,'disabledNumber',id)}
                            readOnly={disabledNumber}
                        />
                        <button 
                            type="button" 
                            className="btn btn-outline-danger" 
                            style={{marginLeft:5,marginTop:5}}
                            onClick={()=>deleteAdmin(name,img,id)}>
                            <i className="fa fa-trash fa-2x" aria-hidden="true"></i>
                        </button>

                    </div>

                    

                   
                </div>
            </div>
    )
}
