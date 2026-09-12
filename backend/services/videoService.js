const axios = require('axios');

class VideoService {
  constructor() {
    this.providers = {
      gogoanime: { baseUrl: 'https://gogoanime.fi', name: 'GogoAnime' },
      nineAnime: { baseUrl: 'https://9anime.to', name: '9Anime' },
      zoro: { baseUrl: 'https://zoro.to', name: 'Zoro' },
      animepahe: { baseUrl: 'https://animepahe.com', name: 'AnimePahe' }
    };
  }

  async findAllStreams(title, episode) {
    return {
      gogoanime: [],
      nineAnime: [],
      zoro: [],
      animepahe: [],
      message: 'Stream providers available'
    };
  }
}

module.exports = new VideoService();
