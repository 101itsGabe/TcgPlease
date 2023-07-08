import React from 'react';
import pokemon from 'pokemontcgsdk'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import "../App.css";
import {Link, useParams } from 'react-router-dom';

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

function ShowLegalCards()
{
    
    const [cards, setCards] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [cardsCache, setCardsCache] = React.useState({});

    React.useEffect(() => {
        fetchCards();
      }, [currentPage]);

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
                        <button className='plusbtn' onClick={addCard()}>+</button>
                        
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

function curDeck()
{

    return(
        <div>
            <p>yo</p>
            <ShowLegalCards/>
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

function addCard()
{
    console.log("wee");
}


async function addNewDeck(userId, deckName) {
    try {
      // Create a new deck document
      const newDeckRef = firestore.collection('decks').doc();
      
      // Define the data for the new deck
      const deckData = {
        userId: userId,
        deckName: deckName,
        cards: []
      };
      
      // Save the new deck to Firestore
      await newDeckRef.set(deckData);
      
      //console.log('New deck added successfully!');
    } catch (error) {
      console.error('Error adding new deck:', error);
    }
}


const DeckPage =
{
    ShowLegalCards,
    CardPage,
    addNewDeck,
    curDeck
}

export default DeckPage;