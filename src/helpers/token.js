
export const nameToken = 'Authorization';

export const getToken = ()=>{
    return JSON.parse(localStorage.getItem(nameToken)) || null;
}

export const setToken = (token) =>{
    localStorage.setItem(nameToken,JSON.stringify(token));
}
