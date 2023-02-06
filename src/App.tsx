import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios'
import { results, response, pokemon } from './types'
import './App.css'
import MemoBlock from './components/MemoBlock'


const initialResponse: response= {
  count: null,
  next: null,
  previous: null,
  results: []
}



const initialPokemons: pokemon[] = []
const EMPTY = 0;

const getPokemonByName = async (name: string) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  const data = await axios.get(url);
  const {sprites, id} = data.data;

  const pokemon: pokemon = {
    id: id,
    name: name,
    image: sprites.other['official-artwork'].front_default,
    flipped: false
  }
  return pokemon;
}

 
const shuffleBoard = (board: pokemon[]) => {
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  
  return board;
}

async function createBoard(data: response) {
  let pokemonList: pokemon[] = [];
  const promises = data.results.map(async (poke) => {
    const pokemon = await getPokemonByName(poke.name);
    pokemonList.push(pokemon);
  });
  await Promise.all(promises);
  return pokemonList;
}
/* const fillBoard = async () => {
  const a = await data.results.map(async (poke)=> {
    const pokemonDetails = await getPokemonByName(poke.name)
    list.push(pokemonDetails);
    setPokemons([...pokemons, ...list, ...list])

  }); */

function App() {

  const [pokemons, setPokemons] = useState<pokemon[]>(initialPokemons)
  const [response, setResponse] = useState<response>(initialResponse)
  const [selectedBlock, setSelectedBlock] = useState<pokemon | null>(null);
  const [animation, setAnimation] = useState(false);

  const handleOnClick = (block: pokemon) => {
    const flippedBlock = {...block, flipped: true}
    console.log(flippedBlock.flipped)
    let pokemonsBoardCopy = [...pokemons];
    pokemonsBoardCopy.splice(block.index as number, 1, flippedBlock);
    setPokemons(pokemonsBoardCopy);

    console.log(selectedBlock);
    console.log(animation);

    if(selectedBlock === null){
      setSelectedBlock(block);
    } else if (selectedBlock.id === block.id) {
      setSelectedBlock(null);
    }
    else {
      setAnimation(true);
      setTimeout(() => {
        pokemonsBoardCopy.splice(block.index as number, 1, block);
        pokemonsBoardCopy.splice(selectedBlock.index as number, 1, selectedBlock);
        setPokemons(pokemonsBoardCopy);
        setSelectedBlock(null);
        setAnimation(false);
      }, 1000);
    }
  }

  useEffect(()=>{
    if(pokemons.length === EMPTY){
      const fetchData = async () => {
        const limit = 10;
        const offset = 0;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  
        const data: response = response.data;
        setResponse(data);

        const board = await createBoard(data);
        const shuffledBoard = shuffleBoard([...board, ...board]);
        const finalBoard: pokemon[] = shuffledBoard.map((block, i)=>({
          ...block, index: i
        }));

        setPokemons(finalBoard);
        console.log(finalBoard);
      }
      fetchData();
    }
  },[]);

  return (
    <div className="Pokememory">
      <div className='board'>
        {
          pokemons.map((pokemon, index)=>(
            <MemoBlock 
            pokemon={pokemon} 
            key={index}
            animation={animation}
            handleOnClick={handleOnClick}
            />
          ))
        }
      </div>
    </div>
  )
}

export default App;
