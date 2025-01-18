import { Server as HTTPServer } from 'http'
import WebSocket from 'ws'
import { parse } from 'url'
import { getSession } from 'next-auth/react'

interface WSMessage {
  type: 'chat' | 'error';
  payload: string | Record<string, unknown>;
}

let wss: WebSocket.Server

export function initializeWebSocket(server: HTTPServer) {
  wss = new WebSocket.Server({ noServer: true })

  server.on('upgrade', async (request, socket, head) => {
    const parsedUrl = parse(request.url ?? '', true)
    
    if (!parsedUrl.pathname) {
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n')
      socket.destroy()
      return
    }

    if (parsedUrl.pathname === '/api/ws') {
      try {
        const session = await getSession({ req: request })
        if (!session) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
          socket.destroy()
          return
        }

        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
          wss.emit('connection', ws, request)
        })
      } catch (err) {
        console.error('WebSocket upgrade error:', err)
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n')
        socket.destroy()
      }
    }
  })

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected')
    
    // Setup heartbeat
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      }
    }, 30000)

    ws.on('message', async (message: Buffer) => {
      try {
        const data: WSMessage = JSON.parse(message.toString())
        
        if (!data.type || !data.payload) {
          throw new Error('Invalid message format')
        }

        // Handle different message types
        switch (data.type) {
          case 'chat':
            // Broadcast to all connected clients
            wss.clients.forEach((client: WebSocket) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
              }
            })
            break;
          // Add more message type handlers here
          default:
            console.warn(`Unhandled message type: ${data.type}`)
        }
      } catch (error) {
        console.error('Error processing message:', error)
        ws.send(JSON.stringify({ type: 'error', payload: 'Invalid message format' }))
      }
    })

    ws.on('close', () => {
      console.log('Client disconnected')
      clearInterval(pingInterval)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      clearInterval(pingInterval)
    })
  })
}

export function getWebSocketServer() {
  return wss
} 