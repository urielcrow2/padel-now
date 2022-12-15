import { useContext , memo, useEffect } from 'react';
import {customeContext} from '../../context/context';
import {ContextTournaments} from '../../context/ContextTournaments';
import {TournamentsList} from './TournamentsList';
import {TournamentNewConfig} from './TournamentNewConfig';
import {TournamentDetails} from './TournamentDetails';
import {SelectPlayers} from './SelectPlayers';
import {SearchTournament} from './SearchTournament';
import {TournamentDates} from './TournamentDates';
import {SelectTeam} from './SelectTeam';
import {TeamComponent} from './TeamComponent';

const Tournaments = memo(() => {

    const { setContext } = useContext(customeContext);
    const { screen, searchTournaments } = useContext(ContextTournaments);
    
    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Torneos'
            })
        );
    },[setContext]);


    const screens = ()=>{
        switch(screen) {
            case 1:   return <TournamentsList />;
            case 2:   return <TournamentNewConfig />;
            case 3:   return <TournamentDetails />;
            case 4:   return <SelectPlayers />;
            case 5:   return <SelectTeam />;
            case 6:   return <TournamentDates />;
            case 7:   return <TeamComponent />;
            default:  return <h1>No project match</h1>;
          }
    }

    return (
        <div className="main-content">

            {
                searchTournaments && <SearchTournament />
            }
            

            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                {
                                    screens()
                                }  

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
})

export default Tournaments;
