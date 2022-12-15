

export const SearchUsers = ({inputSearch,searchUser,usersSearch,usersData,onChangeFilterAccess,filterAccessValue})=>{
    return(
        <div className="row mt-3">
            <div className="col-md-4">
                <div className="row card-counter primary">
                    <div className="col-4">
                        <i className="fa fa-users fa-3x"></i>
                    </div>
                    <div className="col-8">
                        <span className="count-name">Jugadores: </span>
                        <span className="count-numbers">{ usersSearch.length }</span>
                    </div>
                </div>
            </div>
            <div className="col-md-8 col-12 mt-md-1 mt-3 position-relative">
                <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Buscar por nombre</span>
                <input type="text"  className="form-control text uppercase" value={inputSearch} onChange={searchUser}/>

                {/* <div className="col-md-12 position-relative mt-3">
                    <span style={{position:"absolute",top:-12,left:25,background:"#fff",padding: "0 10px",color:"#ccc"}}>Tipo usuario</span>
                    <select 
                        className="form-control" 
                        name="filterAccess"
                        onChange={onChangeFilterAccess} 
                        value={filterAccessValue}
                    >
                        <option value="0">TODOS</option>
                        <option value="1">JUGADOR</option>
                        <option value="3">ADMINISTRADOR</option>
                    </select>
                </div> */}


            </div>
        </div>
    )
}