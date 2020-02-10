import Notion from './src/notion';

const options = {
  token_v2:
    '22d150c20848dff04e398814a4467a279195f1e09149d648ce593cd786929045e36a6d74e530dcde8a44a09fc7d38f100689c2de7055043bdd45655c949df5609ca7af516a58fabb4f1946ec6ee8'
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
