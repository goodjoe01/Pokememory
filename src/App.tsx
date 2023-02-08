import { useEffect, useState } from 'react'
import axios from 'axios'
import { response, pokemon } from './types'
import './App.css'
import MemoBlock from './components/MemoBlock'
import Levels from './components/Levels'
import pokeMemory from './assets/pokeMemory.webp'

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

const randomOffset = () => {
  const limit = 951;
  const randomNumber = Math.floor(Math.random() * limit);
  return randomNumber;
}

const PokeMemory = () => {

  const [pokemons, setPokemons] = useState<pokemon[]>(initialPokemons)
  const [limit, setLimit] = useState(10);
  const [response, setResponse] = useState<response>(initialResponse)
  const [selectedBlock, setSelectedBlock] = useState<pokemon | null>(null);
  const [animation, setAnimation] = useState(false);
  const [columns, setColumns] = useState(5);

  const styles = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
  }

  const handleOnClick = (block: pokemon) => {
    const flippedBlock = {...block, flipped: true}
    console.log(flippedBlock.flipped)
    let pokemonsBoardCopy = [...pokemons];
    pokemonsBoardCopy.splice(block.index as number, 1, flippedBlock);
    setPokemons(pokemonsBoardCopy);

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

  const onChangeLevel = (blocksQuantity: number) => {
    const limit = blocksQuantity / 2;
    setLimit(limit);

    if(blocksQuantity===40) setColumns(8);
    else if (blocksQuantity===50) setColumns(10);
    else setColumns(5);

    console.log('On change:', limit);
  }

  useEffect(()=>{
    /* if(pokemons.length === EMPTY){ */
      console.log('USE EFFECT')
      const fetchData = async () => {
        /* const limit = l; */
        const offset = randomOffset();
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
    /* } */
  },[limit]);

  return (
    <div className="Pokememory">
{/*       <img src={pokeMemory} alt="Poke-Memory Logo" className='poke-logo' /> */}
      <h1>PokeMemory</h1>
      <div className='content'>
        <div className='board' style={styles}>
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
        <div className='options'>
          <button className='poke-btn'>Restart</button>
          <Levels onChangeLevel={onChangeLevel}/>
        </div>

      </div>
    </div>
  )
}

export default PokeMemory;
