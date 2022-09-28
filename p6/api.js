const BASE_URL = "https://picsum.photos";
const LIMIT = 100;
const SIZE = 200;

async function getPhotoList() {
    const r = await fetch(BASE_URL + "/v2/list?limit=" + LIMIT);
    if (!r.ok) {
        return [];
    } else {
        const photoList = await r.json();
        const photoListSize = [];
        photoList.forEach((foto) => {
            if (foto.width > foto.height) {
                photoListSize.push(foto);
            }
        });
        Utils.shuffle(photoListSize);
        return photoListSize.slice(0, cantidadfotos);
    }
}

async function getPhoto(id, w = SIZE, h = SIZE) {
    const photo = await fetch(BASE_URL + "/id/" + id + "/" + w + "/" + h);
    return photo.url;
}
