
import { serve     } from "https://deno.land/std@0.182.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.182.0/http/file_server.ts";
import { openSimplexNoise2D } from "https://deno.land/x/noise/mod.ts";
import * as uuid from "https://deno.land/std@0.119.0/uuid/mod.ts";

const MAX = 2 ** 24
const period = 41.66666667
const squares = new Map ()
let time = Date.now ()

const req_handler = async req => {
   const path = new URL(req.url).pathname

   const upgrade = req.headers.get ("upgrade") || ""
   if (upgrade.toLowerCase () == "websocket") {

      const { socket, response } = Deno.upgradeWebSocket (req)
      const id = uuid.v1.generate ()

      socket.onopen = () => {

         squares.set (id, new FloatingSquare (socket))
         console.log (`welcome, ${ id }.`)

         const data = { 
            'type' : `id`,
            'body' : id,
         }

         socket.send (JSON.stringify (data))

      }

      socket.onerror = e => console.log(`socket error: ${ e.message }`)

      socket.onclose = () => {
         squares.delete (id)
      }

      socket.onmessage = e => {
         const obj = JSON.parse (e.data)
         console.log (`message recieved: ${ obj }`)
      }

      return response
   }

   let new_path = `public${ path }`

   if (new_path.endsWith (`/`)) {
      new_path += `index.html`
   }

   return serveFile (req, new_path)
}

serve (req_handler, { port: 80 })

function update () {
   time += period

   squares.forEach ((s, i) => {
      s.send_data (time)
   })

   check_squares ()

   setTimeout (update, period)
}

update ()

class FloatingSquare {
   constructor(websocket) {
      this.ws       = websocket
      this.speed    = 0.0004
      this.noise2D  = openSimplexNoise2D (Math.random () * MAX)
      this.x = Math.random () * MAX
      this.y = Math.random () * MAX
   }

   send_data (t) {
      const adj_t = t * this.speed

      const data = {
         type : `data`,
         body : {
            x: this.noise2D (adj_t + this.x, this.y),
            y: this.noise2D (this.x, adj_t + this.y)
         }
      }

      console.log (`sending ${ data }`)

      this.ws.send (JSON.stringify (data))

   }
}

function check_squares () {
   if (squares.length == 0) return

   const removals = []

   squares.forEach (s => {
      if (s.ws.readyState == 3) removals.push (s.key)
   })

   if (removals.length) removals.forEach (id => {
         squares.delete (id)
   })
}

