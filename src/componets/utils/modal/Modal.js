import './modal.css';



export const Modal = ({children,modal = false,setModal,callback = ()=>{} })=>{

    const closeWindow = ()=>{
        setModal(false);
        callback();
    }

    return(

        modal

        ?

        <div className="modal-crow-main">
            <div className="modal-crow">
                <div className="modal-crow-contain">
                    {children}
                </div>
                <div className="modal-crow-footer">
                    <div className="modal-align-end">
                        <button type="button" className="btn-modal btn-default-modal" onClick={closeWindow/*()=>setModal(false)*/}> Salir</button>
                    </div>
                </div>
            </div>
        </div>

        :

        <></>

    );
}