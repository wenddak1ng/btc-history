import fastify from 'fastify'
import cors from '@fastify/cors'
import getOHLCV from './api';

const server = fastify()
server.register(cors)

interface RequestQuery {
  symbol: string;
  startTime: number;
  endTime: number;
}

server.get('/data', async (request, reply) => {
  try {
    const { symbol, startTime, endTime } = request.query as RequestQuery;
    const result = await getOHLCV(symbol, Number(startTime), Number(endTime));

    reply.send(result);
  } catch (e) {
    console.error(e)
  }
})

server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})