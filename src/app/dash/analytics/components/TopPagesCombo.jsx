import { useState } from 'react';

import TopVisited from './TopVisitedPages';
import Topexitedpages from './Topexitedpages';
import TopEntryPages from './TopEntryPages'; // Import TopEntryPages component
import '../analytics.css'

export default function TopPagesCombo(props) {

  const [selectedComponent, setSelectedComponent] = useState('TopVisited'); // Default to TopVisited


  const { mostvisitedpages, mostexitedpages, mostenteredpages } = props;

  return (
    <>
      <div className="flex flex-row justify-between">
        <h4>
          {selectedComponent === 'TopVisited'
            ? 'Top Visited Pages'
            : selectedComponent === 'Topexitedpages'
              ? 'Top Exited Pages'
              : 'Top Entry Pages'}
        </h4>
        <div className="flex flex-row gap-5">
          <button className={` ${selectedComponent === 'TopVisited' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setSelectedComponent('TopVisited')}>Top Visited</button>
          <button className={` ${selectedComponent === 'TopEntryPages' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setSelectedComponent('TopEntryPages')}>Entry Pages</button>
          <button className={` ${selectedComponent === 'Topexitedpages' ? 'analyticscardactive' : 'analyticscardinactive'}`} onClick={() => setSelectedComponent('Topexitedpages')}>Exit Pages</button>

        </div>
      </div>
      {selectedComponent === 'TopVisited' && (
        <TopVisited mostvisitedpages={mostvisitedpages} />
      )}
      {selectedComponent === 'Topexitedpages' && (
        <Topexitedpages mostexitedpages={mostexitedpages} />
      )}
      {selectedComponent === 'TopEntryPages' && (
        <TopEntryPages mostenteredpages={mostenteredpages} />
      )}
    </>
  )
}