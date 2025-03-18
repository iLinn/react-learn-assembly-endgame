import { useEffect, useRef, useState } from 'react';

import './Main.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { LANGUAGES } from '../../shared/language-data';

function MainContent() {
  // State values
  const [ currentWord, setCurrentWord ] = useState('REACT');
  const [ userGuess, setUserGuess ] = useState<string[]>([]);

  console.log('USER GUESS', userGuess);
  
  // Static values
  const GAME_STATES = {
    success: 'bg-green',
    fail: 'bg-red',
    start: 'bg-purple',
    continue: 'continue',
  };
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  // Derived values
  const wrongGuessCount = userGuess.filter(letter => !currentWord.includes(letter)).length;
  const lostLanguages = LANGUAGES
    .filter((item, index) => wrongGuessCount > index)
    .map(item => item.name);

  const isGameStarted = userGuess?.length > 0;
  const isGameEnded = wrongGuessCount >= LANGUAGES?.length - 1;
  const isGameSuccessful = currentWord.toUpperCase().split('').every(letter => userGuess.includes(letter));

  // Page elements
  const languageItems = LANGUAGES.map((item, index) => {
    const styles = {
      color: item.color,
      backgroundColor: item.backgroundColor,
    };

    function getLanguageStatusClass(index: number) {
      return wrongGuessCount > index ? 'lost' : '';
    }

    return (
    <span style={styles}
      key={item.name}
      className={`language-item ${getLanguageStatusClass(index)}`}>{item.name}</span>
    )
  });

  const currentWordElements = currentWord.toUpperCase().split('').map((letter, index) => {
    return (
      <span 
        key={`${index}-${letter}`}
        className="letter">
          {userGuess.includes(letter) ? letter : ''}
      </span>
    );
  })

  const alphabetElements = alphabet.toUpperCase().split('').map((letter, index) => {
    function getLetterButtonClass(letter: string): string {
      if (userGuess.includes(letter) && currentWord.toUpperCase().includes(letter)) {
        return 'btn-green';
      }
  
      if (userGuess.includes(letter)) {
        return 'btn-red';
      }
  
      return 'btn-orange';
    }

    return (
      <button onClick={() => handleKeyboardGuess(letter)}
        key={`${index}-${letter}`}
        className={`alphabet-key mat-button ${getLetterButtonClass(letter)}`}>
        {letter}
      </button>
    )
  })

  const getGameState = () => {
    if (isGameStarted && !isGameEnded && isGameSuccessful) {
      return GAME_STATES.success;
    }

    if (isGameStarted && isGameEnded && !isGameSuccessful) {
      return GAME_STATES.fail;
    }

    if (isGameStarted && !wrongGuessCount) {
      return GAME_STATES.continue;
    }

    if (isGameStarted) {
      return GAME_STATES.start;
    }

    return '';
  };

  const getGameStatusMessage = () => {
    switch (getGameState()) {
      case (GAME_STATES.success):
        return (
          <section className={`centered game-status mb-1 ${GAME_STATES.success}`}>
            <h2>You win!</h2>
            <p>Well done! 🎉</p>
          </section>
        );
      case (GAME_STATES.fail):
        return (
          <section className={`centered game-status mb-1 ${GAME_STATES.fail}`}>
            <h2>Game over</h2>
            <p>You lose! Better start learning Assembly 😢</p>
          </section>
        );
      case (GAME_STATES.start):
        return (
          <section className={`centered game-status mb-1 ${GAME_STATES.start}`}>
            <h2>"Farewell {lostLanguages.join(' & ')}" 🫡</h2>
          </section>
        );
      case (GAME_STATES.continue):
        return (
          <section className={`centered game-status mb-1 ${GAME_STATES.start}`}>
            <h2>Keep going!</h2>
            <p>You're doing great 👍</p>
          </section>
        );
      default: 
        return (
          <section className='centered game-status mb-1'>
            <h2>Start your game!</h2>
            <p>Choose wisely</p>
          </section>
        );
    }
  }

  function handleKeyboardGuess(letter: string) {
    console.log('click', letter)
    if (isGameEnded) return;

    setUserGuess(prev => {
      const updatedArray = [...prev];
      if (!prev.includes(letter)) {
        updatedArray.push(letter);
      }
      return updatedArray;
    });
  }

  function handleNewGame() {
    setUserGuess([]);
  }

  return (
    <div className='flex-column p-2'>
      <Header />
      <main className='full-height'>
        <>
          {getGameStatusMessage()}
        </>
        <section className='flex-row fl-wrap language-container justify-center mb-1'>
          {languageItems}
        </section>
        <section className='flex-row no-wrap word-container justify-center mb-1'>
          {currentWordElements}
        </section>
        <section className='flex-row fl-wrap keyboard-container justify-center mb-1'>
          {alphabetElements}
        </section>
        <>{ (isGameEnded || isGameSuccessful) && 
          <section className='flex-row button-container justify-center mt-3'>
            <button onClick={handleNewGame}
              className="mat-button btn-primary">New Game</button>
          </section>
        }</>
      </main>
      <Footer />
    </div>
  );
}

export default MainContent;