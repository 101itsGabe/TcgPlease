import axios from 'axios';
import pokemon from 'pokemontcgsdk'


const API_BASE_URL = 'https://api.pokemontcg.io/v2';
const apiKey = 'b42a776d-16b7-49b2-973c-be2b640e99d9';
pokemon.configure({apiKey: {apiKey}});
const getCard = async (cardId) =>
{
  try 
  {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards/base1-4',{
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    //console.log(response.data.data);
    return response.data.data;
  } catch(er){
    console.log(er);
    throw er;
  }
}

const getAllSets = async() =>
{
  try 
  {
    const response = await axios.get('https://api.pokemontcg.io/v2/sets',{
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    //console.log(response.data.data);
    const sets = response.data.data;
    //console.log(sets[150]);
    return sets;
  } catch(er){
    console.log(er);
    throw er;
  }
}


const getAllLegalCards = async(pageNum) =>
{
  
  try 
  {
    pokemon.card.where({ q: 'legalities.standard:legal', pageSize: 250, page: pageNum })
    .then(result => {
    //console.log(result.data) // "Blastoise"
    return result.data;
    })
  } catch(er){
    console.log(er);
    throw er;
  }
}





const PokeApi = 
{
  getCard,
  getAllSets,
  getAllLegalCards
}
export default PokeApi;