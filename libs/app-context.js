const { v4: uuidv4 } = require('uuid');
class AppContext {
    constructor(req) {
        this.requestId = uuidv4();
        this.user = {
            userId: "Guest"
        };
        this.timestamp = new Date();
    }
}
module.exports = AppContext;