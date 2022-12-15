

export const AddUser = ({newUserOnChange,name,email,number,addUser,alias,birth,access,category,disbaledInputs,verifyUser,resetForm})=>{
    return(
        <div className="row">
            <div className="col-md-4 position-relative mt-md-0 mt-3">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>E-mail</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input type="text" value={email} onChange={newUserOnChange} name="mailUser" className="form-control text-lowercase" />
            </div>
            <div className="col-md-4 position-relative mt-md-0 mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Nombre</span>
                <span style={{position:"absolute",top:-12,right:25,color:"#00a65a"}}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
                <input type="text" value={name} onChange={newUserOnChange} name="nameUser" disabled={disbaledInputs.inputs} className="form-control text-uppercase" />
            </div>
            <div className="col-md-4 position-relative mt-md-0 mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Alias</span>
                <input type="text" value={alias ? alias : ''} onChange={newUserOnChange} name="aliasUser" disabled={disbaledInputs.inputs} className="form-control text-uppercase" />
            </div>
            <div className="col-md-4 position-relative mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Teléfono</span>
                <input type="text" value={number ? number : ''} onChange={newUserOnChange} name="numberUser" disabled={disbaledInputs.inputs} className="form-control text-lowercase" />
            </div>
            <div className="col-md-4 position-relative mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Fecha nacimiento</span>
                <input type="date" value={birth ? birth : ''} onChange={newUserOnChange} name="birthUser" disabled={disbaledInputs.inputs} className="form-control" />
            </div>
            <div className="col-md-4 position-relative mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Categoria</span>
                <select 
                    className="form-control" 
                    name="categoryUser"
                    onChange={newUserOnChange} 
                    value={category}
                >
                    <option value="0">1a</option>
                    <option value="1">1b</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            {/* <div className="col-md-4 position-relative mt-4">
                <span style={{position:"absolute",top:-21,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Tipo usuario</span>
                <select 
                    className="form-control" 
                    name="accessUser"
                    onChange={newUserOnChange} 
                    value={access}
                >
                    <option value="1">JUGADOR</option>
                    <option value="2">ADMINISTRADOR</option>
                </select>
            </div> */}
            
            {

                disbaledInputs.button
                
                ? 

                <div className="col-md-12 col-12 mt-3 d-flex justify-content-end">
                    <button type="button" className="btn btn btn-outline-primary" onClick={verifyUser} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}> Validar E-mail</button>
                    <button type="button" className="btn btn btn-outline-secondary ms-3" onClick={resetForm} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-eraser" aria-hidden="true"></i></button>
                </div>

                :
                   
                <div className="col-md-12 col-12 mt-3 d-flex justify-content-end">
                    <button type="button" className="btn btn btn-outline-primary" onClick={addUser} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-plus" aria-hidden="true"></i></button>
                    <button type="button" className="btn btn btn-outline-secondary ms-3" onClick={resetForm} style={{boxShadow: "-3px 3px 15px -2px rgba(0,0,0,0.22)"}}><i className="fa fa-eraser" aria-hidden="true"></i></button>
                </div>
            }

        </div>
    )
}