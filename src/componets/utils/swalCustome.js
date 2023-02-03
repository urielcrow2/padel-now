import Swal from 'sweetalert2';


export const mixinSwal = (params)=>{

    const {
        icon,
        title=''
    } = params

    Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    }).fire({
        icon,
        title
    });
}

export const waitSwal = (params)=>{
    const {
        title = 'Espere...',
        html = ''
    } = params

    Swal.fire({
        title,
        html,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

export const infoSwal = (params)=>{
    const {
        icon = 'info',
        title = '',
        text = '',
        showConfirmButton = true,
        confirmButtonColor = '#3085d6',
        confirmButtonText = 'Aceptar'
    } = params;

    Swal.fire({
        icon,
        title,
        text,
        showConfirmButton,
        confirmButtonColor,
        confirmButtonText,
        allowOutsideClick: false
    });

}

export const quetionSwal = (name,img,callback)=>{
    Swal.fire({
        title: '',
        text: `Eliminar a ${name}` ,
        imageUrl: img,
        imageWidth: 100,
        imageHeight: 100,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No'
    }).then(async(result) => {
        callback(result);
    })
}

export const quetionSwal2 = (title,text,callback)=>{
    Swal.fire({
        icon :'info',
        title,
        text,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'No'
    }).then(async(result) => {
        callback(result);
    })
}

export const inputMailSwal =async (callback)=>{
    const { value: email } = await Swal.fire({
        title: 'Recuperar contraseña',
        input: 'email',
        inputLabel: 'Escribe tu nombre de usuario',
        inputPlaceholder: '...'
    });
    callback(email);
}

export const closeSwal = ()=>{
    Swal.close();
}

export const subirBajarSwal = async(callback)=>{
    const { value: cantidad} = await Swal.fire({
        title: 'Subir y bajar jugadores por cancha',
        input: 'select',
        inputOptions: {
        '1': 'Uno por cancha',
        '2': 'Dos por cancha',
        },
        // inputPlaceholder: 'Cuantos jugadores',
        showCancelButton: true
    });
    callback(cantidad);
}
