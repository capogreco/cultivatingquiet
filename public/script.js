document.body.style.margin   = 0
document.body.style.overflow = `hidden`
document.body.style.background = `black`

// const ws_address = `ws://localhost/`
const ws_address = `wss://capogreco-cultivatingquiet.deno.dev/`

const socket = new WebSocket (ws_address)

socket.onmessage = msg => {
   const obj = JSON.parse (msg.data)
   console.dir (`${ obj.type } message recieved: `, obj)
   if (obj.type == `data`) {
      squuare.x_pos = obj.body[0]
      squuare.y_pos = obj.body[1]
      squuare.z_pos = obj.body[2]
   }
}

const cnv = document.getElementById (`cnv`)
cnv.width = innerWidth
cnv.height = innerHeight
const ctx = cnv.getContext(`2d`)

class Squuare {
   constructor () {
      this.size  = Math.random () * 300
      this.x_pos = 0
      this.y_pos = 0
   }

   draw () {
      const m = { x: innerWidth / 2, y: innerHeight / 2 }

      let x = this.x_pos * innerWidth
      x += innerWidth / 2
      x -= this.size / 2

      let y = this.y_pos * innerHeight
      y += innerHeight / 2
      y -= this.size / 2

      console.log (x, y)
      ctx.fillStyle = "white"
      ctx.fillRect (x, y, this.size, this.size)
   }
}

const squuare = new Squuare ()

console.dir (squuare)

function draw_frame () {
   ctx.fillStyle = `black`
   ctx.fillRect (0, 0, innerWidth, innerHeight)
   squuare.draw ()
   requestAnimationFrame (draw_frame)
}

draw_frame ()