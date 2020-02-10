import Notion from './src/notion';

const options = {
  token_v2:
    ''
};

const api = new Notion({
  token: options.token_v2,
  options: {
    pageUrl: '/posts/',
    colors: {
      red: 'tomato',
      blue: 'rgb(100, 149, 237)',
      purple: '#9933cc'
    }
  }
});

// Use the api here
//01128265-8b1c-4205-bbef-5e1175884f73
//ff95ee49-5fc2-470c-bcc8-e6926595d390

(async () => {
  const p = await api.getPagesByIndexId('01128265-8b1c-4205-bbef-5e1175884f73');
  console.log(p[0]);
})();
