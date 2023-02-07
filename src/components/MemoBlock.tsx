import React, { useState } from 'react'
import { pokemon } from '../types'
import '../App.css'

type props = {
  pokemon: pokemon;
  handleOnClick: (block: pokemon) => void;
  animation: boolean;
}

const MemoBlock = ({pokemon, animation, handleOnClick}: props) => {

  const validation = (!pokemon.flipped && !animation);

  return (
    <div className='poke-block' onClick={()=> (validation && handleOnClick(pokemon))}>
      <div className={`poke-block-inner ${pokemon.flipped && 'poke-block-flipped'}`}>
        <div className='poke-block-front'>
        </div>
        <div className='poke-block-back'>
          <img src={pokemon.image} className='poke-image' alt={pokemon.name} />
        </div>
      </div>
    </div>

  )
}

export default MemoBlock;
