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
    where,
    deleteDoc,
    doc
} from 'firebase/firestore';

export default function Admin(){

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [tarefas, setTarefas] = useState([]);
    
    useEffect(() => {
      async function LoadTarefas() {
        const userDetail = localStorage.getItem('@detailUser');
        setUser(JSON.parse(userDetail));
    
        if (userDetail) {
          const data = JSON.parse(userDetail);
          const tarefaRef = collection(db, 'tarefas');
    
          const q = query(
            tarefaRef,
            orderBy('created', 'desc'),
            where('userUid', '==', data?.uid)
          );
    
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
            setTarefas(lista);
          });
        }
      }
    
      LoadTarefas();
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

    async function deleteTarefa(id){
        // Referência ao documento da tarefa no Firestore
        const docRef = doc(db, 'tarefas', id);

        // Deleta o documento da tarefa
        await deleteDoc(docRef);
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

            {/*Passa por todos os elementos dentro do estado 'tarefas' e exibe no 'article'*/}
            {tarefas.map((item)=>(
                <article key={item.id} className='list'>
                    <p>{item.tarefa}</p>
                    <div>
                        <button>Editar</button>

                        {/* Botão para concluir/deletar a tarefa */}
                        <button onClick={()=>deleteTarefa(item.id)} className='btn-delete'>Concluir</button>
                    </div>
                </article>
            ))}
            

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}