const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get('/repositories', (request, response) => response.json(repositories));

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const editedRepo = repositories.find(repo => repo.id === id);

  if (!editedRepo) return response.status(400).json({ message: 'Repository not found' });

  repositories.map(repo => {
    if (repo.id === id) {
      if (title) repo.title = title;
      if (url) repo.url = url;
      if (techs) repo.techs = techs;
    }
  });

  return response.json(editedRepo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const deletedRepo = repositories.find(repo => repo.id === id);

  if (!deletedRepo) return response.status(400).json({ message: 'Repository not found' });

  repositories = repositories.filter(repo => repo.id !== id);

  return response.status(204).json({ message: 'Repo deleted' });
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const likedRepo = repositories.find(repo => repo.id === id);

  if (!likedRepo) return response.status(400).json({ message: 'Repository not found' });

  likedRepo.likes += 1;

  return response.json(likedRepo);
});

module.exports = app;
