import * as acc from "./accessors.js";
import * as msg from "./messages.js";
import * as pdfjs from '../assets/pdfjs-4.10.38-dist/build/pdf.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = '../assets/pdfjs-4.10.38-dist/build/pdf.worker.mjs';


// turns the first page of a pdf document into a png image as a thumbnail
// https://stackoverflow.com/a/12921304/22944533
function pdfToImg(pdfFileURL) {
    return new Promise((resolve, reject) => {
        pdfjs.getDocument(pdfFileURL).promise.then(pdf => {
            pdf.getPage(1).then( async page => {
                var viewport = page.getViewport({ scale: 1, });
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d', {preserveDrawingBuffer: true});
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                page.render({canvasContext: context, viewport: viewport}).promise.then(() => {
                    const imgUrl  = canvas.toDataURL();
                    resolve(imgUrl);
                });;
            });
        });
    });
}


export async function returnImageURL(id) {
    const files = await acc.accessFilesById([id], true);
    const file = !!files ? files[0] : null;
    if (!!file && file.type == 'application/pdf') {
        var file_url = URL.createObjectURL(file);
        return pdfToImg(file_url, id);
    
    } else if (!!file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onerror = () => {
              reader.abort();
              reject(new DOMException("Problem parsing input file."));
            };
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }
    return msg.language == 'eng' ? "./assets/dummy_eng.png" : "./assets/dummy_rus.png";
}

// https://stackoverflow.com/a/70544176/22944533
export async function returnImageSize(img_url) {
    return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({
            width: img.width,
            height: img.height,
        });
        img.onerror = (error) => reject(error);
        img.src = img_url;
    });
}



