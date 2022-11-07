import 'graphql-import-node';
import fastify from 'fastify';
import {
  getGraphQLParameters,
  processRequest,
  Request,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendResult,
} from 'graphql-helix';
import { schema } from './schema';
import { contextFactory } from './context';

const server = fastify();
const PORT = 5500;

server.route({
  method: ['POST', 'GET'],
  url: '/graphql',
  handler: async (req, res) => {
    const request: Request = {
      headers: req.headers,
      method: req.method,
      query: req.query,
      body: req.body,
    };

    if (shouldRenderGraphiQL(request)) {
      res.header('Content-Type', 'text/html');
      res.send(
        renderGraphiQL({
          endpoint: '/graphql',
        })
      );
      return;
    }

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      request,
      schema,
      operationName,
      contextFactory,
      query,
      variables,
    });
    sendResult(result, res.raw);
  },
});

server.listen({ port: PORT, host: '0.0.0.0' }, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
