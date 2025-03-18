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
    lost: 'bg-red',
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
  const isGameLost = wrongGuessCount >= LANGUAGES?.length - 1;
  const isGameSuccessful = currentWord.toUpperCase().split('').every(letter => userGuess.includes(letter));
  const isGameOver = isGameLost || isGameSuccessful;
  const lastGuessedLetter = userGuess[userGuess.length - 1] || '';
  const isLastGuessCorrect = currentWord.includes(lastGuessedLetter);

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
    if (isGameStarted && !isGameLost && isGameSuccessful) {
      return GAME_STATES.success;
    }

    if (isGameStarted && isGameLost && !isGameSuccessful) {
      return GAME_STATES.lost;
    }

    if (isGameStarted && isLastGuessCorrect) {
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
      case (GAME_STATES.lost):
        return (
          <section className={`centered game-status mb-1 ${GAME_STATES.lost}`}>
            <h2>Game over</h2>
            <p>You lose! Better start learning Assembly 😢</p>
          </section>
        );
      case (GAME_STATES.start):
        return (
          <section className={`centered game-status mb-1 border-dashed ${GAME_STATES.start}`}>
            <h2 className='italic'>"Farewell {lostLanguages.join(' & ')}" 🫡</h2>
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
    if (isGameOver) return;

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
        <section className='flex-row flex-wrap language-container justify-center mb-1'>
          {languageItems}
        </section>

        <section className='flex-row no-wrap word-container justify-center mb-1'>
          {currentWordElements}
        </section>

        <section className='flex-row flex-wrap keyboard-container justify-center mb-1'>
          {alphabetElements}
        </section>

        {(isGameLost || isGameSuccessful) && 
          <section className='flex-row button-container justify-center mt-3'>
            <button onClick={handleNewGame}
              className="mat-button btn-primary">New Game</button>
          </section>
        }
      </main>
      <Footer />
    </div>
  );
}

export default MainContent;