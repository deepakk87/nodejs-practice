import * as https from 'https';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function getCountryName(code) {
  // write your code here
  // API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>
  let pageNumber = 0;
  let apiRes;
  do {
    pageNumber++;
    apiRes = await httpsGet(
      `https://jsonmock.hackerrank.com/api/countries?page=${pageNumber}`,
    );
    const filtered = apiRes.data.filter(
      (country) => country.alpha2Code == code,
    );
    //console.log(pageNumber);
    //console.log(filtered);
    if (filtered.length == 1) {
      return filtered[0].name;
    }
  } while (pageNumber <= apiRes.total_pages);
}

it('test that https get works', async () => {
  // write your code here
  // API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>
  const country = await getCountryName('AF');
  expect(country).toBe('Afghanistan');
});
