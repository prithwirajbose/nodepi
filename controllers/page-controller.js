var _ = require('lodash'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    hbs = require('hbs');
class PageController {
    constructor(req, res, ctx) {
        this.req = req;
        this.ctx = ctx;
        this.res = res;
    }

    filemanager() {
        var icons = {
            file: 'file-text-fill',
            dir: 'folder-fill',
            symlink: 'folder-symlink-fill'
        };
        var navActions = {
            file: 'view',
            dir: 'explore',
            symlink: 'navigate'
        }
        var fileList = null,
            fileContent = null,
            qryPath = null;
        var action = !_.isNil(_.get(this.req, 'query.action')) && (_.get(this.req, 'query.action') == 'view' ||
                _.get(this.req, 'query.action') == 'explore' || _.get(this.req, 'query.action') == 'navigate') ?
            _.trim(_.get(this.req, 'query.action')) : 'explore';
        if (action == 'explore') {
            qryPath = !_.isNil(_.get(this.req, 'query.path')) && _.get(this.req, 'query.path').indexOf('..') !== 0 ? _.trim(_.get(this.req, 'query.path')) : '';
            var rootPath = path.join(os.homedir(), qryPath);
            var fileList = _.map(fs.readdirSync(rootPath), (o) => {
                var filePath = path.join(rootPath, o);
                var stats = fs.lstatSync(filePath);
                var type = stats.isFile() ? 'file' : (stats.isDirectory() ? 'dir' : 'symlink');
                return {
                    name: o,
                    type: type,
                    size: stats.size,
                    createTs: stats.ctime,
                    path: path.join(qryPath, o),
                    icon: icons[type],
                    navAction: navActions[type]
                };
            });
            fileList.sort((a, b) => {
                var order = ['dir', 'symlink', 'file'];
                return _.indexOf(order, a.type) != _.indexOf(order, b.type) ? (_.indexOf(order, a.type) - _.indexOf(order, b.type)) : (a.name - b.name);
            });
        } else if (action == 'view') {
            qryPath = !_.isNil(_.get(this.req, 'query.path')) && _.get(this.req, 'query.path').indexOf('..') !== 0 ? _.trim(_.get(this.req, 'query.path')) : '';
            var fileFullPath = path.join(os.homedir(), qryPath);
            if (fs.existsSync(fileFullPath) && fs.lstatSync(fileFullPath).isFile()) {
                fileContent = new hbs.handlebars.SafeString(fs.readFileSync(fileFullPath, { encoding: 'utf-8' }));
            }
        }
        return {
            files: fileList,
            fileContent: fileContent,
            currentPath: qryPath
        };
    }
}
module.exports = PageController;