import React, { useState, useEffect } from 'react';
import './App.css';
import Confetti from 'react-confetti';

type Card = {
  id: number;
  name: string;
  image: string;
  flipped: boolean;
};

const images = [
  'brook.jpg', 'chopper.jpg', 'potgas.jpg', 'shanks.jpg', 'luffy.jpg', 
  'nami.jpg', 'robin.jpg', 'sanji.jpg', 'usopp.jpg', 'zoro.jpg'
];

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedCards, setMatchedCards] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0); // Variável para armazenar a pontuação
  const [showCardsTemporarily, setShowCardsTemporarily] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // Para controlar a exibição dos fogos de artifício

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (score >= 10) {
      setShowConfetti(true);  // Ativa os fogos de artifício quando o jogador atingir 10 pontos
      setTimeout(() => setShowConfetti(false), 5000);  // Esconde os fogos após 5 segundos
    }
  }, [score]);

  const initializeGame = () => {
    const shuffledCards = shuffleCards([...images, ...images].map((image, index) => ({
      id: index,
      name: image.split('.')[0],
      image: `${process.env.PUBLIC_URL}/img/cards/${image}`, // Corrigido para usar PUBLIC_URL
      flipped: false
    })));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setAttempts(0);
    setScore(0); // Resetando a pontuação ao iniciar o jogo
    setIsGameOver(false);
    setShowCardsTemporarily(true);

    // Mostrar as cartas por 3 segundos
    setTimeout(() => {
      setShowCardsTemporarily(false);
    }, 3000);  // 3000ms = 3 segundos
  };

  const shuffleCards = (cards: Card[]) => {
    return cards.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (card: Card) => {
    // Evitar que mais de 2 cartas sejam viradas ao mesmo tempo
    if (flippedCards.length === 2 || card.flipped || matchedCards.some((matchedCard) => matchedCard.id === card.id)) return;

    card.flipped = true;
    setFlippedCards((prev) => [...prev, card]);

    if (flippedCards.length === 1) {
      setAttempts(prev => prev + 1);
      checkMatch(card);
    } else {
      setCards([...cards]);
    }
  };

  const checkMatch = (secondCard: Card) => {
    const [firstCard] = flippedCards;

    if (firstCard.name === secondCard.name) {
      // As cartas são iguais
      setMatchedCards((prev) => [...prev, firstCard, secondCard]);
      setScore(prev => prev + 1); // Incrementando a pontuação
      resetFlippedCards(true);  // Passando true para manter as cartas visíveis
    } else {
      // As cartas não são iguais, virar de volta
      setTimeout(() => {
        resetFlippedCards(false);  // Passando false para virar as cartas
      }, 1000);
    }
  };

  const resetFlippedCards = (keepVisible: boolean) => {
    setCards(cards.map(card => 
      card.flipped && (matchedCards.some(matchedCard => matchedCard.id === card.id) || keepVisible) ? 
        { ...card, flipped: true } : { ...card, flipped: false }
    ));
    setFlippedCards([]);
  };

  const handleNewGame = () => {
    initializeGame();
  };

  useEffect(() => {
    if (matchedCards.length === cards.length) {
      setIsGameOver(true);
    }
  }, [matchedCards, cards]);

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/one12.jpg)` }}
    >
      {showConfetti && <Confetti />}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 bg-white/80 p-2 sm:p-4 rounded-lg">
          <button
            onClick={initializeGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base"
          >
            Novo Jogo
          </button>
          <div className="text-sm sm:text-lg font-bold">
            Tentativas: {attempts} | Pontos: {score}
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="relative cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40">
                <img
                  src={card.flipped || showCardsTemporarily ? card.image : `${process.env.PUBLIC_URL}/img/cards/one1.png`}
                  alt={card.flipped ? card.name : 'Card Back'}
                  className={`w-full h-full object-contain rounded-lg shadow-lg transition-transform duration-300 ${
                    card.flipped || showCardsTemporarily ? 'scale-[1]' : 'scale-[1]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
