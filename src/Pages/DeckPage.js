import PokeApi from "../PokeApi";
import React from 'react';
import SetsPage from "./SetsPage";

function ShowLegalCards()
{
    const [cards, setCards] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        fetchCards();
      }, [currentPage]);

    const fetchCards = () => {
        PokeApi.getAllLegalCards(currentPage)
        .then((resolvedValue) =>{
            console.log(resolvedValue);
            setCards(resolvedValue);
        })

    };


    const renderCards = () => {
        const listItems = [];
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
                if(card.legalities.standard == "Legal"){
                    listItems.push(<li key={card.id}><img className='pkCard' src={card.images.small}/> {card.name} {i}</li>);
                }
        }
        return listItems;
      };

      const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };


    return(
        <>
        <h1>All Cards</h1>
        <button onClick={handlePreviousPage}>Previous Page</button>
      <button onClick={handleNextPage}>Next Page</button>
        <ul>{renderCards()}</ul>
        </>
    );

    
}

const DeckPage =
{
    ShowLegalCards
}

export default DeckPage;