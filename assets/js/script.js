document.addEventListener('DOMContentLoaded', function () {
    var nextPageToken = ''; 
    var loading = false; 


    gapi.load('client', init);

    function init() {
        gapi.client.init({
            apiKey: 'AIzaSyDqD3cq6ily_-cgFF5c0wOwmiMgJL1sP7A',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        }).then(function () {

            window.addEventListener('scroll', function () {

                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {

                    if (!loading) {
                        loading = true;
                        searchVideos('angolano');
                    }
                }
            });

            searchVideos('angolano');
        });
    }

    function searchVideos(searchTerm) {
        gapi.client.youtube.search.list({
            q: searchTerm,
            part: 'snippet',
            type: 'video',
            maxResults: 10,
            pageToken: nextPageToken,
        }).then(function (response) {
            displayVideos(response.result.items);
            nextPageToken = response.result.nextPageToken; 
            loading = false;
        }, function (error) {
            console.error('Erro ao buscar vídeos:', error);
            loading = false; 
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
            videoEmbed.style.borderRadius = '10px'; 
    
            var videoSection = document.createElement('section');
    
            var videoTitle = document.createElement('p');
            videoTitle.textContent = video.snippet.title;
            videoTitle.style.color = '#ffffff';
    
            var thumbsUpIcon = document.createElement('i');
    
            var videoInfoContainer = document.createElement('div');
            videoInfoContainer.classList.add('video-info-container');
 
            var channelName = document.createElement('p');
    
            var viewCount = document.createElement('p');

            var likesCount = document.createElement('span');

            gapi.client.youtube.videos.list({
                part: 'snippet,statistics',
                id: video.id.videoId,
            }).then(function (response) {
                var videoSnippet = response.result.items[0].snippet;
                var videoStatistics = response.result.items[0].statistics;
    
                var channelTitle = videoSnippet.channelTitle;
                var viewCountValue = videoStatistics.viewCount || 0;
                var likeCountValue = parseInt(videoStatistics.likeCount) || 0;
    
                channelName.innerHTML = `${channelTitle}`;
                viewCount.textContent = `Views: ${viewCountValue}`;
                likesCount.innerHTML = `<i class="fa-solid fa-thumbs-up"></i> ${likeCountValue}`;
    
            }).catch(function (error) {
                console.error('Erro ao obter informações do vídeo:', error);
                channelName.textContent = 'Canal: N/A';
                viewCount.textContent = 'Visualizações: N/A';
                likesCount.textContent = '<i class="fa-solid fa-thumbs-up"></i> N/A';
            });
    
            videoInfoContainer.appendChild(channelName);
            videoInfoContainer.appendChild(viewCount);
            videoInfoContainer.appendChild(thumbsUpIcon);
            videoInfoContainer.appendChild(likesCount);
    
            videoSection.appendChild(videoTitle);
            videoSection.appendChild(videoInfoContainer);
    
            videoItem.appendChild(videoEmbed);
            videoItem.appendChild(videoSection);
    
            videosContainer.appendChild(videoItem);
        });
    }
});

var searchInput = document.querySelector("#search-input")
var pesquisaHeader = document.querySelector("#pesquisa-header")
var menuHeader = document.querySelector("#container-menu-header")
var logoHeader = document.querySelector("#logo-header")
var userHeader = document.querySelector("#user-header")
var videosContainer = document.querySelector("#videos-container")
pesquisaHeader.addEventListener('click', () => {
    searchInput.style.display = 'block'
    menuHeader.style.display = 'none'
    logoHeader.style.display = 'none'
    userHeader.style.display = 'none'
    searchInput.focus()
})
videosContainer.addEventListener('click', () => {
    searchInput.style.display = 'none'
    menuHeader.style.display = 'flex'
    logoHeader.style.display = 'flex'
    userHeader.style.display = 'block'
})