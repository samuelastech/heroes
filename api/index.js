const http = require('http');
const PORT = 3000;
const DEFAULT_HEADER = { 'Content-Type': 'application/json' };
const HeroFactory = require('../src/factories/heroFactory');
const Hero = require('../src/entities/hero');
const heroService = HeroFactory.generateInstance();

const routes = {
  '/heroes:get': async (request, response) => {
    const { id } = request.queryString;
    const heroes = await heroService.find(id);
    response.write(JSON.stringify({ results: heroes, }));
    return response.end();
  },
  '/heroes:post': async (request, response) => {
    for await (const data of request) {
      try {
        const item = JSON.parse(data);
        const hero = new Hero(item);
        const { error, valid } = hero.isValid();

        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER);
          response.write(JSON.stringify({ error, }));
          return response.end();
        } else {
          const id = await heroService.create(hero);
          response.writeHead(201, DEFAULT_HEADER);
          response.write(JSON.stringify({ success: 'User created', id, }));
          return response.end();
        }
      } catch (error) {
        return handleError(response)(error);
      }
    }
  },
  default: (request, response) => {
    response.write('Hello');
    response.end();
  },
};

const handleError = response => {
  return error => {
    console.log(error);
    response.writeHead(500, DEFAULT_HEADER);
    return response.end();
  };
};

const handler = (request, response) => {
  const { url, method } = request;
  const [first, route, id] = url.split('/');
  request.queryString = { id: isNaN(id) ? id : +id };
  const key = `/${route}:${method.toLowerCase()}`;
  response.writeHead(200, DEFAULT_HEADER);
  const chosen = routes[key] || routes.default;
  return chosen(request, response).catch(handleError(response));
};

const app = http.createServer(handler);
app.listen(PORT, () => console.log(`server running at ${PORT}`));
