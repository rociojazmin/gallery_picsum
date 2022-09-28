let photos = [];
let actual = 0;
let activo = 0;
var cantidadfotos = 21;
var photosize = 500;

document.onkeyup = function (event) {
    if (activo == 1) {
        switch (event.keyCode) {
            case 37:
                prevPhoto();
                break;
            case 39:
                nextPhoto();
                break;
            case 27:
                closePhoto();
                break;
        }
    }

};

function init() {
    document.getElementById("loading").classList.remove("nodisp");
    document.getElementById("gallery").classList.add("nodisp");
    document.getElementById("gallery").innerHTML = '';
    getPhotoList().then(function (photoList) {
        photos = photoList;
        buildGallery();
    });
}

function buildGallery() {
    const cont = document.getElementById("gallery");
    Utils.empty(cont);
    const getPhotos = [];
    photos.forEach(photo => getPhotos.push(getPhoto(photo.id)));
    Promise.all(getPhotos).then(photosSrc => {
        photosSrc.forEach((url, i) => appendThumb(cont, url, i));
        document.getElementById("loading").classList.add("nodisp");
        document.getElementById("gallery").classList.remove("nodisp");
    });
}

function appendThumb(cont, url, i) {
    const imgPhoto = document.createElement("img");
    const photo = photos[i];
    imgPhoto.setAttribute("title", photo.author);
    imgPhoto.setAttribute("alt", photo.author);
    imgPhoto.setAttribute("src", url);
    imgPhoto.onclick = () => showBigPhoto(photo, i, photo.author);
    cont.appendChild(imgPhoto);
}

function showBigPhoto(photo, i, author) {
    const photoCont = document.getElementById("photo-carrousel");
    const imgPhoto = document.getElementById("photo");
    imgPhoto.setAttribute("title", photo.author);
    imgPhoto.setAttribute("alt", photo.author);
    imgPhoto.setAttribute("width", photosize);
    imgPhoto.setAttribute("src", photo.download_url);
    photoCont.classList.remove("nodisp");
    document.getElementById("container").style.opacity = "0.3";
    document.getElementById("photo-carrousel").style.width = photosize + 'px';
    document.getElementById("author").innerHTML = author;
    actual = i;
    activo = 1;
}

function closePhoto() {
    const photoCont = document.getElementById("photo-carrousel");
    photoCont.classList.add("nodisp");
    document.getElementById("container").style.opacity = "1";
    const imgPhoto = document.getElementById("photo");
    imgPhoto.setAttribute("title", "");
    imgPhoto.setAttribute("alt", "");
    imgPhoto.setAttribute("width", 0);
    imgPhoto.setAttribute("src", "");
    activo = 0;
}


function prevPhoto() {
    if (actual == 0) {
        actual = 20
    } else {
        actual = actual - 1;
    }
    showBigPhoto(photos[actual], actual, photos[actual].author);
}
function nextPhoto() {
    if (actual == 20) {
        actual = 0
    } else {
        actual = actual + 1;
    }
    showBigPhoto(photos[actual], actual, photos[actual].author);
}

function change() {
    let quantity = document.getElementById('quantity').value;
    let size = document.getElementById('size').value;
    cantidadfotos = quantity;
    photosize = size;
    init();

}