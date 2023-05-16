import { useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();
    if (email !== '' && password !== '') {
      await signInWithEmailAndPassword(auth, email, password)
      .then(()=>{
        navigate('/admin', { replace: true })
      })
      .catch((error)=>{
        console.log('Erro!')
      })
    } else{
      alert('Preencha todos os campos!')
    }
  }
  
  return (
    <div className='home-container'>
      <h1>Lista de Tarefas</h1>
      <span>Crie sua lista de forma fácil.</span>
        
      <form action="" className='form' onSubmit={handleLogin}>
        <input 
        type="text" 
        placeholder='Digite seu email:'
        value={email}
        onChange={(e)=> setEmail(e.target.value)}/>
        
        <input 
        type="password" 
        placeholder='Digite sua senha:'
        value={password}
        onChange={(e)=> setPassword(e.target.value)}/>

        <button type='submit'>Acessar</button>
      </form>

      <Link className='button-link' to='/register'>
        Não possui uma conta? Crie uma agora!
      </Link>
    </div>
  );
}
  
export default Home;