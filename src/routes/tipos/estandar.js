import { Suspense, lazy } from 'react';
import { Load } from '../../componets';
import {TournamentsProviderVs} from '../../context/ContextTournamentsVs';
const HomeScreen = lazy(() => import('../../componets/home/HomeScreen'));
const PerfilScreen = lazy(() => import('../../componets/perfil/PerfilScreen'));
const GeneralTableScreen = lazy(() => import('../../componets/generalTable/GeneralTableScreen'));
const TimeScreen = lazy(() => import('../../componets/time/TimeScreen'));


export const rutasEstandar = [
    {
        path: '/inicio',
        element: (<Suspense fallback={<Load/>}> <HomeScreen /> </Suspense>)
    },
    {
        path: '/cuenta',
        element: (<Suspense fallback={<Load/>}> <PerfilScreen /> </Suspense>)
    },
    {
        path: '/horarios',
        element: (  <Suspense fallback={<Load/>}> 
                        <TournamentsProviderVs>
                            <TimeScreen /> 
                        </TournamentsProviderVs>
                    </Suspense>)
    },
    {
        path: '/tabla-general',
        element: (<Suspense fallback={<Load/>}> <GeneralTableScreen /> </Suspense>)
    },
]
