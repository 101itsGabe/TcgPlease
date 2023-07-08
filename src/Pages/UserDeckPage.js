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

async function addNewDeck(userId, deckName) {
    //console.log(userId);
    try {
      // Create a new deck document
      const userDeckRef = firestore.collection('userDecks');
      
      const existingDeckQuery = userDeckRef.where('userId', '==', userId).where('deckName', '==', deckName);
      const existingDeckSnapshot = await existingDeckQuery.get();
    
        if (!existingDeckSnapshot.empty) {
        console.log('Deck already exists for the user with the same name.');
        return;
        }

      const deckData = {
        userId: userId,
        deckName: deckName,
        cards: []
      };

      await userDeckRef.add(deckData);
      
      console.log('New deck added successfully!');
    } catch (error) {
      console.error('Error adding new deck:', error);
    }
}
//<Link to ='/deckcardspage' onClick={addNewDeck(user.uid,"shesh")}>Create a new deck</Link>        

const allDecks = (userUid) =>
{
    
    //console.log(user2.email);
    return (
        <div>
        <p>heck yeah</p>
        <Link to ='/deckcardspage' onClick={() => addNewDeck(userUid, "shesh")}>Create a new deck</Link>        
        </div>
    )
}



const UserDeckPage = {
   allDecks
}

export default UserDeckPage;