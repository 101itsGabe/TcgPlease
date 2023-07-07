import axios from 'axios';


const API_BASE_URL = 'https://api.pokemontcg.io/v2';
const apiKey = 'b42a776d-16b7-49b2-973c-be2b640e99d9';

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


const getAllLegalCards = async(page) =>
{
  try 
  {
    const response = await axios.get('https://api.pokemontcg.io/v2/cards?q=legalities.standard:legal&page=${page}',{
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    console.log(response);
    const sets = response.data.data;
    //console.log(sets[150]);
    return sets;
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