import {useEffect,useContext,useState} from 'react';
import {customeContext} from '../../context/context';
import {ClubCarpet} from './ClubCarpet';
import {ClubsHook} from './ClubsHook';
import {Load2} from '../utils/load2/Load2';
import {AddClub} from './AddClub';
import {EditLogoClub} from './EditLogoClub';

const ClubsScreen = ()=>{

    const { setContext } = useContext(customeContext);
    const { 
        clubs,
        setClubs,
        changeGeneral,
        //changeGeneralRoot,
        blur,
        //blurRoot,
        focus,
        deleteClub,
        saveAdminRootFirstTime
    } = ClubsHook();

    const [editImage, setEditImage] = useState({
        id:'',
        img:'',
        club:''
    });

    useEffect(() => {
        setContext( context => (
            {   ...context,
                titlePage : 'Clubs'
            })
        );
    },[setContext]);

    const newClub = (newClub) =>{

        const temp = [
            ...clubs.data,
            newClub
        ];

        temp.sort((a,b) => {
            if(a.club > b.club)
                return 1;
            if(a.club < b.club)
                return -1;
            return 0;
        });

        setClubs({
            ...clubs,
            data:temp
        });
    }

    const updateClubs = (id,img)=>{
        const temp = [
            ...clubs.data
        ];

        temp.forEach( club => {
            if(club.id === id)
                club.img = img;
        });
        
        setClubs({
            ...clubs,
            data:temp
        })
    }

    const changeImgClub = (id,img,club)=>{
        setEditImage({
            id,
            img,
            club
        });
    }

    return(
        <div className="main-content">


            <div className="main-content-inner">
                <div className="row">
                    <div className="col-lg-12 mt-3">
                        <div className="card">
                            <div className ="card-body">

                                <AddClub newClub={newClub} />
                                
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

                                        clubs.load ?

                                        <Load2 /> : 

                                        clubs.data.map(e=>{
                                            return(
                                                <ClubCarpet 
                                                    key={e.id} 
                                                    changeGeneral={changeGeneral}
                                                    blur={blur}
                                                    focus={focus}
                                                    deleteClub={deleteClub}
                                                    saveAdminRootFirstTime={saveAdminRootFirstTime}
                                                    changeImgClub={changeImgClub}
                                                    {...e}
                                                />
                                            )
                                        })

                                    }

                                    {
                                        editImage.id
                                        &&
                                        <EditLogoClub editImage={editImage} updateClubs={updateClubs}/>
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

export default ClubsScreen;