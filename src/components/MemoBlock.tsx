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
    <div className='memo-block' onClick={()=> (validation && handleOnClick(pokemon))}>
      <div className={`memo-block-inner ${pokemon.flipped && 'memo-block-flipped'}`}>
        <div className='pkm_block-front'>
        </div>
        <div className='pkm_block-back'>
          <img src={pokemon.image} className='pkm_image' alt={pokemon.name} />
        </div>
      </div>
    </div>

  )
}

export default MemoBlock;
