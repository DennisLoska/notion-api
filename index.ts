import Notion from './src/notion';

const options = {
  token_v2:
    '4054b4798589e93d0888cededd508f341919180e18fd8825c4d7a55b8e60c1785e4615c8173b869231a47fe5f2d91efd61e908a75e3f09ac5fe95586c5eaf6c90613917e28c316d225bf9d3ad099'
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
