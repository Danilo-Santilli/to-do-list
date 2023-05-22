import './admin.css';
import {useState, useEffect} from 'react';
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import { 
    addDoc,
    collection,
    onSnapshot,
    query, 
    orderBy,
    where
} from 'firebase/firestore';

export default function Admin(){

    const [tarefaInput, setTarefaInput] = useState(''); // Estado para armazenar o valor do campo de entrada da tarefa
    const [user, setUser] = useState({}); // Estado para armazenar os detalhes do usuário
    const [tarefas, setTarefas] = useState([]); // Estado para armazenar a lista de tarefas
    
    useEffect(() => {
      async function LoadTarefas() {
        // Função assíncrona para carregar as tarefas relacionadas ao usuário atual do Firestore
        const userDetail = localStorage.getItem('@detailUser');
        setUser(JSON.parse(userDetail)); // Parse do JSON armazenado para objeto e atualização do estado do usuário
    
        if (userDetail) {
          const data = JSON.parse(userDetail);
          const tarefaRef = collection(db, 'tarefas');
    
          // Query para buscar as tarefas do usuário atual, ordenadas por data de criação decrescente
          const q = query(
            tarefaRef,
            orderBy('created', 'desc'),
            where('userUid', '==', data?.uid)
          );
    
          // Adiciona um observador às tarefas da query
          const unsub = onSnapshot(q, (snapshot) => {
            let lista = [];
    
            snapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                tarefa: doc.data().tarefa,
                userUid: doc.data().userUid,
              });
            });
    
            console.log(lista);
            setTarefas(lista); // Atualiza o estado das tarefas com a lista de tarefas obtida
          });
        }
      }
    
      LoadTarefas(); // Chamada da função para carregar as tarefas quando o componente é montado
    }, []);

    async function handleRegister(e){
        e.preventDefault();

        if (tarefaInput === '') {
            alert('Digite sua tarefa.');
            return;
        }

        await addDoc(collection(db, 'tarefas'),{
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid 
        })
        .then(()=>{
            console.log('Tarefa registrada');
            setTarefaInput('');
        })
        .catch((error)=>{
            console.log(`Erro: ${error}`);
        })
    }

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