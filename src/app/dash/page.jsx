'use client';
import { useEffect, useState } from 'react';
import { useNonce } from '@/hooks/useNonce'


export default function Dash() {
  const noncea = useNonce()
  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
    if (cspMeta) {
      console.log('CSP from meta:', cspMeta.content)
    }
    if (noncea && noncea.length > 0) {

      setMounted(true)
      console.log(noncea, 'nonceaaaaaa')
    }
  }, [noncea])

  const color = 'red'; // Example of a color variable, not used in this component


  return (
    <>
      {mounted && (
        <>
          <div>
            <div className="testhere">testdiv</div>
            I am the dash, you are logged in
          </div>

          {noncea && (
            <>
              {noncea}
              <style nonce={noncea}>{`
              .testhere {
                color: ${color};
                font-size: 20px;
                font-weight: bold;
              }
            `}</style>
            </>
          )}
        </>

      )}

    </>

  )

}


