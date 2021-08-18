class LoaderService {
    loaderElement = null;
    createLoaderElement(e) {
        this.loaderElement = e;
    }
    show() {
        this.loaderElement.style.display = "flex";
    }
    hide() {
        this.loaderElement.style.display = "none";
    }
}
export const loaderService = new LoaderService();