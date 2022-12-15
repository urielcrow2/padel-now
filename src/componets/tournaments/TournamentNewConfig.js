import { useContext } from 'react';
import {ContextTournaments} from '../../context/ContextTournaments';
import {useForm,configInput,validateCustome} from '../../hooks/useForm';
import {mixinSwal} from '../utils/swalCustome';

export const TournamentNewConfig = ()=>{

    const { setScreen,setSearchTournaments,setFormData,formData } = useContext(ContextTournaments);

    const {
        name="",
        players="",
        journals=3,
        initial_date="",
        final_date="",
        players_by_court=4
    } = formData.generals;

    const [form,updateForm,changeInput,focus,blur] = useForm({
        name : configInput( {val:name, type:"text", required: true,focus: name ? true : false}),
        players: configInput( {val:players, type:"number", required: true,focus: players ? true : false}),
        journal: configInput( {val:journals, type:"number", required: true,focus: journals ? true : false}),
        dateStart: configInput( {val: initial_date, type:"date",focus:  initial_date ? true : false}),
        dateEnd: configInput( {val:final_date, type:"date",focus: final_date ? true : false}),
        playersForCourt: configInput( {val:players_by_court, type:"number", required: true,focus: players_by_court ? true : false})
    });

    const sendSubmit = async(e)=>{
        e.preventDefault();

        if(validateCustome(form,updateForm))
            return
        
        const formData = {
            name:form.name.val,
            players:Math.abs(form.players.val),
            journals:Math.abs(form.journal.val),
            initial_date:form.dateStart.val,
            final_date:form.dateEnd.val,
            courts:parseInt(Math.abs(form.players.val)) / parseInt(Math.abs(form.playersForCourt.val)),
            players_by_court:Math.abs(form.playersForCourt.val)
        }

        mixinSwal({ icon: 'success',title: `Avance guardado`});

        const generateJournals = [];
        const totalJournals = parseInt(formData.journals);
        for(let i=0; i < totalJournals ;i++){

            const courts = {};
            const totalCourtNumber = parseInt(formData.courts);

            for(let i=0; i < totalCourtNumber ;i++){
                courts[i+1] = {
                    date:"",
                    time:""
                }
            }

            generateJournals.push(courts)
        }

        setFormData(data =>({
            ...data,
            generals:formData,
            journals:generateJournals

        }));
        
        setScreen(4);
    }

    const cancelNewTournament = ()=>{
        setScreen(1);
        setSearchTournaments(true);
    }

    return(
        <>
        
            <button type="button" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center" onClick={ cancelNewTournament }><i className="fa fa-2x fa-arrow-left me-2" aria-hidden="true"></i> Lista de torneos</button>
            <h4 className="text-center mb-5"> Crear nuevo torneo paso 1 de 4 </h4>

            <form onSubmit={sendSubmit}>
                <div className="row">

                    <div className="form-gp col-md-12">
                        <label className={form.name.focus ? 'focusActive' : ''}>Nombre del torneo</label>
                        <input name="name" type="text" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.name.val} autoComplete="off"/>
                        <i className="fa fa-tag fa-fw"></i>
                        <div className="text-danger">{ form.name.error && 'Obligatorio' }</div>
                    </div>

                    <div className="form-gp col-md-6">
                        <label className={form.players.focus ? 'focusActive' : ''}>Número jugadores</label>
                        <input name="players" type="number" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.players.val} min="4" autoComplete="off"/>
                        <i className="fa fa-users fa-fw"></i>
                        <div className="text-danger">{ form.players.error && 'Obligatorio y deben ser múltiplos de 4' }</div>
                    </div>

                    <div className="form-gp col-md-6">
                        <label className={form.journal.focus ? 'focusActive' : ''}>Número jornadas</label>
                        <input name="journal" type="number" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.journal.val} min="1" autoComplete="off"/>
                        <i className="fa fa-sort-numeric-asc fa-fw"></i>
                        <div className="text-danger">{ form.journal.error && 'Obligatorio y al menos 1 jornada' }</div>
                    </div>

                    
                    <div className="form-gp col-md-6 custome-date">
                        <label className="focusActive">Fecha inicio</label>
                        <input name="dateStart" type="date" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.dateStart.val} autoComplete="off" style={{padding:'0!important'}}/>
                        <div className="text-danger">{ form.dateStart.error && 'Obligatorio' }</div>
                    </div>

                    <div className="form-gp col-md-6 custome-date">
                        <label className="focusActive">Fecha fin</label>
                        <input name="dateEnd" type="date" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.dateEnd.val} autoComplete="off" style={{padding:'1px!important'}}/>
                        <div className="text-danger">{ form.dateEnd.error && 'Obligatorio' }</div>
                    </div>

                    <div className="form-gp col-md-6">
                        <label className={form.playersForCourt.focus ? 'focusActive' : ''}>Jugadores por cancha</label>
                        <input name="playersForCourt" type="number" onChange={changeInput} onFocus={focus} onBlur={blur} value={form.playersForCourt.val} min="4" readOnly={true} autoComplete="off"/>
                        <i className="fa fa-list-ol fa-fw"></i>
                        <div className="text-danger">{ form.playersForCourt.error && 'Obligatorio' }</div>
                    </div>

                    <div className="col-12 mt-4 d-flex justify-content-center">
                        <button type="submit" className="btn btn-outline-dark me-2 mb-md-0 mb-2 d-flex align-items-center"> Ir a paso 2 <i className="fa fa-2x fa-arrow-right ms-3" aria-hidden="true"></i></button>
                    </div>

                </div>
            </form>

        </>
    )

}