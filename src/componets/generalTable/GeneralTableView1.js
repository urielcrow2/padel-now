
import React from 'react'

export const GeneralTableView1 = ({totalJournals,tableGeneral}) => {
    return (
        <div className="table-responsive" style={{padding:25}}>
            <table className="table align-middle" style={{marginTop:30}}>
                <thead style={{background:"#098BCE",color:"#FFF",height:70,fontSize:15,verticalAlign:'middle',boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.52)",borderRadius:20}}>
                    <tr>
                        <th scope="col" style={{borderTopLeftRadius:20}}>Posición</th>
                        <th scope="col" style={{textAlign:'center'}}>Jugador</th>
                        <th scope="col">Cancha</th>
                        
                        {
                            totalJournals.map( journal => <th scope="col" key={journal}>J{journal}</th>)
                        }

                        <th scope="col" style={{borderTopRightRadius:20}}>Total</th>
                    </tr>
                </thead>
                <tbody style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)",borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                {
                    
                    tableGeneral.list.users && 
                    
                    tableGeneral.list.users.map(user =>(
                        <tr style={{verticalAlign:'middle'}} key={user.id_user}>
                            <th scope="row" style={{paddingLeft: 40}} >{user.position}</th>
                            <td style={{textAlign:'center'}}> 
                                <img style={{width:'50px',marginBottom:'10px',borderRadius:"50%",boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.32)"}} alt="avatar" src={user.img} /> 
                                <br />
                                <span style={{fontSize:12,marginRight:6}}>{user.alias}</span>
                                <br />
                                {user.name} 
                            </td>
                            <td>
                                <span className="badge bg-danger" style={{fontSize:25,marginTop:5}}> {user.court} </span>
                            </td>

                            {
                                totalJournals.map( journal => (
                                    <td key={journal}>
                                        <span style={{width:80,fontSize:20,textAlign:'center'}}>
                                            { user["journal"+journal] }
                                        </span>
                                    </td>
                                ))
                            }
                            <td>
                                <span style={{width:80,fontSize:20,textAlign:'center'}}>
                                    {user.pointsGenerals}
                                </span>
                            </td>
                        </tr>
                    ))
                }
                
                </tbody>
            </table>
        </div>
    )
}

