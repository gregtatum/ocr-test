import * as React from 'react';
import { useEffect, useState } from 'react';
import './DragAndDrop.css';

export function DragDropArea(props: {
  onDrop: (file: FileList) => void;
  className?: string;
  text?: string;
  children: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = useState(false);
  usePreventDragDefault();

  return (
    <div
      className={'dragAndDropArea ' + (props.className ?? '')}
      onDragEnter={() => {
        setIsDragging(true);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={(event) => {
        console.log(event);
        const { files } = event.dataTransfer;
        if (files.length > 0) {
          props.onDrop(files);
        }

        props.onDrop;
        setIsDragging(false);
      }}
    >
      <>
        {props.children}
        <div
          className={
            'dragAndDropOverlayWrapper' + (isDragging ? ' dragging' : '')
          }
        >
          <div className="dragAndDropOverlay">{props.text}</div>
        </div>
      </>
    </div>
  );
}

function _dragPreventDefault(event: DragEvent) {
  event.preventDefault();
}

/**
 * Prevents the default drag behavior for the browser.
 */
export function usePreventDragDefault() {
  useEffect(() => {
    document.addEventListener('drag', _dragPreventDefault, false);
    document.addEventListener('dragover', _dragPreventDefault, false);
    document.addEventListener('drop', _dragPreventDefault, false);

    return function cleanup() {
      document.removeEventListener('drag', _dragPreventDefault, false);
      document.removeEventListener('dragover', _dragPreventDefault, false);
      document.removeEventListener('drop', _dragPreventDefault, false);
    };
  }, []);
}
