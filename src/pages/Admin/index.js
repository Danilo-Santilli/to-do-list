import './admin.css';
import {useState, useEffect} from 'react';
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import { 
    addDoc,
    collection
} from 'firebase/firestore';

export default function Admin(){

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});

    useEffect(()=>{
         // Função assíncrona para carregar os detalhes do usuário armazenados no localStorage
        async function LoadTarefas(){
            const userDetail = localStorage.getItem('@detailUser');

            // Parse do JSON armazenado para objeto e atualização do estado do usuário
            setUser(JSON.parse(userDetail))
        }

        LoadTarefas();
    }, []);

    async function handleRegister(e){
        e.preventDefault();

        // Verificação se o campo de entrada da tarefa está vazio
        if (tarefaInput === '') {
            alert('Digite sua tarefa.');
            return;
        }

        // Adicionar um novo documento à coleção "tarefas" usando a função addDoc do Firebase Firestore
        await addDoc(collection(db, 'tarefas'),{
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid // UID do usuário atualmente logado
        })
        .then(()=>{
            console.log('Tarefa registrada');
            setTarefaInput('');
        })
        .catch((error)=>{
            console.log(`Erro: ${error}`);
        })
    }

    // Deslogar o usuário usando o Firebase Authentication
    async function handleLogout(){
        await signOut(auth);
    }

    return(
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>
            <form className='form' onSubmit={handleRegister}>
                <textarea 
                placeholder='Digite sua tarefa:'
                value={tarefaInput}
                onChange={(e)=>{setTarefaInput(e.target.value)}}>
                </textarea>

                <button className='btn-register' type='submit'>Registrar tarefa</button>
            </form>

            <article className='list'>
                <p>Estudar React</p>
                <div>
                    <button>Editar</button>
                    <button className='btn-delete'>Excluir</button>
                </div>
            </article>

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}