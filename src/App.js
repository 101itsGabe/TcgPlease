import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
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
        <Route exact path='/card/:photoUrl' element={<DeckPage.CardPage />}/>
        <Route exact path='/deckcardspage' element={<DeckCardsPage/>}/>
      </Routes>
    </Router>
  );
}


function DeckCardsPage()
{

  return DeckPage.ShowLegalCards();
}





function UserPage()
{
  const user = auth.currentUser;
  return(
    <>
      <header>
          <p><img src={user.photoURL}/>{user.email}</p>
      </header>
      <Link to ='/sets'
              >Click here for all sets</Link>
        <br/>
        <Link to ='/freak'>Freak you</Link>
        <br/>
        <Link to ='/deckcardspage'>Deck Cards Page</Link>
        <br/>
        <SignOut/>
    </>
  )
}
/*
function SignIn()
{
  const navigate = useNavigate();
  const usersRef = firestore.collection("users");
    const query = usersRef.orderBy('createdAt');
    const [users] = useCollectionData(query, {idField: 'id'});

  const signInWithGoogle = async() => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    console.log('Inside first sign in');
    console.log(users);
    await ifUser(users);
    
    navigate('/userpage');
  }

  return(
    <button onClick={signInWithGoogle}>Sign In With Google</button>
  )
}
*/

function SignIn() {
  const navigate = useNavigate();
  const usersRef = firestore.collection("users");
  const query = usersRef.orderBy('createdAt');
  const [users, loading] = useCollectionData(query, { idField: 'id' });

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    if (!loading && users) {
      await ifUser(users);
    }
    navigate('/userpage');
  }

  React.useEffect(() => {
    if (users && !loading) {
      console.log('Inside useEffect');
      console.log(users);
    }
  }, [users, loading]);

  return (
    <div className="signinbtn">
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
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

/*

  Functions for Sing in

*/
function extractUsername(user){
  let username = '';
  console.log('inside extractUseraname');
  console.log(user)
  for (let i = 0; i < user.email.length; i++) {
    if (user.email[i] === '@') {
      break;
    }
    username += user.email[i];
  }
  return username;
};

function userExsist (user, users)
  {
    console.log("CHECKING NIGGA");
    for(let i = 0; i < users.length; i++)
    {
      if(users[i].email == user.email)
        return true;
    }
    return false
  }

async function ifUser(users)
{
  const user = auth.currentUser;
  const usersRef = firestore.collection("users");
  const query = usersRef.orderBy('createdAt');
  console.log(users);




  if(user && !userExsist(user,users)) {
    console.log('Does not exists');
    await usersRef.add(
    {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      email: user.email,
      photoURL: user.photoURL,
      username: extractUsername(user)
    }
  )
  }



}

/*

 Sign Out

*/
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
