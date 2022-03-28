function onClick() {
    console.log("Working");

    var database = firebase.database();

    database.ref("email").set({ "foo": 19 });
}

const button = document.querySelector("button");
button.onclick = onClick;
