import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, Routes, Navigate } from 'react-router-dom';
import PokeApi from './PokeApi';
import SetsPage from './Pages/SetsPage';
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from  'react-firebase-hooks/firestore';
import { useNavigate } from 'react-router-dom';
import DeckPage from './Pages/DeckPage';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



firebase.initializeApp({
  apiKey: "AIzaSyDfIy7C_vJUwgqdAylzNZWwhVmfY3Uw4wQ",
  authDomain: "tcg2-692e8.firebaseapp.com",
  projectId: "tcg2-692e8",
  storageBucket: "tcg2-692e8.appspot.com",
  messagingSenderId: "668150010173",
  appId: "1:668150010173:web:fe85c40b4066532d17f554",
  measurementId: "G-774NYW9VMH"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  const [user] = useAuthState(auth);
 

  
  return (
    <Router>
      <div className="App">
        {user ?
        <header>
          <p><img src={user.photoURL}/>{user.email}</p>
        </header>:<p></p>
        }
        {user ? 
        <>
        
        </>
        :
        <>
        </>
      }

      
      </div>
      <Routes>
        <Route exact path='/sets' element={<SetPage/>}/>
        <Route exact path='/freak' element={<Freak/>}/>
        <Route exact path='/signin' element={<SignIn/>}/>
        <Route exact path='/userpage' element={<UserPage/>}/>
        <Route exact path='/' element={user ? <Navigate to='/userpage'/> : <Navigate to='/signin'/>}/>
        <Route exact path='/uh' element={<Uh/>}/>
      </Routes>
    </Router>
  );
}


function Uh()
{
  return DeckPage.ShowLegalCards();
}

function UserPage()
{
  return(
    <>
      <Link to ='/sets'
              >Click here for all sets</Link>
        <br/>
        <Link to ='/freak'>Freak you</Link>
        <br/>
        <Link to ='/uh'>duh</Link>
        <br/>
        <SignOut/>
    </>
  )
}

function SignIn()
{
  const navigate = useNavigate();
  const usersRef = firestore.collection("users");
  const query = usersRef.orderBy('createdAt');
  const [user] = useAuthState(auth);
  const [users] = useCollectionData(query, {idField: 'id'});

  const signInWithGoogle = async() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    
    const {uid, photoURL, email} = auth.currentUser;
    
    
    const extractUsername = (email) => {
      let username = '';
      console.log('inside extractUseraname');
      console.log(email)
      for (let i = 0; i < email.length; i++) {
        if (email[i] === '@') {
          break;
        }
        username += email[i];
      }
      return username;
    };

   
    if(!userExsist(email)) {
      console.log('Does not exists');
    await usersRef.add(
      {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        email,
        photoURL,
        username: extractUsername(email)
      }
    )
    }
    
    navigate('/userpage');
  }


  const userExsist = (email) =>
  {
    console.log("CHECKING NIGGA");
    console.log(typeof(users));
    for(let i = 0; i < users.length; i++)
    {
      console.log(users[i].email);
      if(users[i].email == email)
        return true;
    }
    return false
  }
  
  return(
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}
function SetPage()
{
  return SetsPage.ShowAllSets();
}

function Freak()
{
  return(
    <>
    <p>Yeah freak you thought maybe</p>
    </>
  );
}

function SignOut()
{
  
  const navigate = useNavigate();
  const [user] = useAuthState(firebase.auth());

  return auth.currentUser && (
    <button onClick={() => {
       auth.signOut();
       navigate('/signin');
      }
      }>Sign Out</button>
  )
}


export default App;
