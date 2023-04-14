document.body.style.margin   = 0
document.body.style.overflow = `hidden`
document.body.style.background = `black`

// const ws_address = `ws://localhost/`
const ws_address = `wss://cultivatingquiet.space/`

const socket = new WebSocket (ws_address)

socket.onmessage = msg => {
   const obj = JSON.parse (msg.data)
   // console.dir (`${ obj.type } message recieved: `, obj)
   if (obj.type == `data`) {
      squuare.update_pos (obj.body)
   }
}

const cnv = document.getElementById (`cnv`)
cnv.width = innerWidth
cnv.height = innerHeight
const ctx = cnv.getContext(`2d`)

class Squuare {
   constructor (ctx) {
      console.log (`constructing!`)

      this.ctx = ctx

      this.frame_count = 1

      const short_side = innerWidth > innerHeight ? innerHeight : innerWidth

      this.size = { 
         x: short_side / 6,
         y: short_side / 6
      }

      this.pos = {
         x: 0,
         y: 0
      }

      this.last_pos = {
         x: 0,
         y: 0
      }

      this.colour  = `white`

      this.child        = []
      this.cur_gen      = 0
      this.tot_gen      = 128
      this.child_exists = false

   }

   switch_colour () {
      const is_black = this.colour == `black`
      this.colour = is_black ? `white` : `black`
   }

   update_pos (p) {
      Object.assign (this.last_pos, this.pos)
      Object.assign (this.pos, p)
      if (this.child_exists) this.child.update_pos (this.last_pos)
   }

   draw () {

      // console.log (this.cur_gen)

      if (this.child_exists) this.child.draw ()

      const mid = { 
         x: innerWidth / 2,
         y: innerHeight / 2
      }

      const p = this.cur_gen / this.tot_gen


      const new_pos = {
         x: this.pos.x * (1 - p),
         y: this.pos.y * (1 - p)
      }

      const new_size = {
         x: (this.size.x * (1 - p)) + (p * innerWidth),
         y: (this.size.y * (1 - p)) + (p * innerHeight),
      }

      let x = new_pos.x * (1 - p)
      x += 1
      x *= mid.x
      x -= new_size.x / 2

      let y = new_pos.y * (1 - p)
      y += 1
      y *= mid.y
      y -= new_size.y / 2

      let colour_sig = this.frame_count * 0.001 * Math.PI
      // colour_sig += Math.PI
      colour_sig = Math.cos (colour_sig) + 1
      colour_sig *= 127.5
      this.ctx.fillStyle = `rgb(${ colour_sig }, ${ colour_sig }, ${ colour_sig })` 
      this.ctx.fillRect (x, y, new_size.x, new_size.y)

      const birth_frame = (this.frame_count % (2 ** 4)) == 0
      if (birth_frame) this.switch_colour ()

      if (!this.child_exists && birth_frame) this.birth ()

      this.frame_count++
   }

   birth () {
      console.log (`${ this.cur_gen } is birthing`)
      if (this.cur_gen < this.tot_gen) {
         this.child = new Squuare (this.ctx)
         this.child_exists = true
         this.child.cur_gen = this.cur_gen + 1
         Object.assign (this.child.pos, this.last_pos)
      }
      // else debugger
   }
}

const squuare = new Squuare (ctx)

function draw_frame () {
   ctx.fillStyle = `deeppink`
   ctx.fillRect (0, 0, innerWidth, innerHeight)
   squuare.draw ()
   requestAnimationFrame (draw_frame)
}

draw_frame ()

document.onresize = () => location.reload ()