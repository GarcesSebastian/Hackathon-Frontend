"use client";
import React,{ useState, useEffect } from 'react';
import { Brain, Heart, Smile, Sun, Coffee, Music, BookOpen, Flower } from 'lucide-react';

function Home() {
  const [moodRating, setMoodRating] = useState(3);
  const [garden, setGarden] = useState([]);
  const [showGarden, setShowGarden] = useState(false);

  useEffect(() => {
    const storedGarden = localStorage.getItem('emotionalGarden');
    if (storedGarden) {
      setGarden(JSON.parse(storedGarden));
    }
  }, []);

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
  const moodDescriptions = [
    'Muy bajo',
    'Bajo',
    'Neutral',
    'Bueno',
    'Excelente'
  ];

  const moodAdvice = [
    "Recuerda que está bien no estar bien. Sé amable contigo mismo/a y considera hablar con alguien de confianza.",
    "Los días difíciles son oportunidades para crecer. Intenta hacer algo que te guste hoy, por pequeño que sea.",
    "Estás en un punto de equilibrio. Es un buen momento para practicar la gratitud y notar las cosas positivas a tu alrededor.",
    "¡Genial! Aprovecha esta energía positiva para avanzar en tus metas o ayudar a alguien más.",
    "¡Fantástico! Comparte tu alegría con los demás y reflexiona sobre qué ha contribuido a este excelente estado de ánimo."
  ];

  const activities = [
    { icon: <Sun className="text-yellow-500" />, text: "Pasear en la naturaleza" },
    { icon: <Coffee className="text-green-700" />, text: "Disfrutar un té verde" },
    { icon: <Music className="text-green-600" />, text: "Escuchar sonidos de la naturaleza" },
    { icon: <BookOpen className="text-green-800" />, text: "Leer un libro inspirador" },
  ];

  const plantEmotionalSeed = () => {
    const newGarden = [...garden, { date: new Date().toISOString().split('T')[0], mood: moodRating }];
    setGarden(newGarden);
    localStorage.setItem('emotionalGarden', JSON.stringify(newGarden));
  };

  const getFlowerSize = (mood) => {
    return mood * 5 + 20; // Size between 25px and 45px
  };

  const getFlowerColor = (mood) => {
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-blue-500'];
    return colors[mood - 1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Oasis de Bienestar Mental</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <Brain className="text-green-600 mr-2" />
              ¿Cómo te sientes hoy?
            </h2>
            
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMoodRating(rating)}
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-2xl transition-all duration-300 ${
                    moodRating === rating 
                      ? 'bg-green-500 text-white scale-110' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105'
                  }`}
                >
                  <span className="text-3xl mb-1">{moodEmojis[rating - 1]}</span>
                  <span className="text-xs">{moodDescriptions[rating - 1]}</span>
                </button>
              ))}
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 text-lg font-medium mb-2">
                Tu estado de ánimo: <span className="font-bold">{moodDescriptions[moodRating - 1]}</span>
              </p>
              <p className="text-green-700">
                {moodAdvice[moodRating - 1]}
              </p>
            </div>
            
            <button
              onClick={plantEmotionalSeed}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 mb-4"
            >
              Plantar Semilla Emocional
            </button>

            <button
              onClick={() => setShowGarden(!showGarden)}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-full hover:bg-green-200 transition-colors duration-300 ml-4"
            >
              {showGarden ? 'Ocultar' : 'Mostrar'} Jardín Emocional
            </button>

            {showGarden && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Tu Jardín Emocional</h3>
                <div className="flex flex-wrap gap-4">
                  {garden.map((plant, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Flower 
                        className={`${getFlowerColor(plant.mood)}`}
                        size={getFlowerSize(plant.mood)}
                      />
                      <span className="text-xs text-green-800 mt-1">{plant.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-green-900 mb-3 mt-6 flex items-center">
              <Heart className="text-green-600 mr-2" />
              Actividades para nutrir tu bienestar:
            </h3>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {activities.map((activity, index) => (
                <li key={index} className="bg-green-50 p-3 rounded-lg flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3 shadow">{activity.icon}</div>
                  <span className="text-green-800">{activity.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <Smile className="text-green-600 mr-2" />
                Afirmación del día:
              </h3>
              <p className="text-green-700 italic">
                "Soy como un árbol fuerte, con raíces profundas y ramas que se extienden hacia el cielo. Cada día crezco más fuerte y resiliente."
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-900 mb-4">Recursos de Apoyo</h2>
            <p className="text-green-800 mb-4">
              Recuerda, buscar ayuda es un acto de valentía y autocuidado. Estos recursos están aquí para ti:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-green-800">
                <Sun className="text-yellow-500 mr-2" />
                Línea de Apoyo Emocional: 800-123-4567
              </li>
              <li className="flex items-center text-green-800">
                <Coffee className="text-green-600 mr-2" />
                Chat en línea: www.mentesana.org
              </li>
              <li className="flex items-center text-green-800">
                <Music className="text-green-700 mr-2" />
                App recomendada: "SereniTree" para meditación y conexión con la naturaleza
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;