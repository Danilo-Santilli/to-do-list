import { useState, useEffect } from "react";
import { auth } from '../firebaseConnection';
import { onAuthStateChanged } from "firebase/auth";
import {Navigate} from 'react-router-dom';

export default function Private(children){

    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);

    useEffect(()=>{
        async function checkLogin(){
            const unsub = onAuthStateChanged(auth, (user)=>{
            // onAuthStateChanged é uma função do Firebase Authentication que observa as alterações no estado de autenticação do usuário

                if (user) {
                // Se o usuário estiver logado

                    const userData = {
                        uid: user.uid,
                        email: user.email,
                    }

                    localStorage.setItem('@detailUser',JSON.stringify(userData));
                    
                    // Definir o estado de loading como false, indicando que o carregamento foi concluído
                    setLoading(false);

                    // Definir o estado de signed como true, indicando que o usuário está logado
                    setSigned(true);
                }else{
                    setLoading(false);
                    setSigned(false);
                }
            })
        }

        // Chamar a função checkLogin uma vez, quando o componente for montado
        checkLogin();
    }, []);

    // Se o carregamento estiver em andamento, retornar um elemento vazio ou uma mensagem de carregamento
    if (loading) {
        return(
            <div></div>
        )
    }
    
    // Se o usuário não estiver logado, redirecionar para a página de login ou uma rota específica
    if (!signed) {
        return <Navigate to='/'/>
    }
    
    // Se o usuário estiver logado, renderizar os filhos do componente Private (Página Admin, declarada em routes)
    return children;
}