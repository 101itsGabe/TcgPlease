import React from 'react';
import pokemon from 'pokemontcgsdk'
import "../App.css";
import { BrowserRouter as Router, Route, Switch, Link, Routes, Navigate, useParams } from 'react-router-dom';

const apiKey = 'b42a776d-16b7-49b2-973c-be2b640e99d9';
pokemon.configure({apiKey: {apiKey}});


function ShowLegalCards()
{
    
    const [cards, setCards] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        fetchCards();
      }, [currentPage]);

    const fetchCards = async() => {
        try 
        {
          pokemon.card.where({ q: 'legalities.standard:legal', pageSize: 20, page: currentPage })
          .then(result => {
            console.log(result.data) // "Blastoise"
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
                        <Link to={"/card/" + ecc}><img className='pkCard'src={card.images.small}/></Link></nav>{card.name} {i}

                        
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

function CardPage()
{
    console.log("i literally just heard like 7 shots fired");

    const { photoUrl } = useParams();
    console.log(photoUrl);
    return(
        <div>
            <img src={decodeURIComponent(photoUrl)}></img>
        </div>
    )
}

const DeckPage =
{
    ShowLegalCards,
    CardPage
}

export default DeckPage;