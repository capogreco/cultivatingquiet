document.body.style.margin   = 0
document.body.style.overflow = `hidden`
document.body.style.background = `black`

const free_elements = []

// call initial frame
requestAnimationFrame (physics_engine)

// function to move the elements around
function physics_engine () {

   // iterate through the free_elements array
   free_elements.forEach (e => {

      // if element is too far to the right
      if (e.offsetLeft > window.innerWidth) {

            // respawn it on the left
            e.style.left = `${ -e.offsetWidth }px`
      }

      // add the elements velocity to its position
      e.style.left = `${ e.offsetLeft + e.x_vel }px`
   })
   
   // call next frame
   requestAnimationFrame (physics_engine)
}

// function to generate elements
// accepts some text as an argument
// assigns it to the parameter 't'
function set_free (t) {

   // create a div element
   const free_div = document.createElement (`div`)

   // assign the text that was passed in
   // to the innerText property of the div
   free_div.innerText = t 

   // format the div
   free_div.style.fontSize   = '36px'
   free_div.style.fontWeight = 'bold'
   free_div.style.fontStyle  = 'italic'
   free_div.style.color      = 'hotpink'
   free_div.style.whiteSpace = 'nowrap'

   // setting .position to 'fixed' means
   // the position is set against the viewport
   // rather than the document
   free_div.style.position   = 'fixed'

   // incorporate the div in the DOM
   document.body.append (free_div)

   // .offsetHeight is the height of the div element
   // multiplied by how many elements are already in
   // the free_elements array
   const y_offset = free_div.offsetHeight * free_elements.length

   // set the new element underneath the other elements
   free_div.style.top = `${ y_offset }px`

   // .offsetWidth is the width of the div
   // start the div to the left of the screen
   free_div.style.left = `${ -free_div.offsetWidth }px`

   // we can add properties to the DOM objects
   // simply assign to a new property
   // and the value stays there!
   // here we are storing a random x-velocity
   free_div.x_vel = Math.random () * 10

   // add the div to the free_elements array
   free_elements.push (free_div)

   if (y_offset < innerHeight) set_free (t)
}

set_free ('Hello, Richard.')
