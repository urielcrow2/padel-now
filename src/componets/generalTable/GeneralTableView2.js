
import React from 'react'

export const GeneralTableView2 = ({totalJournals,tableGeneral})=> {
    return (
        tableGeneral.list.users && 

        tableGeneral.list.users.map(user =>(
            <div 
                key={user.id_user}
                style={{
                    background:"#fff",
                    padding:10,
                    borderRadius:6,
                    position:"relative",
                    boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",
                    marginBottom:15
                }}
            >
            
                <div style={{background:"#007bff",padding:10,color:"#fff",textAlign:'right'}}> 
                    <span style={{fontSize:12,marginRight:6}}>{user.alias}</span>
                    <br />
                    {user.name} 
                </div>
                
                <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column"><b>Posición</b> <span className="badge bg-secondary" style={{fontSize:25,marginTop:5}}> {user.position} </span></div>
                    <img style={{width:'90px',margin:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}} alt="avatar" src={user.img} /> 
                    <div className="d-flex flex-column"><b>Cancha</b> <span className="badge bg-danger" style={{fontSize:25,marginTop:5}}> {user.court} </span></div>
                </div>

                <div className="d-flex justify-content-center">
                    <h5>JORNADAS</h5>
                    <hr style={{width:"100%"}}/>
                    <h5>PUNTOS</h5>
                </div>
                
                {
                    totalJournals.map( journal => (
                        <div className="row" key={journal}>
                            <div className="col-3 text-center">
                                {journal}
                            </div>
                            <div className="col-9 text-end">
                                {user["journal"+journal] }
                            </div>
                        </div>
                    ))
                }  

                <div className="d-flex justify-content-center">
                    <hr style={{width:"100%"}}/>
                </div>

                 <div className="d-flex justify-content-end align-items-center">
                   <h4>Total</h4>
                   <span className="badge bg-warning" style={{fontSize:25,marginTop:5,marginLeft:5}}> {user.pointsGenerals} </span>
                </div>
              
            </div>
        ))
    )
}


