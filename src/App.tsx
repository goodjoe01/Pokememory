import { useEffect, useState } from 'react'
import axios from 'axios'
import { response, pokemon } from './types'
import './styles/App.css'
import MemoBlock from './components/MemoBlock'
import Levels from './components/Levels'
import Loader from './components/Loader'
import VictoryModal from './components/VictoryModal'

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
const initialPokemons: pokemon[] = []

const PokeMemory = () => {

  const [board, setBoard] = useState<pokemon[]>(initialPokemons)
  const [limit, setLimit] = useState(10);
  const [selectedBlock, setSelectedBlock] = useState<pokemon | null>(null);
  const [animation, setAnimation] = useState(false);
  const [columns, setColumns] = useState(5);
  const [isFetching, setIsFetching] = useState(true);
  const [victory, setVictory] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const styles = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
  }

  const handleOnClick = (block: pokemon) => {
    const flippedBlock = {...block, flipped: true}
    let pokemonsBoardCopy = [...board];
    pokemonsBoardCopy.splice(block.index as number, 1, flippedBlock);

    setBoard(pokemonsBoardCopy);

    if(pokemonsBoardCopy.every((block)=>(block.flipped))){
      setVictory(true);
      setShowModal(true);
      return;
    }

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
        setBoard(pokemonsBoardCopy);
        setSelectedBlock(null);
        setAnimation(false);
      }, 1000);
    }
  }

  const handleRestart = () => {
    setVictory(false);
    setBoard(board.map(block=>{
      return {
        ...block, flipped: false
      }
    }))
  }

  const onChangeLevel = (blocksQuantity: number) => {
    setVictory(false);
    const limit = blocksQuantity / 2;
    setLimit(limit);

    if(blocksQuantity===40) setColumns(8);
    else if (blocksQuantity===50) setColumns(10);
    else setColumns(5);
  }

  useEffect(()=>{
      const fetchData = async () => {
        setIsFetching(true);
        const offset = randomOffset();
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data: response = response.data;

        const board = await createBoard(data);
        const shuffledBoard = shuffleBoard([...board, ...board]);
        const finalBoard: pokemon[] = shuffledBoard.map((block, i)=>({
          ...block, index: i
        }));

        setBoard(finalBoard);
        setIsFetching(false);
      }
      fetchData();
  },[limit]);

  return (
    <>
      <div className={`Pokememory ${victory && showModal? 'blur': 'blur-none'}`}>
      <h1>PokeMemory</h1>
      <div className='content'>
        <div className='board-container'>
          {
            isFetching ? <Loader></Loader>
            :
            <div className='board' style={styles}>
            {
              
              board.map((pokemon, index)=>(
                <MemoBlock 
                pokemon={pokemon} 
                key={index}
                animation={animation}
                handleOnClick={handleOnClick}
                />
              ))
            }
            </div>
          }

        </div>
        <div className='options'>
          <button onClick={handleRestart} className='poke-btn'>RESTART</button>
          <Levels onChangeLevel={onChangeLevel} />
        </div>
      </div>
    </div>
      {
        victory && showModal? <VictoryModal setShowModal={setShowModal} /> : null
      }
    </>
  )
}

export default PokeMemory;
