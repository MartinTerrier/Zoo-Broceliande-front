export default class Route {
    constructor(url, title, authorize, pathHtml, pathJS = "") {
        this.url = url;
        this.title = title;
        this.authorize = authorize;
        this.pathHtml = pathHtml;
        this.pathJS = pathJS;
    }
}