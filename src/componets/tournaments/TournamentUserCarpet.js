
export const TournamentUserCarpet = ({id,name,img,select,changeSelectSingle})=>{

    return(
        <div className="col-md-4" style={{marginBottom:50,position:"relative"}} >
            <div style={{
                    background:"#fff",
                    padding:10,
                    borderRadius:6,
                    position:"relative",
                    boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",
                    height:120
                }}>
                <div style={{position:"absolute",top:10,left:20}}><img style={{width:'70px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)"}} alt="avatar" src={img} /></div>
                <div className="mt-5" style={{marginLeft:90}}>{name}</div>
                
                <div className="d-flex justify-content-end mt-n3" style={{position:"absolute",right:10,top:10}}>
                    <i className={`fa fa-3x ${select ? "fa-check-square-o" : "fa-square-o"} `} aria-hidden="true" onClick={ ()=>changeSelectSingle(id)} style={{cursor:"pointer"}}></i>
                </div>

            </div>
        </div>
    )
}
