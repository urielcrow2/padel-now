import {createContext,useState} from 'react';

export const ContextTournaments = createContext();

export const TournamentsProvider = ({children})=>{
    const [screen,setScreen] = useState(1);//indicamos la pantalla a amostrar
    const [searchTournaments, setSearchTournaments] = useState(true);//mostrmos u ocultamos el buscador de torneos
    const [tournamentsContext,setTournamentsContext] = useState({
        total:0,
        id:0,
        status:1,
        onChangeClub:null,//controlo los cambios del club
        tournaments:{
            list:[],
            load:false
        }, //pasa toda la data donde se incluyen los clubs
        idClub : false//id de club seleccionado
    }); //controlamos el total de torneos, el tipo de torneo y el id del torneo en el buscador de torneos
    const [tournamentsSelect,setTournamentsSelect] = useState([]);//recargar el select
    const [formData,setFormData] = useState({
        generals:{},
        users:[],//Guardamos la lista de todos los jugadores (seleccionados y no)
        journals:[],
        totalSelected:0,
        usersTeams:[],//GUardamos sólo los jugadores que fueron seleccionados
        totalUsersByTeam:[],
        activeTeam:0
    });//guardar los datos en el avance de la creación del torneo
    const [idTournamentDetail,setIdTournamentDetail] = useState(0);//Guardamos el id del torneo que se quiere visualizar
    const [showResumen,setShowResumen] = useState(true);//Mustra u oculta el detalle de cada partido, resumen de quien jugo con cada quien en la cancha x
  
    return (
        <ContextTournaments.Provider value={{
            screen,setScreen,
            searchTournaments,setSearchTournaments,
            tournamentsContext,setTournamentsContext,
            tournamentsSelect,setTournamentsSelect,
            formData,setFormData,
            idTournamentDetail,setIdTournamentDetail,
            showResumen,setShowResumen
        }}>
            {children}
        </ContextTournaments.Provider>
    )
}

