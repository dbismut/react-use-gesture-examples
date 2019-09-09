import React, { useState, useRef, useEffect, useCallback } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useStore } from './index'
import data from './data'
import Card from './Card'
import Page from './Page'

import './List.css'

export default function List({ index }) {
  const navStatus = useStore(state => state.status)
  const navigate = useStore(state => state.navigate)

  // The ref of the list node
  const mainRef = useRef(null)

  // A ref to the scroll position, we will need to store it before freezing the
  // list node (ie position: fixed, overflow: none)
  const scroll = useRef(0)

  // cardNodes will hold all the node refs of the cards
  const [cardNodes] = useState(() => new Map())

  // List status is idle when no page is opened (ie index === 1) and the
  // navigation status is also idle.
  const idle = index === -1 && navStatus === 'idle'

  // Function called by all refs from the Card components: it will add all the
  // card refs to cardNodes so that we can retrieve the opened card.
  const addCardNode = useCallback((node, i) => node && cardNodes.set(i, node), [
    cardNodes,
  ])

  // Returns the card matching the index passed as a parameter.
  const getOpenedCard = useCallback(i => cardNodes.get(i), [cardNodes])

  // onClick handler that navigates to the page index
  const onCardClick = useCallback(
    i => {
      // We store the current window scrollY so that we can freeze the list
      // container later.
      scroll.current = window.scrollY
      navigate(i, mainRef.current)
    },
    [navigate]
  )

  // This will take care of freezing the list container when the transition to
  // the page starts, and unfreezing it when the exit transition finishes.
  useEffect(() => {
    if (idle) {
      mainRef.current.classList.remove('frozen')
      mainRef.current.style.width = ''
      window.scrollTo(0, scroll.current)
    } else {
      mainRef.current.style.width = mainRef.current.offsetWidth + 'px'
      mainRef.current.classList.add('frozen')
      mainRef.current.scrollTop = scroll.current
      window.scrollTo(0, 0)
    }
  }, [idle])

  return (
    <>
      <main ref={mainRef}>
        <header>
          <h3>Friday, August 16th</h3>
          <h1>Today</h1>
        </header>
        <div className="list">
          {data.map((_, i) => (
            <Card
              ref={n => addCardNode(n, i)}
              key={i}
              index={i}
              onClick={onCardClick}
            />
          ))}
        </div>
      </main>
      <TransitionGroup appear component={null}>
        {/* we only show the Page component when index isn't -1 */}
        {index > -1 && <Page index={index} getOpenedCard={getOpenedCard} />}
      </TransitionGroup>
    </>
  )
}
