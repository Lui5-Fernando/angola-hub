document.addEventListener('DOMContentLoaded', function () {
    // Variáveis para controle do carregamento progressivo
    var nextPageToken = ''; // Token para a próxima página de resultados
    var loading = false; // Flag para evitar carregamento duplicado

    // Inicializar a API do YouTube
    gapi.load('client', init);

    function init() {
        gapi.client.init({
            apiKey: 'AIzaSyDqD3cq6ily_-cgFF5c0wOwmiMgJL1sP7A',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        }).then(function () {
            // Adicionar um ouvinte de evento de rolagem
            window.addEventListener('scroll', function () {
                // Verificar se o usuário atingiu o final da página
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
                    // Carregar mais vídeos se não estiver carregando atualmente
                    if (!loading) {
                        loading = true;
                        searchVideos('angolano');
                    }
                }
            });

            // Chamar a função para buscar vídeos inicialmente
            searchVideos('angolano');
        });
    }

    function searchVideos(searchTerm) {
        gapi.client.youtube.search.list({
            q: searchTerm,
            part: 'snippet',
            type: 'video',
            maxResults: 10,
            pageToken: nextPageToken, // Adicionar o token da próxima página
        }).then(function (response) {
            displayVideos(response.result.items);
            nextPageToken = response.result.nextPageToken; // Atualizar o token para a próxima página
            loading = false; // Marcar o carregamento como concluído
        }, function (error) {
            console.error('Erro ao buscar vídeos:', error);
            loading = false; // Lidar com erro e marcar o carregamento como concluído
        });
    }

    function displayVideos(videos) {
        var videosContainer = document.getElementById('videos-container');

        videos.forEach(function (video) {
            var videoItem = document.createElement('div');
            videoItem.classList.add('video-item');

            var videoEmbed = document.createElement('iframe');
            videoEmbed.src = `https://www.youtube.com/embed/${video.id.videoId}`;
            videoEmbed.width = 300;
            videoEmbed.height = 200;

            var videoTitle = document.createElement('p');
            videoTitle.textContent = video.snippet.title;

            videoItem.appendChild(videoEmbed);
            videoItem.appendChild(videoTitle);

            videosContainer.appendChild(videoItem);
        });
    }
});
