import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


firebase.initializeApp({
    apiKey: "AIzaSyDfIy7C_vJUwgqdAylzNZWwhVmfY3Uw4wQ",
    authDomain: "tcg2-692e8.firebaseapp.com",
    projectId: "tcg2-692e8",
    storageBucket: "tcg2-692e8.appspot.com",
    messagingSenderId: "668150010173",
    appId: "1:668150010173:web:fe85c40b4066532d17f554",
    measurementId: "G-774NYW9VMH"
})

  const firestore = firebase.firestore();
  const auth = firebase.auth();

async function addNewDeck(user, deckName) {
    //console.log(userId);
    try {
      // Create a new deck document
      const userDeckRef = firestore.collection('userDecks');
      
      const existingDeckQuery = userDeckRef.where('userUid', '==', user.uid).where('deckName', '==', deckName).where('email', '==', user.email);
      const existingDeckSnapshot = await existingDeckQuery.get();
    
        if (!existingDeckSnapshot.empty) {
        console.log('Deck already exists for the user with the same name.');
        return;
        }

      const deckData = {
        userUid: user.uid,
        deckName: deckName,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        cards: []
      };

      await userDeckRef.add(deckData);
      
      console.log('New deck added successfully!');
    } catch (error) {
      console.error('Error adding new deck:', error);
    }
}
//<Link to ='/deckcardspage' onClick={addNewDeck(user.uid,"shesh")}>Create a new deck</Link>        

function AllDecks(user)
{
  const [userDecks, setUserDecks] = React.useState([]);
  const curUser = user.user;
  const userDeckRef = firestore.collection('userDecks');
    if(curUser != null)
    {
      
      const query = userDeckRef.get();
      const fetchData = async () => {
        try {
         
          const querySnapshot = await query;
        if (!querySnapshot.empty) {
          const decks = querySnapshot.docs.map((doc) => doc.data());
          //console.log(decks);
          setUserDecks(decks);
          return decks;
        }
      } catch (error) {
        console.log(error);
      }

      
    };  
    
    const allUserDecks = fetchData();
    allUserDecks.then((result) => 
    {
      //console.log(result);
      setUserDecks(result);
    })

    //console.log(userDecks);
    const renderDecks = () => {
      const listItems = [];
      for(let i = 0 ; i < userDecks.length; i++)
      {
        const deck = userDecks[i];
        //console.log(user.user.email);
        if(deck.email == user.user.email)
        {
        const ecc = encodeURIComponent(deck.deckName);
        listItems.push(
          <li>
              <div>
                <p><Link to={'/deckcardspage/' + ecc} onClick={() => addNewDeck(curUser, deck.deckName)}>{deck.deckName}</Link>  </p>
              </div>
          </li>
          );
        }
      }

      return listItems;
    }
    return (
        <div>
        <p>heck yeah</p>
        <Link to ={'/deckcardspage/' + encodeURIComponent("New Deck")} onClick={() => addNewDeck(curUser, "New Deck")}>Create a new deck</Link>   
        <ul>{renderDecks()}</ul>   
        </div>
    )
    }
}



const UserDeckPage = {
   AllDecks
}

export default UserDeckPage;