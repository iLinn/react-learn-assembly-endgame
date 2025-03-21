import { useState } from 'react';

import './Main.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { LANGUAGES } from '../../shared/language-data';
import { getRandomWord } from '../../service/utils';
import Confetti from 'react-confetti';

function MainContent() {
  // State values
  const [ currentWord, setCurrentWord ] = useState(() => getRandomWord().toUpperCase());
  const [ userGuess, setUserGuess ] = useState<string[]>([]);

  // Static values
  const GAME_STATES = {
    success: 'bg-green',
    lost: 'bg-red',
    start: 'bg-purple border-dashed',
    continue: 'bg-purple',
  } as const;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  // Derived values
  const width = window.innerWidth;
  const height = window.innerHeight;

  const wrongGuessCount = userGuess.filter(letter => !currentWord.includes(letter)).length;
  const lostLanguages = LANGUAGES
    .filter((_item, index) => wrongGuessCount > index)
    .map(item => item.name);

  const isGameStarted = userGuess?.length > 0;
  const isGameLost = wrongGuessCount >= LANGUAGES?.length - 1;
  const isGameSuccessful = currentWord.split('').every(letter => userGuess.includes(letter));
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

  const currentWordElements = currentWord.split('').map((letter, index) => {
    return (
      <span 
        key={`${index}-${letter}`}
        className="letter">
          {(userGuess.includes(letter) || (isGameLost)) ? letter : ''}
      </span>
    );
  })

  const alphabetElements = alphabet.toUpperCase().split('').map((letter, index) => {
    function getLetterButtonClass(letter: string): string {
      if (userGuess.includes(letter) && currentWord.includes(letter)) {
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
        disabled={isGameOver}
        aria-disabled={userGuess.includes(letter)}
        aria-label={`Letter ${letter}`}
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

  const getGameStatusMessage = (gameStatus: string) => {
    console.log(gameStatus)
    switch (gameStatus) {
      case (GAME_STATES.success):
        return (
          <>
            <h2>You win!</h2>
            <p>Well done! 🎉</p>
          </>
        );
      case (GAME_STATES.lost):
        return (
          <>
            <h2>Game over</h2>
            <p>You lose! Better start learning Assembly 😢</p>
          </>
        );
      case (GAME_STATES.start):
        return (
          <>
            <h2 className='italic'>"Farewell {lostLanguages.join(' & ')}" 🫡</h2>
          </>
        );
      case (GAME_STATES.continue):
        return (
          <>
            <h2>Keep going!</h2>
            <p>You're doing great 👍</p>
          </>
        );
      default: 
        return (
          <>
            <h2>Start your game!</h2>
            <p>Choose wisely</p>
          </>
        );
    }
  }

  function handleKeyboardGuess(letter: string) {
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
    setCurrentWord(() => getRandomWord().toUpperCase());
  }

  return (
    <div className='flex-column p-2'>
      <Header />
      <main className='full-height'>
        <section 
            className={`centered game-status mb-1 ${getGameState()}`}
            aria-live="polite"
            role="status">
          {getGameStatusMessage(getGameState())}
        </section>
        <section className='flex-row flex-wrap language-container justify-center mb-1'>
          {languageItems}
        </section>

        <section className='flex-row no-wrap word-container justify-center mb-1'>
          {currentWordElements}
        </section>

        {/* Accessibility section for Screen Readers */}
        <section 
          className="sr-only"
          aria-live="polite"
          role="status">
            <p>
              {lastGuessedLetter && (isLastGuessCorrect ? 
                  `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                  `Sorry, the letter ${lastGuessedLetter} is not in the word.`)
              }
            </p>
            <p>Current word: {currentWord.split('').map(letter => 
            userGuess.includes(letter) ? letter + '.' : 'blank.')
            .join(' ')}</p>
        </section>
        {/* End of a11y section */}

        <section className='flex-row flex-wrap keyboard-container justify-center mb-1'>
          {alphabetElements}
        </section>

        {(isGameLost || isGameSuccessful) && 
          <section className='flex-row button-container justify-center mt-3'>
            <button onClick={handleNewGame}
              className="mat-button btn-primary">New Game</button>
          </section>
        }

        {isGameSuccessful && <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={1000}
        />}
      </main>
      <Footer />
    </div>
  );
}

export default MainContent;