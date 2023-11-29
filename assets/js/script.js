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
            videoEmbed.style.borderRadius = '10px'; // Pode ajustar conforme necessário
    
            var videoSection = document.createElement('section');
    
            var videoTitle = document.createElement('p');
            videoTitle.textContent = video.snippet.title;
            videoTitle.style.color = '#ffffff'; // Pode ajustar a cor conforme necessário
    
            // Elemento para mostrar o ícone de "thumbs-up"
            var thumbsUpIcon = document.createElement('i');
    
            // Container (div) para incluir nome do canal, número de viws, e quantidade de likes
            var videoInfoContainer = document.createElement('div');
            videoInfoContainer.classList.add('video-info-container'); // Adicione esta linha
    
            // Elemento para mostrar o nome do canal
            var channelName = document.createElement('p');
    
            // Elemento para mostrar o número de visualizações
            var viewCount = document.createElement('p');
    
            // Elemento para mostrar a quantidade de likes
            var likesCount = document.createElement('span');
    
            // Chamada à API para obter informações do vídeo (incluindo nome do canal e número de visualizações)
            gapi.client.youtube.videos.list({
                part: 'snippet,statistics',
                id: video.id.videoId,
            }).then(function (response) {
                var videoSnippet = response.result.items[0].snippet;
                var videoStatistics = response.result.items[0].statistics;
    
                var channelTitle = videoSnippet.channelTitle;
                var viewCountValue = videoStatistics.viewCount || 0;
                var likeCountValue = parseInt(videoStatistics.likeCount) || 0;
    
                // Configurar o texto e adicionar as informações
                channelName.innerHTML = `${channelTitle}`;
                viewCount.textContent = `Views: ${viewCountValue}`;
                likesCount.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> ${likeCountValue}`;
    
            }).catch(function (error) {
                console.error('Erro ao obter informações do vídeo:', error);
                channelName.textContent = 'Canal: N/A';
                viewCount.textContent = 'Visualizações: N/A';
                likesCount.textContent = '<i class="fa-solid fa-thumbs-up"></i> N/A';
            });
    
            // Adicionar os elementos à div de informações
            videoInfoContainer.appendChild(channelName);
            videoInfoContainer.appendChild(viewCount);
            videoInfoContainer.appendChild(thumbsUpIcon);
            videoInfoContainer.appendChild(likesCount);
    
            // Adicionar a div de informações à seção
            videoSection.appendChild(videoTitle);
            videoSection.appendChild(videoInfoContainer);
    
            // Adicionar a seção e o vídeo incorporado ao item de vídeo
            videoItem.appendChild(videoEmbed);
            videoItem.appendChild(videoSection);
    
            // Adicionar o item de vídeo ao contêiner principal
            videosContainer.appendChild(videoItem);
        });
    }
});
