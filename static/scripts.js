/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de usuários via requisição GET
  --------------------------------------------------------------------------------------
*/
const getUsers = async () => {
  let url = 'http://127.0.0.1:5000/usuarios';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.usuarios.forEach((item) => {
        insertUser(item.nome, item.id); // Passa o id e o nome
      });
    })
    .catch((error) => {
      console.error('Erro ao carregar usuários:', error);
    });
};


/*
--------------------------------------------------------------------------------------
Função para adicionar um novo usuário via requisição POST
--------------------------------------------------------------------------------------
*/
const postUser = async (userName) => {
  const formData = new FormData();
  formData.append('nome', userName);

  const url = 'http://127.0.0.1:5000/usuario';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.text();
      throw new Error(error || 'Erro ao adicionar usuário.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar o usuário.');
  }
};


/*
--------------------------------------------------------------------------------------
Função para inserir um usuário na tabela exibida
--------------------------------------------------------------------------------------
*/
const insertUser = (userName, userId) => {
  let table = document.getElementById('userList');
  let row = table.insertRow();
  row.setAttribute('data-id', userId); // Armazena o ID como atributo da linha

  let cellName = row.insertCell(0);
  let cellActions = row.insertCell(1);
  cellName.textContent = userName;
  cellActions.appendChild(createDeleteButton(userName, userId, row));
};

/*
--------------------------------------------------------------------------------------
Função para inserir um novo usuário na tabela e no servidor
--------------------------------------------------------------------------------------
*/
const newUser = () => {
  const userName = document.getElementById('newUserInput').value;

  if (userName === '') {
    alert('O nome do usuário não pode estar vazio!');
  } else {
    insertUser(userName);
    postUser(userName);
    alert('Usuário adicionado com sucesso!');
  }
};
/*
--------------------------------------------------------------------------------------
Função para criar botão de exclusão para cada item
--------------------------------------------------------------------------------------
*/
const createDeleteButton = (userName, userId, row) => {
  let button = document.createElement('button');
  button.textContent = 'Excluir';
  button.className = 'delete-btn';
  button.onclick = () => {
    if (confirm('Você tem certeza que deseja excluir este usuário?')) {
      deleteUser(userName, userId, row);
    }
  };
  return button;
};


/*
--------------------------------------------------------------------------------------
Função para remover um usuário da tabela e do servidor
--------------------------------------------------------------------------------------
*/
const deleteUser = (userName, userId, row) => {
  console.log(`Excluindo usuário: Nome=${userName}, ID=${userId}`);

  let url = `http://127.0.0.1:5000/usuario?nome=${encodeURIComponent(userName)}&id=${userId}`;

  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        row.remove(); // Remove a linha da tabela
        alert('Usuário removido com sucesso.');
      } else {
        alert('Erro ao remover usuário.');
      }
    })
    .catch((error) => {
      console.error('Erro ao remover usuário:', error);
      alert('Não foi possível remover o usuário.');
    });
};


/*
--------------------------------------------------------------------------------------
Função inicial para carregar os usuários na tabela ao abrir a página
--------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  getUsers();

  document.getElementById('addUserButton').onclick = async () => {
      let userName = document.getElementById('newUserName').value;
      if (userName.trim() === '') {
          alert('Por favor, insira um nome válido.');
          return;
      }

      const result = await postUser(userName);
      if (result) {
          insertUser(userName);
          alert('Usuário adicionado com sucesso!');
          document.getElementById('newUserName').value = '';
      }
  };
});
/*
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Categoria
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
--------------------------------------------------------------------------------------
Função para obter a lista de categorias via requisição GET
--------------------------------------------------------------------------------------
*/
const getCategories = async () => {
  const url = 'http://127.0.0.1:5000/categorias';
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Erro ao carregar categorias');

    const data = await response.json();
    
    // Atualiza o select das categorias nos filmes
    const categorySelect = document.getElementById('movieCategory');
    categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>'; // Limpa as opções existentes
    
    // Atualiza a tabela de categorias
    const categoryTable = document.getElementById('categoryList');
    categoryTable.innerHTML = ''; // Limpa as linhas existentes

    data.categorias.forEach((categoria) => {
      // Adiciona as categorias ao select
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nome;
      categorySelect.appendChild(option);

      // Adiciona as categorias à tabela
      insertCategory(categoria.nome, categoria.id);
    });
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    alert('Não foi possível carregar as categorias.');
  }
};



/*
--------------------------------------------------------------------------------------
Função para adicionar uma nova categoria via requisição POST
--------------------------------------------------------------------------------------
*/
const postCategory = async (categoryName) => {
  const formData = new FormData();
  formData.append('nome', categoryName);

  const url = 'http://127.0.0.1:5000/categoria';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.text();
      throw new Error(error || 'Erro ao adicionar categoria.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar a categoria.');
  }
};

/*
--------------------------------------------------------------------------------------
Função para inserir uma categoria na tabela exibida
--------------------------------------------------------------------------------------
*/
const insertCategory = (categoryName, categoryId) => {
  let table = document.getElementById('categoryList');
  let row = table.insertRow();
  row.setAttribute('data-id', categoryId); // Armazena o ID como atributo da linha

  let cellName = row.insertCell(0);
  let cellId = row.insertCell(1);
  let cellActions = row.insertCell(2);
  cellName.textContent = categoryName;
  cellId.textContent = categoryId;
  cellActions.appendChild(createDeleteCategoryButton(categoryName, categoryId, row));
};

/*
--------------------------------------------------------------------------------------
Função para adicionar uma nova categoria à tabela e ao servidor
--------------------------------------------------------------------------------------
*/
const newCategory = () => {
  const categoryName = document.getElementById('newCategoryInput').value;

  if (categoryName === '') {
    alert('O nome da categoria não pode estar vazio!');
  } else {
    insertCategory(categoryName);
    postCategory(categoryName);
    alert('Categoria adicionada com sucesso!');
  }
};

/*
--------------------------------------------------------------------------------------
Função para criar botão de exclusão para cada categoria
--------------------------------------------------------------------------------------
*/
const createDeleteCategoryButton = (categoryName, categoryId, row) => {
  let button = document.createElement('button');
  button.textContent = 'Excluir';
  button.className = 'delete-btn';
  button.onclick = () => {
    if (confirm('Você tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(categoryName, categoryId, row);
    }
  };
  return button;
};

/*
--------------------------------------------------------------------------------------
Função para remover uma categoria da tabela e do servidor
--------------------------------------------------------------------------------------
*/
const deleteCategory = (categoryName, categoryId, row) => {
  console.log(`Excluindo categoria: Nome=${categoryName}, ID=${categoryId}`);

  const url = `http://127.0.0.1:5000/categoria?nome=${encodeURIComponent(categoryName)}&id=${categoryId}`;

  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        row.remove(); // Remove a linha da tabela
        alert('Categoria removida com sucesso.');
      } else {
        alert('Erro ao remover categoria.');
      }
    })
    .catch((error) => {
      console.error('Erro ao remover categoria:', error);
      alert('Não foi possível remover a categoria.');
    });
};

/*
--------------------------------------------------------------------------------------
Função inicial para carregar as categorias na tabela ao abrir a página
--------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  getCategories();

  document.getElementById('addCategoryButton').onclick = async () => {
    let categoryName = document.getElementById('newCategoryName').value;
    if (categoryName.trim() === '') {
      alert('Por favor, insira um nome válido.');
      return;
    }

    const result = await postCategory(categoryName);
    if (result) {
      insertCategory(categoryName);
      alert('Categoria adicionada com sucesso!');
      document.getElementById('newCategoryName').value = '';
    }
  };
});
/*
Filme
*/
/*
--------------------------------------------------------------------------------------
Função para obter a lista de filmes via requisição GET
--------------------------------------------------------------------------------------
*/
const getMovies = async () => {
  const url = 'http://127.0.0.1:5000/filmes';
  fetch(url, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      
      data.filmes.forEach((item) => {
        insertMovie(item.titulo, item.id, item.categoria_id,item.nota); // Passa os dados do filme
      });
    })
    .catch((error) => {
      console.error('Erro ao carregar filmes:', error);
    });
};

/*
--------------------------------------------------------------------------------------
Função para adicionar um novo filme via requisição POST
--------------------------------------------------------------------------------------
*/
const postMovie = async (movieName, categoryId, userRating) => {
  const formData = new FormData();
  formData.append('titulo', movieName);
  formData.append('categoria_id', categoryId);
  formData.append('nota', userRating)
  const url = 'http://127.0.0.1:5000/filme';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.text();
      throw new Error(error || 'Erro ao adicionar filme.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Não foi possível adicionar o filme.');
  }
};


/*
--------------------------------------------------------------------------------------
Função para inserir um filme na tabela exibida
--------------------------------------------------------------------------------------
*/
const insertMovie = (movieName, movieId, categoryId,userRating) => {
  let table = document.getElementById('movieList');
  let row = table.insertRow();
  row.setAttribute('data-id', movieId); // Armazena o ID como atributo da linha

  let cellName = row.insertCell(0);
  let cellCategory = row.insertCell(1);
  let cellRating = row.insertCell(2)
  let cellActions = row.insertCell(3);

  cellName.textContent = movieName;
  cellCategory.textContent = categoryId; 
  cellRating.textContent = userRating;
  cellActions.appendChild(createDeleteMovieButton(movieName, movieId, row));
};

/*
--------------------------------------------------------------------------------------
Função para criar botão de exclusão para cada filme
--------------------------------------------------------------------------------------
*/
const createDeleteMovieButton = (movieName, movieId, row) => {
  let button = document.createElement('button');
  button.textContent = 'Excluir';
  button.className = 'delete-btn';
  button.onclick = () => {
    if (confirm('Você tem certeza que deseja excluir este filme?')) {
      deleteMovie(movieName, movieId, row);
    }
  };
  return button;
};

/*
--------------------------------------------------------------------------------------
Função para remover um filme da tabela e do servidor
--------------------------------------------------------------------------------------
*/
const deleteMovie = (movieName, movieId, row) => {
  console.log(`Excluindo filme: Nome=${movieName}, ID=${movieId}`);

  const url = `http://127.0.0.1:5000/filme?nome=${encodeURIComponent(movieName)}&id=${movieId}`;

  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        row.remove(); // Remove a linha da tabela
        alert('Filme removido com sucesso.');
      } else {
        alert('Erro ao remover filme.');
      }
    })
    .catch((error) => {
      console.error('Erro ao remover filme:', error);
      alert('Não foi possível remover o filme.');
    });
};
/*
--------------------------------------------------------------------------------------
Função inicial para carregar os filmes na tabela ao abrir a página
--------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  getMovies();
  getCategories(); // Carrega as categorias no início

  document.getElementById('addMovieButton').onclick = async () => {
    let movieName = document.getElementById('newMovieName').value;
    let categoryId = document.getElementById('movieCategory').value;
    let userRating = document.getElementById('movieRating').value;

    if (movieName.trim() === '' || categoryId.trim() === '' || userRating.trim() === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const result = await postMovie(movieName, categoryId, userRating);
    if (result) {
      insertMovie(movieName, result.id, categoryId, userRating);
      alert('Filme adicionado com sucesso!');
      document.getElementById('newMovieName').value = '';
      document.getElementById('movieCategory').value = '';
      document.getElementById('movieRating').value = '';
    }
  };
});
/*
--------------------------------------------------------------------------------------
Avaliação
--------------------------------------------------------------------------------------
*/
/*
--------------------------------------------------------------------------------------
Função para obter a lista de filmes e carregar as opções de avaliação
--------------------------------------------------------------------------------------
*/
const getMoviesForEvaluation = async () => {
  const url = 'http://127.0.0.1:5000/filmes';
  try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error('Erro ao carregar filmes');

      const data = await response.json();

      const movieSelect = document.getElementById('avaliarFilme');
      movieSelect.innerHTML = '<option value="">Selecione um filme</option>';

      data.filmes.forEach((filme) => {
          const option = document.createElement('option');
          option.value = filme.id;
          option.textContent = filme.titulo;
          movieSelect.appendChild(option);
      });
  } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      alert('Não foi possível carregar os filmes.');
  }
};

/*
--------------------------------------------------------------------------------------
Função para adicionar uma avaliação de filme
--------------------------------------------------------------------------------------
*/
const addMovieEvaluation = async () => {
  const movieId = document.getElementById('avaliarFilme').value;
  const rating = document.getElementById('notaAvaliacao').value;

  if (!movieId || !rating) {
      alert('Por favor, selecione um filme e forneça uma nota.');
      return;
  }

  const formData = new FormData();
  formData.append('filme_id', movieId);
  formData.append('nota', rating);
  formData.append('usuario_id', 1); // Exemplo, você pode substituir pelo ID do usuário logado

  const url = 'http://127.0.0.1:5000/avaliacao';

  try {
      const response = await fetch(url, {
          method: 'POST',
          body: formData,
      });

      if (response.ok) {
          alert('Avaliação adicionada com sucesso!');
          getMoviesForEvaluation();  // Recarrega a lista de filmes
          updateMovieRating(movieId); // Atualiza a média de avaliação do filme
      } else {
          const error = await response.text();
          throw new Error(error || 'Erro ao adicionar avaliação.');
      }
  } catch (error) {
      console.error('Erro:', error);
      alert('Não foi possível adicionar a avaliação.');
  }
};

/*
--------------------------------------------------------------------------------------
Função para atualizar a média de avaliação de um filme
--------------------------------------------------------------------------------------
*/
const updateMovieRating = async (movieId) => {
  const url = `http://127.0.0.1:5000/filme/${movieId}`;
  try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) throw new Error('Erro ao carregar o filme');

      const movie = await response.json();
      document.getElementById('notaMedia').textContent = movie.nota || '-';
  } catch (error) {
  }
};

/*
--------------------------------------------------------------------------------------
Função inicial para carregar filmes na página e configurar eventos
--------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
  getMoviesForEvaluation(); // Carrega os filmes ao abrir a página

  document.getElementById('addAvaliacaoButton').onclick = addMovieEvaluation;
});
