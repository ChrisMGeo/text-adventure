'use client';

import { defaultCharacters, defaultMoods, defaultScenes } from '@/consts/defaults';
import { TextAdventureLog, useTextAdventure } from '@/hooks/use-text-adventure';
import { getCharacterImage, getSceneImage } from '@/util/image-getters';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import { usePalette } from 'react-palette';

export default function Chat() {
  const { log, submitMessage, loading } = useTextAdventure({
    allCharacterData: defaultCharacters,
    allMoodData: defaultMoods,
    allSceneData: defaultScenes,
  });
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      submitMessage(input);
      setInput('');
    }
    setLogIndex(logIndex => !isAtEnd ? logIndex : logIndex + 1);
  }
  const dialogueLogs = log.filter(l => l.type === 'dialogue');
  const [logIndex, setLogIndex] = useState(0);
  const [bg, setBg] = useState('');
  const [speakers, setSpeakers] = useState<{ character: string; mood: string }[]>([]);
  const [content, setContent] = useState('');
  const isAtEnd = logIndex >= dialogueLogs.length - 1;
  useEffect(() => {
    const currentLog: TextAdventureLog | undefined = dialogueLogs[logIndex];
    if (currentLog) {
      const { speaker, content, scene, mood } = currentLog.value;
      switch (speaker.type) {
        case 'single':
          setSpeakers([{ character: speaker.character, mood: speaker.mood }]);
          break;
        case 'multiple':
          setSpeakers(speaker.value);
          break;
      }
      setContent(content);
      const bgRes = getSceneImage(defaultScenes, scene, mood);
      if (bgRes) setBg(bgRes);
    }
  }, [logIndex, log]);
  const characterImages = speakers.map(({ character, mood }) => getCharacterImage(defaultCharacters, character, mood)).filter(c => c !== undefined);
  const leftImages = characterImages.filter((_, i) => i % 2 === 0);
  const rightImages = characterImages.filter((_, i) => i % 2 === 1);
  const disableInput = loading || !isAtEnd;
  const { data: palette } = usePalette(bg);
  return <div className="relative w-full h-screen overflow-hidden" style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
  }}>
    <div className="flex flex-col h-full">
      <div className="flex flex-row flex-grow">
        <div className="flex items-end">
          {leftImages.map((img, i) => {
            const scaleFactor = Math.sqrt(Math.sqrt(1 / (i + 1)));
            return <Image key={i} src={img.url} alt="Character Image" width={500} height={250} style={{
              transform: `scale(${(img.direction === 'left' ? -1 : 1) * scaleFactor}, ${scaleFactor})`,
              marginLeft: `${-i * 250}px`,
              zIndex: leftImages.length - i,
              filter: `grayscale(${1 - scaleFactor})`
            }} className="origin-bottom" />
          }
          )}
        </div>
        <div className="flex-grow bg-cover bg-center hidden md:flex" />
        <div className="hidden md:flex md:items-end flex-row-reverse" >
          {rightImages.map((img, i) => {
            const scaleFactor = Math.sqrt(Math.sqrt(1 / (i + 1)));
            return <Image key={i} src={img.url} alt="Character Image" width={500} height={250} style={{
              transform: `scale(${(img.direction === 'right' ? -1 : 1) * scaleFactor}, ${scaleFactor})`,
              marginRight: `${-i * 250}px`,
              zIndex: leftImages.length - i,
              filter: `grayscale(${1 - scaleFactor})`

            }} className="origin-bottom" />
          }
          )}
        </div>
      </div>
      <div className="p-4 rounded-xl border-solid border-4" style={{
        backgroundColor: palette.lightVibrant,
        color: palette.darkMuted,
        borderColor: palette.darkVibrant
      }}>
        <h3 className="text-xl font-bold mb-2">
          {speakers.map(({ character, mood }) => {
            const characterData = defaultCharacters.find(c => c.id === character);
            const moodData = defaultMoods.find(m => m.id === mood);
            if (!characterData || !moodData) return null;
            return characterData.name;
          }).join(', ')}
        </h3>
        <p className="text-lg mb-4">{content}</p>
        {!isAtEnd && <button onClick={() => {
          setLogIndex(logIndex => logIndex + 1)
        }}>Next</button>}
        {!disableInput && <form onSubmit={handleSubmit} className="flex space-x-2">
          <input className="flex-grow rounded-xl p-2 border-solid border-2" type="text" value={input} placeholder="Say something..." onChange={(e) => setInput(e.target.value)} disabled={disableInput} style={{
            backgroundColor: palette.lightVibrant,
            color: palette.darkMuted,
            borderColor: palette.darkVibrant
          }} />
          <button type="submit" disabled={disableInput}>Submit</button>
        </form>}
      </div>
    </div>
  </div>
}
