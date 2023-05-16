import { useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom'

function Home() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e){
    e.preventDefault();
    if (email !== '' && password !== '') {
      alert('ok');
    } else{
      alert('No ok')
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