'use client';

import { useEffect, useState } from 'react';

interface NoteContentProps {
  title: string;
  htmlContent: string;
}

export default function NoteContent({ title, htmlContent }: NoteContentProps) {
  const [processedContent, setProcessedContent] = useState(htmlContent);
  
  useEffect(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // TITLE REMOVER STUFF
      const allH1s = Array.from(doc.querySelectorAll('h1'));
      const titleH1s: Element[] = [];
      let currentH1Index = 0;
      
      while (currentH1Index < allH1s.length) {
        const currentH1 = allH1s[currentH1Index];
        const h1Text = currentH1.textContent?.trim();
        
        if (!h1Text) {
          currentH1Index++;
          continue;
        }
        
        if (title.includes(h1Text)) {
          titleH1s.push(currentH1);
          currentH1Index++;
        } else {
          break;
        }
      }
      
      titleH1s.forEach(h1 => {
        const parentDiv = h1.parentElement;
        if (parentDiv?.tagName === 'DIV' && parentDiv.childNodes.length === 1) {
          parentDiv.remove();
        } else {
          h1.remove();
        }
      });
      
      Array.from(doc.querySelectorAll('div:empty, div:only-child > br')).forEach(el => {
        el.remove();
      });
      
      setProcessedContent(doc.body.innerHTML);
    } catch (error) {
      console.error('Error processing note content:', error);
      setProcessedContent(htmlContent);
    }
  }, [htmlContent, title]);
  
  return (
    <article className="note-content">
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
    </article>
  );
}
