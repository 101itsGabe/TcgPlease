import React from 'react';
import pokemon from 'pokemontcgsdk'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import "../App.css";
import {Link, useParams } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { QuerySnapshot } from 'firebase/firestore';

const apiKey = 'b42a776d-16b7-49b2-973c-be2b640e99d9';
pokemon.configure({apiKey: {apiKey}});
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


function ShowLegalCards()
{
    
    const [cards, setCards] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [cardsCache, setCardsCache] = React.useState({});

    React.useEffect(() => {
        fetchCards();
      }, []);

    const fetchCards = async() => {
        try 
        {
          pokemon.card.where({ q: 'legalities.standard:legal', pageSize: 20, page: currentPage })
          .then(result => {
            //console.log(result.data) // "Blastoise"
            setCards(result.data);
          })
            
        }catch(er)
        {
            console.log(er);
        }
        

    };

    const nextPage = () =>{
        setCurrentPage(currentPage + 1);
    }

    const prevPage = () =>{
        if (!currentPage - 1 <= 0)
            setCurrentPage(currentPage - 1);
    }
    
    const renderCards = () => {
        const listItems = [];
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const ecc = encodeURIComponent(card.images.large);
                if(card.legalities.standard == "Legal"){
                    listItems.push(
                      
                    <li key={card.id}>
                        
                        <nav>
                        <Link to={"/card/" + ecc}><img className="pkCard" src={card.images.small}/></Link></nav>{card.name} {i}
                        <button className='plusbtn' onClick={() =>addCard(card.name)}>+</button>
                        
                    </li>
                    );
                }
        }
        return listItems;
      };
      



    return(
        <div>
        <h1>All Cards</h1>
        <button onClick={prevPage}>Prev Page</button> 
        <button onClick={nextPage}>Next Page</button>
        <ul>{renderCards()}</ul>
        </div>
    );
    
    
    
}

/* 

    Current Deck Page
    - Need to add the deck thats being passed in

*/




const CurDeck = ({ user }) => {
  const userDeckRef = firestore.collection('userDecks');
  const [decks, loading, error] = useCollectionData(null, { idField: 'id' });
  const [ifEdit, setEditOn] = React.useState(false);
  const [newDeckName, setNewDeckName] = React.useState('');
  const [currentDeck, setCurDeck] = React.useState(null);


 React.useEffect(() => {
    if (user) {
      const query = userDeckRef
        .where('userUid', '==', user.uid)
        .where('deckName', '==', 'New Deck');

      const fetchData = async () => {
        try {
          const querySnapshot = await query.get();
          if (!querySnapshot.empty) {
            const deck = querySnapshot.docs[0].data();
            setCurDeck(deck);
            console.log(currentDeck);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [user]);


  const handleInputChange = (e) =>
  {
    setNewDeckName(e.target.value);
  }

  const handleKeyDown = (e) =>
  {
    if(e.key === 'Enter')
    {
      updateDeckName(e);
      EditSwitch();
    }
  }
  const updateDeckName = (e) => {
    const tempDeckName = e.target.value;
    const query = userDeckRef.where('userUid', '==', user.uid).where('deckName', '==', currentDeck.deckName);

    query
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const deckDocRef = userDeckRef.doc(doc.id);
        return deckDocRef.update({ deckName: tempDeckName });
      }
    }).then(() => {
      setCurDeck({ ...currentDeck, deckName: tempDeckName });
    })
    .catch((error) => {
      console.error('Error updating deck name:', error);
    });

  };
    
    const EditSwitch = () =>
    {
      if(ifEdit)
        setEditOn(false);
      else
        setEditOn(true);
    }
  
    return (
      <div>
        <div>
         <p>
          {currentDeck? 
          <div>
            {ifEdit?
              <input 
                type="text" 
                id="fname" 
                name="fname" 
                value={newDeckName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}/>
             :(
             <p>{currentDeck.deckName}</p> 
             )
            }
            <button onClick={() => setEditOn(!ifEdit)}>Edit</button>
          </div>
            :
            <p>damn</p>
          }
        </p>
      </div>
        <ShowLegalCards />
      </div>
      )
    }









function CardPage()
{
    //console.log("i literally just heard like 7 shots fired");

    const { photoUrl } = useParams();
    //console.log(photoUrl);
    return(
        <div>
            <img src={decodeURIComponent(photoUrl)}></img>
        </div>
    )
}

function addCard(cardName)
{
    console.log(cardName);
}



const DeckPage =
{
    ShowLegalCards,
    CardPage,
    CurDeck
}

export default DeckPage;