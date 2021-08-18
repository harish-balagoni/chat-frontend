class LoaderService {
    loaderElement = null;
    createLoaderElement(e) {
        this.loaderElement = e;
        this.hide();
    }
    show() {
        this.loaderElement.style.display = "flex";
    }
    hide() {
        this.loaderElement.style.display = "none";
    }
}
export const loaderService = new LoaderService();