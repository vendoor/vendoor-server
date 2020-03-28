const config = require('../../config/config').get('version');


module.exports = {
    method: 'GET',
    url: '/version',
    async handler() {
        return config.pretty;
    }
};
