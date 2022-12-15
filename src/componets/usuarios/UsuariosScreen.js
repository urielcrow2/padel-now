import React, {useState,useRef,useEffect,useContext} from 'react';
import {customeContext} from '../../context/context';
import { fetchCustome2 } from "../../helpers/fetch";
import { UserCarpet } from './UserCarpet';
import { GetUserHook } from './GetUserHook';
import {Load2} from '../utils/load2/Load2';
import {ButtonFloat} from '../utils/buttonFloat/ButtonFloatComponent';
import { AddUser } from './AddUser';
import { SearchUsers } from './SearchUsers';
import {waitSwal,mixinSwal,infoSwal,quetionSwal} from '../utils/swalCustome';
import {maskPhone,addChar} from '../../helpers/miselanius';

import {PerfilClubComponent} from '../perfil/PerfilClubComponent';


const UsuariosScreen = () => {
    const { setContext } = useContext(customeContext);
    const {users,setUsers,onChangeClub,idClubRef,
        usersSearch,
        setUsersSearch} = GetUserHook();
    //const [usersSearch,setUsersSearch] = useState([]);//Espejo de users para las busquedas
    const [inputSearch,setInputSearch] = useState("");//input de bsuqueda
    const [newUser,setNewUser] = useState({//form nuevo usuario
        accessUser:"1",
        aliasUser:"",
        birthUser:"",
        categoryUser:"0",
        mailUser:"",
        nameUser:"",
        numberUser:"",
    });
    const [disbaledInputs,setDisbaledInputs] = useState({
        inputs:true,
        button:true
    });

    const [filterAccessValue,setFilterAccessValue] = useState(0);

    const previusValue = useRef({//monitoreamos algun cambio en los input para mandar al backend
        access:"",
        alias:"",
        birth:"",
        category:"",
        email:"",
        name:"",
        number:"",
    });

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Jugadores-usuarios'
            })
        );
    },[setContext]);

    // useEffect(() => {//al cargarse la data de usuarios creamos la copia
    //     console.log('cambio')
    //     setUsersSearch(users.data);
    // },[setUsersSearch,users.data]);

    const updateData = (id,value,propName)=>{

        if(propName === "number")
            value = maskPhone(value);
        
        const temp = users.data.map( user => {
            if(user.id === parseInt(id))
                user[propName] = value;
            return user;
        });

        setUsers({
            ...users,
            data:temp
        });

    }

    const focus = (e,inputName)=>{
        //Guardamos el valor actual antes de que cambiemos algo en el campo
        previusValue.current[inputName] = e.target.value.trim();
    }

    const doubleClick = (e,propName)=>{      
        toggleDisabledEnabled_(e.target.name,propName,false);
    }

    const blur = async(e,inputName,propName) =>{

        if( previusValue.current[inputName] !== e.target.value.trim() ){
            
            let error = false;
            
            if(inputName === "number"){
                if(e.target.value.trim() !== "" && !e.target.value.trim().match(/^[0-9-]{14}$/)){
                    infoSwal({title: 'Teléfono no valido'});
                    error = true;
                }
            }
            else if(inputName === "email"){
                if( e.target.value.trim() === "" || !e.target.value.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)){
                    infoSwal({title: 'E-mail no valido'});
                    error = true;
                }
            }
            else if(inputName === "name"){
                if(e.target.value.trim() === "" || !e.target.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/^[a-zA-Z\s]+$/)){
                    infoSwal({title: 'Nombre no valido'});
                    error = true;
                }
            }
            
            if(error){
                updateData(e.target.name,previusValue.current[inputName],inputName);//Dejamos el campo sin modificar
                toggleDisabledEnabled_(e.target.name,propName,true);//lo desactivamos
                return;
            }
          
            waitSwal({html:'Actualizando'});

            let value = "";
            if(inputName === "name") 
                value = e.target.value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            else if(inputName === "number")
                value = e.target.value.trim().replace(/[-]/g,'');
            else
                value = e.target.value.trim();

         
            const form = {
                id : e.target.name,
                [inputName] : value
            }

           try{
                const resp = await fetchCustome2({ 
                    endpoint : '/users',
                    method :'PATCH',
                    body:form,
                    json:true
                });

                let msg = "";
                switch(inputName){
                    case 'name':
                        msg = "Nombre";
                    break;
                    case 'email':
                        msg = "E-mail";
                    break;
                    case 'number':
                        msg = "Teléfono";
                    break;
                    case 'category':
                        msg = "Categoria";
                    break;
                    case 'access':
                        msg = "Tipo de usuario";
                    break;
                    case 'birth_at':
                        msg = "Fecha de nacimiento";
                    break;
                    case 'alias':
                        msg = "Alias";
                    break;
                    default: msg = "";
                }

                if(resp.id === e.target.name){
                    toggleDisabledEnabled_(e.target.name,propName,true);//lo desactivamos
                    if(inputName === "name")
                        updateData(e.target.name,value,inputName);//Sólo para nombre porque lo limpiamos de acentos
                    return mixinSwal({ icon: 'success',title: `${msg} actualizado`});
                }
                else{
                    updateData(e.target.name,previusValue.current[inputName],inputName);//Dejamos el campo sin modificar
                    toggleDisabledEnabled_(e.target.name,propName,true);//lo desactivamos
                    return infoSwal({
                        icon: 'error',
                        title: 'Ocurrio un error',
                        text: `Error de comunicación con el servidor, intentelo más tarde` ,
                    });
                }
           } 
           catch(error){
                updateData(e.target.name,previusValue.current[inputName],inputName);//Dejamos el campo sin modificar
                toggleDisabledEnabled_(e.target.name,propName,true);//lo desactivamos
                return infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                })
           }

        }

        toggleDisabledEnabled_(e.target.name,propName,true);
    }

    const toggleDisabledEnabled_ = (id,propName,flag)=>{

        //activamos o desactivamos el campo para poder editarlo
       
        /*const temp = users.data.map( user => {
            if(user.id === parseInt(id))
                user[propName] = flag;
            return user;
        })
       
        setUsers({
            ...users,
            data:temp
        });*/

        const temp = usersSearch.map( user => {
            if(user.id === parseInt(id))
                user[propName] = flag;
            return user;
        })
       
        setUsersSearch(temp);

    }

    const deleteUser = (name,id,img)=>{

        quetionSwal(name,img,async(resp)=>{
            if(resp.isConfirmed){

                let icon = 'success';
                let title = `se eliminó a: ${name}`;

                waitSwal({html: `Eliminando a: ${name}`});
               
                const resp = await fetchCustome2( { endpoint : `/users/${id}`,method :"DELETE" } );

                if( resp[0].id === id){
                    setUsers({
                        ...users,
                        data: [
                            ...users.data.filter( user => user.id !== id )
                        ]
                    });
        
                    setUsersSearch([
                        ...usersSearch.filter( user => user.id !== id )
                    ]);
                }
                else{
                    icon = 'error';
                    title = `No se eliminó a: ${name}`;
                }

                mixinSwal({ icon,title})
            } 
        })
    }

    const searchUser = (e)=>{

        setInputSearch(e.target.value);//Actualizamos el input

        const like = new RegExp(`^.*${e.target.value}.*$`,"i");
        let temp = [ ...users.data];
        let temp2 = [];

        if(filterAccessValue !== 0){//Por el momento esta deshabilitado le filtro de tipo de usuario
            temp.forEach( user => {
                if(user.name.match(like) && user.access === filterAccessValue)
                    temp2.push(user);
            } );
        }
        else{
            temp.forEach( user => {
                if(user.name.match(like))
                    temp2.push(user);
            } );
        }

        setUsersSearch(temp2);//Cargo las coincidencias al arreglo espejo
    }

    const onChangeFilterAccess = (e)=>{

        setFilterAccessValue(parseInt(e.target.value));//actualizamos el select

        let temp = [ ...users.data];
        let temp2 = [];

        if(parseInt(e.target.value) !== 0){
            temp.forEach( user => {
                if(inputSearch === "" && user.access === parseInt(e.target.value))
                    temp2.push(user);
                else if(user.name.match(new RegExp(`^.*${inputSearch}.*$`,"i")) && user.access === parseInt(e.target.value))
                    temp2.push(user);
            });
            setUsersSearch(temp2);
        }
        else{
            if(inputSearch === "")
                setUsersSearch(temp);
            else{
                temp.forEach( user => {
                    if(user.name.match(new RegExp(`^.*${inputSearch}.*$`,"i")))
                        temp2.push(user);
                });
                setUsersSearch(temp2);
            }
        }

    }

    const validate = ()=>{

        if( newUser.nameUser.trim() === "" || newUser.mailUser.trim() === ""){
            infoSwal({title: 'Nombre y E-mail son obligatorios'});
            return true;
        }

        if(!newUser.nameUser.trim().match(/^[a-zA-ZñÑ\s]+$/)){
            infoSwal({title: 'Nombre valido'});
            return true;
        }

        if(!newUser.mailUser.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)){
            infoSwal({title: 'E-mail no valido'});
            return true;
        }

        if(newUser.numberUser.trim() !== "" && !newUser.numberUser.match(/^[0-9-]{14}$/)){
            infoSwal({title: 'Teléfono no valido'});
            return true;
        }
        
        const correoExistente = users.data.find( user => user.email === newUser.mailUser)
        if(correoExistente){
            infoSwal({title: 'E-mail ya existe'});
            return true;
        }

        return false;
    }

    const addUser = async()=>{

       if(validate())
            return;

        const form = {
            name : newUser.nameUser.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            email : newUser.mailUser.trim().toLowerCase(),
            number : newUser.numberUser.trim().replace(/[-]/g,''),
            access : newUser.accessUser,
            alias : newUser.aliasUser,
            birth_at : newUser.birthUser,
            category : newUser.categoryUser,
            club : idClubRef.current
        }

        waitSwal({html:'Guardando'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : '/users',
                method :'POST',
                body:form,
                json:true
            });

            if(!resp.id){
                if(resp.errors.email)
                    return infoSwal({title: 'E-mail ya existe'});
                
                return infoSwal({
                    icon: 'error',
                    title: 'Ocurrio un error',
                    text: `Error de comunucación con el servidor, intentelo más tarde` ,
                });
            }



            mixinSwal({ icon: 'success',title: `se agrego a: ${resp.name}`});

            const dataNewUser = {
                id:resp.id,
                access:resp.access,
                alias:resp.alias,
                birth_at:resp.birth_at,
                category:resp.category,
                email:resp.email,
                name:resp.name,
                number: resp.number,
                
                img:resp.img,
                disabledName: true,
                disabledMail: true,
                disabledNumber: true,
                disabledAccess: true,
                disabledBirth: true,
                disabledCategory: true,
                disabledAlias: true,
                btnMoreInfo : true
            }

              //Ordenamos y actualizamos a los usuario
            setUsers({
                ...users,
                data:[
                    ...users.data,
                    dataNewUser
                ].sort((a,b)=>{
                    if(a.name > b.name)
                        return 1;
                    else if(a.name < b.name)
                        return -1;
                    else
                        return 0;
                })
            })
    
            //Ordenamos y actualizamos a los usuario para hacer el filtrado de busqueda
            setUsersSearch([
                    ...usersSearch,
                    dataNewUser
                ].sort((a,b)=>{
                    if(a.name > b.name)
                        return 1;
                    else if(a.name < b.name)
                        return -1;
                    else
                        return 0;
                })
            )
    
            //Reseteamos el formulario
            setNewUser({
                accessUser:"1",
                aliasUser:"",
                birthUser:"",
                categoryUser:"0",
                mailUser:"",
                nameUser:"",
                numberUser:""
            });
            
            //Bloqueamos los botones y los inputs
            setDisbaledInputs({
                inputs:true,
                button:true
            });
        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        }
    }

    const resetForm = ()=>{
        setNewUser({//form nuevo usuario
            accessUser:"1",
            aliasUser:"",
            birthUser:"",
            categoryUser:0,
            mailUser:"",
            nameUser:"",
            numberUser:"",
        });
        setDisbaledInputs({
            inputs:true,
            button:true
        });
    }

    const verifyUser = async()=>{

        if(!newUser.mailUser.trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)){
            infoSwal({title: 'E-mail es obligatorio y debe ser valido'});
            return true;
        }

        const correoExistente = users.data.find( user => user.email === newUser.mailUser)
        if(correoExistente){
            infoSwal({title: 'El usuario con ese E-mail ya esta registrado'});
            return true;
        }

        waitSwal({html:'Espere...'});

        try{

            const resp = await fetchCustome2({ 
                endpoint : `/users/verify_email?email=${newUser.mailUser}`,
                method :'GET',
                json:true
            });

            console.log(resp);

            if(resp.email){

                if(resp.access > 1)
                    return infoSwal({title: 'El usuario con ese E-mail ya esta registrado, pero no puede ser utilizado como jugador'});

                setNewUser({
                    ...newUser,
                    aliasUser:resp.alias,
                    birthUser:resp.birth_at,
                    nameUser:resp.name,
                    numberUser:addChar(resp.number,'-',2)
                });
            
                setDisbaledInputs({
                    ...disbaledInputs,
                    button:false
                });

                return  mixinSwal({ icon: 'success',title: `El usuario existe`});;
            }

            setDisbaledInputs({
                inputs:false,
                button:false
            });

            mixinSwal({ icon: 'success',title: `El email esta disponible`});
        }
        catch(e){
            infoSwal({
                icon: 'error',
                title: 'Ocurrio un error',
                text: `Error de comunucación con el servidor, intentelo más tarde` ,
            });
        } 
    }

    const newUserOnChange = (e)=>{

        let temp = "";

        if(e.target.name === "numberUser")
            temp = maskPhone(e.target.value);
        else
            temp = e.target.value;

        setNewUser(
            {
                ...newUser,
                [e.target.name]:temp
            }
        )
    }

    const changeBtnInfo = (id)=>{
        const temp = users.data.map( user => {
            if(user.id === parseInt(id))
                user.btnMoreInfo = !user.btnMoreInfo;
            return user;
        });

        setUsers({
            ...users,
            data:temp
        });
    }

    return (
        <div className="main-content">

            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                <div className="mb-5">
                                    <PerfilClubComponent clubs={users} onChangeClub={onChangeClub}/>
                                </div>
                               
                                <AddUser 
                                    newUserOnChange={newUserOnChange} 
                                    name={newUser.nameUser} 
                                    email={newUser.mailUser} 
                                    number={newUser.numberUser} 
                                    addUser={addUser}
                                    alias={newUser.aliasUser}
                                    birth={newUser.birthUser}
                                    access={newUser.accessUser}
                                    category={newUser.categoryUser}
                                    disbaledInputs={disbaledInputs}
                                    verifyUser={verifyUser}
                                    resetForm={resetForm}
                                />
                                <hr />
                                <SearchUsers 
                                    inputSearch={inputSearch} 
                                    searchUser={searchUser} 
                                    usersSearch={usersSearch} 
                                    usersData={users.data}
                                    onChangeFilterAccess={onChangeFilterAccess}
                                    filterAccessValue={filterAccessValue}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="main-content-inner">
                <div className="card">
                    <div className ="card-body">
                        <div className="row">
    
                            {
                                    users.load ?

                                    <Load2 /> :
                                    
                                    <>
                                        {
                        
                                                usersSearch.map( user => ( 
                                                    <UserCarpet 
                                                        key={user.id}
                                                        {...user} 
                                                        deleteUser={deleteUser} 
                                                        doubleClick={doubleClick}
                                                        blur={blur}
                                                        updateData={updateData}
                                                        changeBtnInfo={changeBtnInfo}
                                                        focus={focus}
                                                    /> 
                                                )) 
                                       
                                        }

                                        <ButtonFloat hight={200}/>
                                        
                                    </>
                                }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UsuariosScreen;

