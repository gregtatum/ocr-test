import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { createStore } from 'src/create-store';
import * as A from 'src/actions';
import * as T from 'src/@types';
import * as $ from 'src/selectors';
import { createWorker, type Worker } from 'tesseract.js';
import { DragDropArea } from './components/DragAndDrop';
import { useEffect, useState } from 'react';

export function init(): void {
  mockGoogleAnalytics();

  const store = createStore();
  store.dispatch(A.init());
  Object.assign(window as any, { store });
  mountReact(store);
}

export function createRootApp(store: T.Store): JSX.Element {
  return (
    <Provider store={store as any}>
      <App />
    </Provider>
  );
}

function mountReact(store: T.Store): void {
  const mountElement = document.createElement('div');
  mountElement.className = 'AppRoot';
  const body = document.body;
  if (!body) {
    throw new Error(
      'Attempting to mount the <App> React component but no document body was found.',
    );
  }
  body.appendChild(mountElement);
  ReactDOM.render(createRootApp(store), mountElement);
}

/**
 * Mock out Google Analytics for anything that's not production so that we have run-time
 * code coverage in development and testing.
 */
function mockGoogleAnalytics() {
  if (process.env.NODE_ENV === 'development') {
    (window as any).ga = (event: any, ...payload: any[]) => {
      const style = 'color: #FF6D00; font-weight: bold';
      console.log(`[analytics] %c"${event}"`, style, ...payload);
    };
  } else if (process.env.NODE_ENV !== 'production') {
    (window as any).ga = () => {};
  }
}

function App() {
  const isInit = useSelector($.getInit);
  if (!isInit) {
    throw new Error('Expected store to be init.');
  }

  const worker = useWorker();

  const [text, setText] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  return worker ? (
    <DragDropArea
      className="App"
      onDrop={async (files) => {
        const file: File = files[0];
        fileToImage(file).then((src) => {
          setImage(src);
        });
        try {
          setText('Running tesseract.js on the image');
          const {
            data: { text },
          } = await worker.recognize(file);
          setText(text);
        } catch (error) {
          console.log('This failed', error);
        }
      }}
    >
      {image ? <img src={image} /> : null}
      <h1>{text ?? 'Drop image here.'}</h1>
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

function useWorker(): null | Worker {
  const [worker, setWorker] = useState<null | Worker>(null);
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

// (async () => {
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const {
//     data: { text },
//   } = await worker.recognize(
//     'https://tesseract.projectnaptha.com/img/eng_bw.png',
//   );
//   console.log(text);
//   await worker.terminate();
// })();
