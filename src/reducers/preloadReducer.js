import {types} from '../types/types'


/********
 STATE
 {
    active
 }
 ********/

export const preloadReducer = (state = {active:true}, action)=>{
  
    switch (action.type) {

        case types.preload:
            return{
                active:action.payload
            }

        default:
            return state;
    }
    
}