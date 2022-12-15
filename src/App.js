import {useState} from 'react';
import { Provider } from 'react-redux';
import { store } from './store/stores';
import { RoutApp } from './routes/RoutApp';
import { customeContext, initValue } from './context/context';

export const App = () =>{

    const [context, setContext] = useState(initValue);
    
    return (
        <Provider store = {store}>
            <customeContext.Provider value={{context,setContext}}>
                <RoutApp />
            </customeContext.Provider>
        </Provider>
    )
   

}