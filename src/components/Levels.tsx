import { createRef, useEffect, useRef, useState } from 'react'
import '../levels.css'

type props = {
  onChangeLevel: (blocksQuantity: number) => void;
}

const MIN_LEVEL = 1;
const MAX_LEVEL = 4;
const circles = ['20','30','40','50'];
let currentLevel = 1;


const Dropdown = ({onChangeLevel}: props) => {

  const [level, setlevel] = useState<number>(currentLevel);
  const lineRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const progressRef = useRef<HTMLDivElement>(null)

  lineRefs.current = circles.map((_, i) => lineRefs.current[i] ?? createRef());

  const updateLevel = () => {
    circles.map((_, index) =>{
      if(index < currentLevel) {
        lineRefs.current[index].current?.classList.add('active');
      }
      else {
        lineRefs.current[index].current?.classList.remove('active');
      }
    });

    const actives = lineRefs.current.filter(circle => (circle.current?.className.includes('active'))).length;

    const progressBarWidth = (actives - 1) / (circles.length - 1) * 100 + '%';

    progressRef.current!.style.width = progressBarWidth;
  }

  const handleNext = () => {
    currentLevel++;
    console.log('current level: ', currentLevel)
    setlevel(currentLevel);
    if(currentLevel>circles.length) {
      currentLevel = (circles.length)
      setlevel(currentLevel);
    };
    updateLevel();
    onChangeLevel(Number(circles[currentLevel-1]));
  }
  
  const handlePrevious = () => {
    currentLevel--;
    setlevel(currentLevel);
    if(currentLevel<MIN_LEVEL) {
      currentLevel = (MIN_LEVEL) 
      setlevel(currentLevel)} ;
    updateLevel();
    onChangeLevel(Number(circles[currentLevel-1]));
  }

  return (
    <div className="container">
      <h2>Level {currentLevel}</h2>
      <h3> Blocks </h3>
      <div className="progress-container">
        <div ref={progressRef} className="progress" id="progress"></div>
        {
          circles.map((circle, i) =>(
            <div ref={lineRefs.current[i]} id={(i+1).toString()} className={`circle ${i===0? 'active': ''}`} key={i}> {circle} </div>
          ))
        }
      </div>
      <button className="btn" id="prev" onClick={handlePrevious} disabled={level===MIN_LEVEL? true: false} >Prev</button>
      <button className="btn" id="next" onClick={handleNext} disabled={level===MAX_LEVEL? true: false}>Next</button>
  </div>
  )
}

export default Dropdown
