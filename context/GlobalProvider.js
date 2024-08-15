import React, {createContext , useContext, useState, useEffect} from 'react';

import { getCurrentUser } from '../lib/appwrite';

const GlobalContext =  createContext ();
export const useGlobalContext =() => useContext (GlobalContext);

const GlobalProvider = ({ children })  => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect (() =>{
        getCurrentUser()
        .then((res) =>{
        if(res){
            setIsLoggedIn(true);
            setUser(res);
        }
        else{
            setIsLoggedIn(false);
            setUser(null);
        }
    })
    .catch((error) =>{
        console.log(error);
    })

    .finally(() =>{
        setLoading(false);
    })
    }, []);

    return (
        <GlobalContext.Provider
            value ={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;