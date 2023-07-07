import PokeApi from "../PokeApi";
import React from 'react';

function ShowAllSets()
{
    const [sets, setSets] = React.useState([]);

    React.useEffect(() => {
        const res = PokeApi.getAllSets();
        res.then((resolvedValue) =>{
        
            setSets(resolvedValue);
        }
        );

    }, []);

    //console.log(sets);


    const renderSets = () => {
        const listItems = [];
        for (let i = 0; i < sets.length; i++) {
          const set = sets[i];
          if(set.legalities.standard == 'Legal'){
            listItems.push(<li key={set.id}><img className='pkLogo' src={set.images.logo}/> {set.name} {i}</li>);
          }
        }
        return listItems;
      };


    return(
        <>
        <h1>All Sets</h1>
        <ul>{renderSets()}</ul>

        </>
    );

    
}

const SetsPage =
{
    ShowAllSets
}


export default SetsPage;