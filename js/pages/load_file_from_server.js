export function loadFileFromServer(filePath, onLoad, onError, ...args) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            if (request.status === 200) {
                const result = request.responseText;
                onLoad(result, ...args);
            } else {
                console.log("Error on request; status " + request.status);
                onError();
            }
        }
    }

    request.open("GET", filePath);
    request.send();
}
