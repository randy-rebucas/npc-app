import { Server as HTTPServer } from 'http'
import WebSocket from 'ws'
import { parse } from 'url'
import { getSession } from 'next-auth/react'
import { IncomingMessage } from 'http'
import { Session } from 'next-auth'

interface WSMessage {
  type: 'chat' | 'error';
  payload: string | Record<string, unknown>;
  timestamp?: number;
  senderId?: string;
}

let wss: WebSocket.WebSocketServer | null = null

export function initializeWebSocket(server: HTTPServer) {
  if (wss) {
    console.warn('WebSocket server already initialized')
    return
  }

  wss = new WebSocket.WebSocketServer({ noServer: true })

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

        wss?.handleUpgrade(request, socket, head, (ws: WebSocket) => {
          wss?.emit('connection', ws, request, session)
        })
      } catch (err) {
        console.error('WebSocket upgrade error:', err)
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n')
        socket.destroy()
      }
    }
  })

  wss.on('connection', (ws: WebSocket, request: IncomingMessage, session: Session) => {
    console.log(`Client connected: ${session?.user?.email ?? 'unknown'}`)
    
    // Setup heartbeat with proper typing
    let pingInterval: NodeJS.Timeout | null = setInterval(() => {
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

        // Add metadata to the message
        data.timestamp = Date.now()
        data.senderId = session?.user?.id

        switch (data.type) {
          case 'chat':
            wss?.clients.forEach((client: WebSocket) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data))
              }
            })
            break;
          default:
            throw new Error(`Unsupported message type: ${data.type}`)
        }
      } catch (error) {
        const errorMessage: WSMessage = {
          type: 'error',
          payload: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
        ws.send(JSON.stringify(errorMessage))
      }
    })

    ws.on('close', () => {
      console.log(`Client disconnected: ${session?.user?.email ?? 'unknown'}`)
      if (pingInterval) {
        clearInterval(pingInterval)
        pingInterval = null
      }
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      if (pingInterval) {
        clearInterval(pingInterval)
        pingInterval = null
      }
    })
  })

  // Add server cleanup
  process.on('SIGTERM', () => closeWebSocketServer())
  process.on('SIGINT', () => closeWebSocketServer())
}

export function getWebSocketServer() {
  if (!wss) {
    throw new Error('WebSocket server not initialized')
  }
  return wss
}

function closeWebSocketServer() {
  if (wss) {
    wss.clients.forEach((client) => {
      client.close()
    })
    wss.close()
    wss = null
  }
} 