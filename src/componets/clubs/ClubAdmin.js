

export const ClubAdmin = ({root,focus,blur,changeGeneral,id,saveAdminRootFirstTime})=>{

    return(
        <div style={{
            padding:10
        }}>
            <div className="mb-3 position-relative">
                <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Nombre</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input 
                    type="text" 
                    className="form-control text-uppercase" 
                    name="name"
                    value={root.name}
                    onChange={(e)=>changeGeneral(e.target.name,e.target.value,id,root.id)} 
                    onDoubleClick={()=>changeGeneral("disabledName",false,id,root.id)} 
                    onFocus={(e)=>focus(e)} 
                    onBlur = { (e)=>blur(e,'disabledName',id,root.id) }
                    readOnly={root.disabledName}
                />
            </div>
            <div className="mb-3 position-relative mt-3">
                <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>E-mail</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input 
                    type="text" 
                    className="form-control text-lowercase" 
                    name="email"
                    value={root.email}
                    onChange={(e)=>changeGeneral(e.target.name,e.target.value,id,root.id)} 
                    onDoubleClick={()=>changeGeneral("disabledEmail",false,id,root.id)} 
                    onFocus={(e)=>focus(e)} 
                    onBlur = {(e)=>blur(e,'disabledEmail',id,root.id)}
                    readOnly={root.disabledEmail}
                />
            </div>
            <div className="mb-3 position-relative mt-3">
                <span className="position-absolute" style={{top:-18,left:20,color:"#CCC"}}>Teléfono</span>
                <input 
                    type="text" 
                    className="form-control" 
                    name="number"
                    value={root.number ? root.number : ''}
                    onChange={(e)=>changeGeneral(e.target.name,e.target.value,id,root.id)} 
                    onDoubleClick={()=>changeGeneral("disabledNumber",false,id,root.id)} 
                    onFocus={(e)=>focus(e)} 
                    onBlur = {(e)=>blur(e,'disabledNumber',id,root.id)}
                    readOnly={root.disabledNumber}
                />
            </div>
            {
                !root.id 

                &&

                <div className="col-12 mt-3 text-center">
                    <button type="button" className="btn btn btn-outline-primary" onClick={()=>saveAdminRootFirstTime(id)} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}>
                        Guardar administrador principal
                    </button>
                </div>

            }
           
            
        </div>
    )
}