import { Suspense, lazy } from 'react';
import { Load } from '../../componets';
import {TournamentsProvider} from '../../context/ContextTournaments';
import {TournamentsProviderVs} from '../../context/ContextTournamentsVs';
const HomeScreen = lazy(() => import('../../componets/home/HomeScreen'));
const UsuariosScreen = lazy(() => import('../../componets/usuarios/UsuariosScreen'));
const PerfilScreen = lazy(() => import('../../componets/perfil/PerfilScreenAdmins'));
const ClubsScreen = lazy(() => import('../../componets/clubs/ClubsScreen'));
const AdminsScreen = lazy(() => import('../../componets/admins/AdminsScreen'));
// const TimeScreen = lazy(() => import('../../componets/time/TimeScreen'));
// const GeneralTableScreen = lazy(() => import('../../componets/generalTable/GeneralTableScreen'));
const Tournaments = lazy(() => import('../../componets/tournaments/Tournaments'));


export const rutasSuperAdministrador = [
    {
        path: '/administradores',
        element: (<Suspense fallback={<Load/>}> <AdminsScreen /> </Suspense>)
    },
    {
        path: '/clubs',
        element: (<Suspense fallback={<Load/>}> <ClubsScreen /> </Suspense>)
    },
    {
        path: '/cuenta',
        element: (<Suspense fallback={<Load/>}> <PerfilScreen /> </Suspense>)
    },
    {
        path: '/inicio',
        element: (<Suspense fallback={<Load/>}> <HomeScreen /> </Suspense>)
    },
    /*{
        path: '/horarios',
        element: (<Suspense fallback={<Load/>}> 
                <TournamentsProviderVs>
                    <TimeScreen /> 
                </TournamentsProviderVs>
                </Suspense>)
    },*/
    {
        path: '/usuarios',
        element: (<Suspense fallback={<Load/>}> <UsuariosScreen /> </Suspense>)
    },
    /*
    {
        path: '/tabla-general',
        element: (<Suspense fallback={<Load/>}> <GeneralTableScreen /> </Suspense>)
    },*/
    {
        path: '/torneos',
        element: (  <Suspense fallback={<Load/>}>
                        <TournamentsProvider>
                            <TournamentsProviderVs>
                                <Tournaments /> 
                            </TournamentsProviderVs>
                        </TournamentsProvider>
                    </Suspense>)
    }
];

