const axios = require('axios');

const url = 'https://imagia4.ieti.site/api/analitzar-imatge';
const adminkey = 'dsmzj38qe2paw772'

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer dsmzj38qe2paw772'
};

const payload = {
    prompt: "Describe what's in this image",
    images: ["iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaklEQVQ4T2NkoBAwYtOv9p/hPzbxW4wMGOoxBHBphhmIbgiKAYQ0YzMEbgCxmtENARtAqmZkQ0YNYGCkTizAQpXY2EBOTNRNiYRcQlReQM5EDVGQTNWwDDMTwdRhzY0wyfpIhv+gYMZnAAD8Ci0RnkOJhgAAAABJRU5ErkJgggAA"],
    stream: false
};

axios.post(url, payload, { headers })
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });