import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useSpring, a, config } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { CSSTransition } from 'react-transition-group'
import { useWindowWidth } from '@react-hook/window-size'
import { useStore } from './index'
import './Page.css'
import data from './data'

// Limit at which the exit transition triggers on drag
const DRAG_LIMIT = 100
// The scale which will be applied when exiting on drag
const DRAG_MINIMUM_SCALE = 0.9

const wobble = key => ({
  tension: 150,
  friction: 18,
  precision: key === 'width' || key === 'height' ? 2 : 0.01,
})

// start is the initial state
// end is the entered state
const startBase = {
  borderRadius: 16,
  scale: 1,
  opacity: 0,
  scroll: 0,
  fh: 350,
  config: wobble,
}
const endBase = {
  x: 0,
  y: 0,
  borderRadius: 0,
  scale: 1,
  opacity: 1,
  fh: 500,
  config: wobble,
}
const defaultStart = {
  width: 375,
  x: 0,
  y: 0,
  height: 350,
  visibility: 'hidden',
}

function Page({ index, getOpenedCard, in: inProp, ...props }) {
  const { img: cover, category, title, text } = data[index]

  const ref = useRef(null) // Our main dom Ref

  // Is the user dragging the page for exit transition?
  // This will be set to true when the user is dragging
  // the page downwards when the window scroll is <= 0
  const isDragging = useRef(false)

  // true when the page isn't transitioning
  const transitionOver = useRef(false)

  // Is the user still touching the screen?
  // This is important as we don't want to complete
  // the drag exit transition when the user is touching
  // the screen, as it will mess up with trying to restore
  // the scroll position from the list page.
  const touchEnded = useRef(false)

  // is the page transitioning from drag
  const transitioningFromDrag = useRef(false)

  // This promise is important when transitioning from drag.
  // We will wait for it to resolve before signifying our store
  // that the transition is indeed complete. In the code below,
  // the promise will resolve when no finger touches the screen
  // and when the window scroll is back to zero (remember,
  // Safari iOS handles negative scrolling).
  const endResolve = useRef()
  const [endPromise] = useState(
    () =>
      new Promise(resolve => {
        endResolve.current = resolve
      })
  )

  const [invertClose, setInvertClose] = useState(false)

  const winWidth = useWindowWidth()
  const maxWidth = Math.min(winWidth, 640)

  // Tells our store the navigation is completed
  const endNav = useStore(state => state.endNav)

  // Navigate fn
  const navigate = useStore(state => state.navigate)

  // Our main animation spring that will animate everything
  const [spring, set] = useSpring(() => ({ ...defaultStart, ...startBase }))
  const { fh, opacity, ...style } = spring

  // Handles page responsive mode
  useEffect(() => void transitionOver.current && set({ width: maxWidth }), [
    maxWidth,
    set,
  ])

  // The function responsible for executing the entering
  // and exiting transitions
  const execTrans = useCallback(
    done => {
      let anim

      const startStyle = getOpenedCard(index).getStyle(winWidth)

      // If the page is entering the tree, we want to hide
      // the card thumbnail, and show our page
      if (inProp) {
        anim = {
          // now that we know the current exact position of the card ref
          // we set it as the base style of our page, and right when the
          // animation starts we toggle the visibility between the card ref
          // and the page, so that only the page is now visible.
          from: startStyle,
          to: { ...endBase, width: maxWidth, height: window.innerHeight },
          onStart: ({ key }) => {
            if (key === 'width') {
              getOpenedCard(index).set({ visibility: 'hidden' })
              set({ visibility: 'visible' })
            }
          },
        }
      }
      // When the page is exiting, we need to store the current
      // scroll position, hide the overflow of our page so that we can perform
      // border-radius and height animation.
      // We do this declaratively since we don't want any flicker to happen
      // and dealing with React lifecycle is becoming a headache
      else {
        const scroll = window.scrollY

        // If we're transitioning from drag, we need to account for the scrollY
        // when the user releases his finger.
        if (transitioningFromDrag.current) startStyle.y += scroll
        else {
          ref.current.classList.add('drag') // adds overflow:hidden and box-shadow
          ref.current.scrollTo(0, scroll)
          window.scrollTo(0, 0)
        }

        anim = {
          from: { scroll },
          to: { ...startStyle, ...startBase },
          // We reset the onStart function
          onStart: () => {},
          // When exitining, we want also the page to scroll back to 0, hence the `onFrame` fn.
          onFrame: ({ scroll }) => ref.current.scrollTo(0, scroll),
        }
      }

      // Let's start the animation!
      set({
        to: async next => {
          // First let's wait for our main animation to complete
          // so that we can do some cleanup
          await next(anim)

          // When the page is exiting we need to show the card thumb back and
          // and hide our page.
          if (!inProp) {
            if (transitioningFromDrag.current) await endPromise
            getOpenedCard(index).set({ visibility: 'visible' })
            await next({ visibility: 'hidden' })
          } else transitionOver.current = true

          // Tells our store that the navigation is over (this will
          // also unlock the body scroll)
          endNav()

          // tells our CSSTransition component that the animation
          // is over and that it can unmount in the case it was
          // an exiting animation.
          done()
        },
      })
    },
    [inProp, set, getOpenedCard, index, endNav, endPromise, winWidth, maxWidth]
  )

  // This will be called by the CSSTransition component
  // to handle its animation. Because for some weird reason
  // the cover of the Page isn't in cache, we need to wait
  // for it to load before actually executing the transition
  // animation
  const animListener = useCallback(
    (_, done) => {
      // For some reason, the cover image, even though would be already
      // loaded from the list page, might not be in cache in Safari. If
      // we would start the animation right away, there could be a white
      // flash.

      // If this is an exiting transition, we obiously don't need
      // to wait for the cover to load
      if (!inProp) return execTrans(done)

      // Create an image
      const img = new Image()
      // Set its source to the source of the page cover
      img.src = cover
      // If the image is in cache execute the transition
      if (img.complete) return execTrans(done)
      // If not, wait for the image to load and execute the transition
      img.onload = () => execTrans(done)
    },
    [inProp, cover, execTrans]
  )

  // Utility function that adds or remove the drag class to our page
  // ref depending on whether isDragging is true or not.
  const setDragging = flag => {
    isDragging.current = flag
    ref.current.classList[flag ? 'add' : 'remove']('drag')
  }

  // Binding from react-use-gesture
  const bind = useGesture(
    {
      // Here is what happens on drag
      onDrag: ({
        movement: [, y],
        delta: [, dy],
        down,
        memo = window.scrollY,
      }) => {
        // This is a tricky bit: when the page is transitioning from drag
        // we "wait" until the user releases its finger / mouse (ie `down === false`)
        // then if the window scrollY is already set to 0, that's fine we can directly
        // resolve the promise that will then trigger the transition to complete.
        // If the window scrollY is *not* equal to zero, then we set the touchEnd flag
        // to true, so that our onScroll listener can resolve the promise on its own.
        if (transitioningFromDrag.current) {
          if (!down)
            window.scrollY === 0
              ? endResolve.current()
              : (touchEnded.current = true)
          return
        }

        // When the page is exiting, or when the scroll is strictly positive
        // or when we're dragging upwards, we don't want anything to happen.
        if (!inProp || y - memo <= 0 || (!isDragging.current && dy <= 0))
          return memo

        // We set dragging to true and add the drag class
        if (!isDragging.current) setDragging(true)

        // ...we calculate the progress
        const progress = (y - memo) / DRAG_LIMIT

        // When the progress is greater than 1, we trigger the drag transition
        // and navigate back to the list page
        if (progress > 1) {
          transitioningFromDrag.current = true
          navigate('/', ref.current)
        }
        // Otherwise, while the mouse / finger is pressed, we set the scale and
        // border radius according to the progress
        else if (down)
          set({
            scale: 1 - progress * (1 - DRAG_MINIMUM_SCALE),
            borderRadius: 16 * progress,
            immediate: true,
          })
        // If the button is released, we reset the page style, and once that's done
        // we unset isDragging.
        else
          set({
            to: async next => {
              await next({ scale: 1, borderRadius: 0, config: config.stiff })
              setDragging(false)
            },
          })

        // memo holds the scroll y value when the drag gesture has started
        return memo
      },
      // Here is our scroll handler
      onScroll: ({ xy: [, y] }) => {
        // So when we're transitioning from drag, we just need to wait
        // for the scroll to come back to 0 and resolve the promise
        // so that the transition can complete.
        if (transitioningFromDrag.current) {
          if (y >= 0 && touchEnded.current) endResolve.current()
          return
        }

        // This just sets the close icon to black when we're passed the cover.
        setInvertClose(y > 470)

        // When we're still dragging the cover and we're scrolling positively
        // we cancel the drag and reset our page style.
        if (!transitioningFromDrag.current && y >= 0 && isDragging.current) {
          setDragging(false)
          set({ scale: 1, borderRadius: 0, immediate: true })
        }
      },
    },
    { domTarget: window }
  )
  useEffect(bind, [bind])

  return (
    <CSSTransition
      in={inProp}
      addEndListener={animListener}
      unmountOnExit
      {...props}>
      <div className="article-wrapper">
        <a.div className="overlay" style={{ opacity }} />
        <a.article ref={ref} style={{ visibility: 'hidden', ...style }}>
          <i
            className={`close ${invertClose ? 'invert' : ''}`}
            onClick={() => navigate('/', ref.current)}
            style={{ marginLeft: maxWidth - 56 }}
          />
          <div>
            <a.figure style={{ backgroundImage: `url(${cover})`, height: fh }}>
              <div className="title">
                <h3>{category}</h3>
                <h2>{title}</h2>
              </div>
            </a.figure>
            <a.p style={{ width: maxWidth, y: fh.to(f => f - 500) }}>
              {text}
            </a.p>
          </div>
        </a.article>
      </div>
    </CSSTransition>
  )
}

export default memo(Page)
