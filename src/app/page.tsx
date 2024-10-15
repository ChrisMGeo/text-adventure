'use client';

import { defaultCharacters, defaultMoods, defaultScenes } from '@/consts/defaults';
import { useTextAdventure } from '@/hooks/use-text-adventure';
import { getSpeakers } from '@/util/converters';
import { useState } from 'react';

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
  }
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* {messages.map(m => ( */}
      {/*   <div key={m.id} className="whitespace-pre-wrap"> */}
      {/*     {m.role === 'user' ? 'User: ' : 'AI: '} */}
      {/*     {m.content} */}
      {/*   </div> */}
      {/* ))} */}
      {log.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {l.type === 'input' ? '> ' : getSpeakers(l.value, defaultCharacters) + ": "}
          {l.type === 'input' ? l.value : l.value.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </div>
  );
}
