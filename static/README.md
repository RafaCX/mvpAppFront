
## Executando o Frontend

1. Certifique-se de que o arquivo `app.py` está configurado para servir os arquivos estáticos do frontend:
   ```python
   # Configurar caminho do frontend
   FRONTEND_PATH = "../mvpAppFront/static"
   # em minha pasta estava salvo como mvp_app_front mas como salvei o repository como mvpAppFront eu alterei para nao dar erro com o sistema na hora de rodar o front
   
   # Rota para servir o frontend
   @app.route('/')
   def index():
       """Serve a página inicial do frontend."""
       return send_from_directory(FRONTEND_PATH, 'index.html')

   @app.route('/<path:path>')
   def serve_static_files(path):
       """Serve arquivos estáticos do frontend."""
       return send_from_directory(FRONTEND_PATH, path)
   ```

2. Faça o download do projeto do frontend.

3. Para visualizar o frontend, basta abrir o arquivo `index.html` no seu navegador.