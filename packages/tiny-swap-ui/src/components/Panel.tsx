import { ReactElement } from 'react'

function Panel ({children}: {children: ReactElement[]}) {
  return <div className="Panel">{children}</div>
}

export default Panel