import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as $ from 'src/store/selectors';
import { DragDropArea } from 'src/components/DragAndDrop';
import './App.css';
import { createWorker, type Worker as TesseractWorker } from 'tesseract.js';

export function App() {
  const isInit = useSelector($.getInit);
  if (!isInit) {
    throw new Error('Expected store to be init.');
  }

  const worker = useWorker();

  const [text, setText] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [timing, setTiming] = useState<string | null>(null);

  return worker ? (
    <DragDropArea
      className="App"
      onDrop={async (files) => {
        const file: File = files[0];
        fileToImage(file).then((src) => {
          setImage(src);
        });
        try {
          setTiming(null);
          const time = performance.now();
          setText('Running tesseract.js on the image');
          const {
            data: { text },
          } = await worker.recognize(file);
          const elapsedTime = (performance.now() - time) / 1000;
          setTiming(
            elapsedTime.toLocaleString('en-US', {
              style: 'unit',
              unit: 'second',
              unitDisplay: 'long',
            }),
          );
          setText(text);
        } catch (error) {
          console.log('This failed', error);
        }
      }}
    >
      {image ? <img src={image} /> : null}
      <h1>{text ?? 'Drop image here.'}</h1>
      {timing ? <p>Tesseract.js took {timing}</p> : null}
    </DragDropArea>
  ) : (
    <h1>Loading tesseract.js</h1>
  );
}

function fileToImage(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.match(/image.*/)) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const { target } = event;
      if (!target) {
        return resolve(null);
      }
      const { result } = target;
      if (typeof result === 'string') {
        return resolve(result);
      }
      return resolve(null);
    };
    reader.readAsDataURL(file);
  });
}

function useWorker(): null | TesseractWorker {
  const [worker, setWorker] = useState<null | TesseractWorker>(null);
  useEffect(() => {
    const _worker = createWorker({
      logger: (m) => console.log(m),
    });
    (async () => {
      await _worker.load();
      await _worker.loadLanguage('eng');
      await _worker.initialize('eng');

      setWorker(_worker);
    })();

    // TODO - Cleanup properly:
    // worker.terminate();
  }, []);
  return worker;
}
