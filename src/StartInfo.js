import React from 'react'

const StartInfo = (props) => {
  const { startState, handleTearDown } = props

  const wrapperClasses = ['startInfo-wrapper']

  if (!startState) { 
    wrapperClasses.push('hide')
  }

  return (
    <div 
      className={wrapperClasses.join(' ')}
      onClick={handleTearDown}
      >
      <div className='startInfo'>
        <p>Since General Motors began leaving town three decades ago, the city of Flint has suffered through generational poverty, continued violent crime and now an epic water crisis.</p>
        <p>During this time, the Police Department has been cut from 300 to 100 officers. For a town of just under 100,000 citizens, this qualifies as one of the lowest ratios of citizens-to-police in the country.</p>
        <div className="startCallout">Every night in Flint, they are barely at staff minimum and with the incredibly high call volume they are constantly working at a sprinter's pace.</div>
      </div>
    </div>
  )
}

export default StartInfo