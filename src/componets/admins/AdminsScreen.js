import {useEffect,useContext} from 'react';
import {customeContext} from '../../context/context';
import {AdminCarpet} from './AdminCarpet';
import {AdminAdd} from './AdminAdd';
import {Load2} from '../utils/load2/Load2';
import {AdminHook} from './AdminHook';


const AdminsScreen = ()=>{
    const { setContext } = useContext(customeContext);
    const {
        users,
        setUsers,
        changeGeneral,
        focus,
        blur,
        deleteAdmin
    } = AdminHook();


    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Super Administradores'
            })
        );
    },[setContext]);

    return(
        <div className="main-content">


            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                <AdminAdd setUsers={setUsers} users={users}/>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className ="card-body">
                                <div className="row">
                                    {

                                        users.load ?

                                        <Load2 /> : 

                                        users.data.map(e=>{
                                            return(
                                                <AdminCarpet 
                                                    key={e.id} 
                                                    changeGeneral={changeGeneral}
                                                    blur={blur}
                                                    focus={focus}
                                                    deleteAdmin={deleteAdmin}
                                                    {...e}
                                                />
                                            )
                                        })

                                    }
                                </div>
            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminsScreen;