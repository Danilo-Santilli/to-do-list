import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBJMbzfcF05F5Ccr0iyhPJ3g9k6zdmM8cM",
    authDomain: "curso-react-udemy-d7009.firebaseapp.com",
    projectId: "curso-react-udemy-d7009",
    storageBucket: "curso-react-udemy-d7009.appspot.com",
    messagingSenderId: "241209447663",
    appId: "1:241209447663:web:87ee2d08c031e1a7ad771a",
    measurementId: "G-D32HXZRPXH"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export {db, auth};