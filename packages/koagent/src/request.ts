import request from 'request';

console.log('start request');
request({ url: 'https://qq.com' }, (error, response) => {
  console.log('finish request');

  if (error) {
    console.error(error);
    return;
  }
  console.log(response);
});
