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


function ShowLegalCards(props)
{
    const {curUser, deckName, userDeckRef} = props;
    const [cards, setCards] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [isLoading, setLoading] = React.useState(true); // New loading state

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
            setLoading(false);
          })
            
        }catch(er)
        {
            console.log(er);
        }
        

    };

    const nextPage = () =>{
        setCurrentPage(currentPage + 1);
        fetchCards();
    }

    const prevPage = () =>{
        if (!currentPage - 1 <= 0){
            setCurrentPage(currentPage - 1);
            fetchCards();
        }
    }
    
    const renderCards = () => {
      if (isLoading) {
        return <p>Loading...</p>; // Render a loading message while data is being fetched
      }
        const listItems = [];
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
            console.log(card.image.large);
            const ecc = encodeURIComponent(card.images.large);
          
                if(card.legalities.standard == "Legal"){
                    listItems.push(
                      
                    <li key={card.id}>
                        
                        <nav>
                        <Link to={"/card/" + ecc}><img className="pkCard" src={card.images.small}/></Link></nav>{card.name}
                        <button className='plusbtn' onClick={() =>addCard(curUser,deckName,card.id,userDeckRef, setCards)}>+</button>
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
        <input id='searchCard'/>
        <ul>{renderCards()}</ul>
        </div>
    );
    
}

/* 

    Current Deck Page
    - Need to add the deck thats being passed in

*/




function CurDeck ( user ){
  const curUser = user.user;
  const userDeckRef = firestore.collection('userDecks');
  const [decks, loading, error] = useCollectionData(null, { idField: 'id' });
  const [ifEdit, setEditOn] = React.useState(false);
  const [newDeckName, setNewDeckName] = React.useState('');
  const [currentDeck, setCurDeck] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true); // New loading state


  const { deckUrl } = useParams();
  const CurDeckName = decodeURIComponent(deckUrl);
  const [cards, setCards] = React.useState([]);


 React.useEffect(() => {

    let unsubscribeSnapshot;
    if (curUser) {
      const query = userDeckRef
        .where('userUid', '==', curUser.uid)
        .where('deckName', '==', CurDeckName);
      const fetchData = async () => {
        try {
          const querySnapshot = await query.get();
          if (!querySnapshot.empty) {
            const deck = querySnapshot.docs[0].data();
            setCurDeck(deck);
            curCards();
            setLoading(false); // Set loading to false when data is fetched
          }
          else{
            setLoading(false); // Set loading to false even if deck is not found
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };

      fetchData();

      unsubscribeSnapshot = query.onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const deck = querySnapshot.docs[0].data();
          setCurDeck(deck);
          curCards();
          console.log(currentDeck);
          setLoading(false);
        }
      });
    }
    return () => {
      // Unsubscribe from the snapshot listener and reset the state when the component unmounts
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      setCurDeck(null);
      setLoading(true);
    };
  }, [curUser]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
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
    const query = userDeckRef.where('userUid', '==', curUser.uid).where('deckName', '==', CurDeckName);

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
    

    
    async function curCards() {
      if(currentDeck && currentDeck.cards)
      {
        console.log('inside');
        setLoading(true);
        try{
          const listItems = [];
          for (let i = 0; i < currentDeck.cards.length; i++) {
            const cardId = currentDeck.cards[i];
            //console.log(cardId);
            try{
              const card =  await pokemon.card.find(cardId)
              
              //console.log(card.name);
              listItems.push(
                <li key={card.id}>
                  <div className ='curDeckDiv'>
                    <img className = 'curDeckCard' src = {card.images.small}/>
                    <p>{card.name}</p> 
                    <button onClick={deleteCard()}>-</button>
                  </div>
                </li>
              );
          
          }
          catch(er){
            console.log(er);
          }
        }
      setCards(listItems);
      setLoading(false);
        }catch(er)
        {console.log(er);}
    }
   //curCards();
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
            <ul className='ulListOfCards'>{cards ? cards : null}</ul>
            
          </div>
            :
            <p>Deck not found</p>
          }
        </p>
      </div>
        <ShowLegalCards 
          curUser={curUser} 
          userDeckRef = {userDeckRef} 
          deckName = {currentDeck.deckName}
          setCards={setCards} />
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

function addCard(curUser,deckName,cardId,userDeckRef, setCards)
{
    const query = userDeckRef
        .where('userUid', '==', curUser.uid)
        .where('deckName', '==', deckName);
    const fetchData = async () => {
        try {
          const querySnapshot = await query.get();
          if (!querySnapshot.empty) {
            const deck = querySnapshot.docs[0].data();
            const deckDoc = querySnapshot.docs[0];
            deck.cards = [...deck.cards,cardId];
            userDeckRef.doc(deckDoc.id).update(deck).then(() =>
            {
              console.log("Updated!");
              setCards(deck.cards);
            }).catch((er) =>{console.log(er);})
          }
          } catch (error) {
            console.log(error);
          }
          
        };

  fetchData();
}

function deleteCard()
{
  console.log('yer');
}


const DeckPage =
{
    ShowLegalCards,
    CardPage,
    CurDeck
}

export default DeckPage;