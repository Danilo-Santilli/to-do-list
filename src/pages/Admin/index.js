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
    doc, 
    updateDoc
} from 'firebase/firestore';

export default function Admin(){

    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [edit, setEdit] = useState({});
    
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
        
        //Se o estado 'edit' possuir um 'id', ele está no modo de edição
        if (edit?.id) {
            handleUpdateTarefa();//chama a função de update
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
        const docRef = doc(db, 'tarefas', id);
        await deleteDoc(docRef);
    }

    async function editTarefa(item){
        setTarefaInput(item.tarefa);
        setEdit(item);
    }

    async function handleUpdateTarefa() {
        // Obtém a referência do documento da tarefa no banco de dados usando o ID da tarefa que está sendo editada
        const docRef = doc(db, 'tarefas', edit?.id);
      
        // Atualiza o documento da tarefa com os novos dados, neste caso, apenas a propriedade "tarefa" será atualizada
        await updateDoc(docRef, {
          tarefa: tarefaInput,
        })
          .then(() => {
            // Se a atualização for bem-sucedida, exibe uma mensagem de sucesso no console
            console.log('Tarefa Atualizada');
      
            // Limpa o campo de entrada da tarefa e redefine o objeto "edit" para vazio
            setTarefaInput('');
            setEdit({});
          })
          .catch((error) => {
            // Se ocorrer um erro durante a atualização, exibe uma mensagem de erro no console
            console.log(`Erro: ${error}`);
      
            // Limpa o campo de entrada da tarefa e redefine o objeto "edit" para vazio
            setTarefaInput('');
            setEdit({});
          });
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

                {Object.keys(edit).length > 0 ? (
                    // Se o objeto "edit" tiver alguma propriedade (ou seja, a tarefa está em modo de edição),
                    // renderiza o botão "Atualizar tarefa" com estilo de fundo personalizado
                    <button className='btn-register' style={{backgroundColor: '#6add39'}} type='submit'>Atualizar tarefa</button>
                ) : (
                    // Caso contrário, renderiza o botão "Registrar tarefa" padrão
                    <button className='btn-register' type='submit'>Registrar tarefa</button>
                )}
            </form>

            {tarefas.map((item)=>(
                <article key={item.id} className='list'>
                    <p>{item.tarefa}</p>
                    <div>
                        <button onClick={()=> editTarefa(item)}>Editar</button>
                        <button onClick={()=>deleteTarefa(item.id)} className='btn-delete'>Concluir</button>
                    </div>
                </article>
            ))}
            

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}