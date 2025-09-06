import { useState } from 'react';

import TopDevices from './TopDevices';
import TopBrowsers from './TopBrowsers';
import TopOS from './TopOS';
import '../analytics.css';

export default function TopDeviceCombo(props) {
  const [selectedComponent, setSelectedComponent] = useState('TopBrowsers'); // Default to TopBrowsers

  const { devicedata, browserdata, osdata, uniquevisitors } = props;

  return (
    <>
      <div className="flex flex-row justify-between ">
        <h4>
          {selectedComponent === 'TopBrowsers'
            ? 'Top Browsers'
            : selectedComponent === 'TopDevices'
              ? 'Top Devices'
              : 'Top OS'}
        </h4>
        <div className="flex flex-row gap-5">
          <button
            className={`${selectedComponent === 'TopBrowsers' ? 'analyticscardactive' : 'analyticscardinactive'
              }`}
            onClick={() => setSelectedComponent('TopBrowsers')}
          >
            Top Browsers
          </button>
          <button
            className={`${selectedComponent === 'TopDevices' ? 'analyticscardactive' : 'analyticscardinactive'
              }`}
            onClick={() => setSelectedComponent('TopDevices')}
          >
            Top Devices
          </button>
          <button
            className={`${selectedComponent === 'TopOS' ? 'analyticscardactive' : 'analyticscardinactive'
              }`}
            onClick={() => setSelectedComponent('TopOS')}
          >
            Top OS
          </button>
        </div>
      </div>
      {selectedComponent === 'TopBrowsers' && (
        <TopBrowsers browserdata={browserdata} uniquevisitors={uniquevisitors} />
      )}
      {selectedComponent === 'TopDevices' && (
        <TopDevices devicedata={devicedata} uniquevisitors={uniquevisitors} />
      )}
      {selectedComponent === 'TopOS' && (
        <TopOS osdata={osdata} uniquevisitors={uniquevisitors} />
      )}
    </>
  );
}