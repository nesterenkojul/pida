import * as msg from "./messages.js";


// creates image and metadata upload forms
export function createUploader(type, blockId) {
    var block = document.getElementById(blockId);
    var form = block.querySelector(".uploadForm");
    var buttons = block.querySelector(".uploadBbuttons");
    var info = block.querySelector(".uploadInfo");
    var uploadBtn = block.querySelector(".uploadBtn");
    var cancelBtn = NaN;

    function convertFileSize(size) {
        if (size < 1e3) {
            return `${size} bytes`;
        } else if (size >= 1e3 && size < 1e6) {
            return `${(size / 1e3).toFixed(1)} KB`;
        } else {
            return `${(size / 1e6).toFixed(1)} MB`;
        }
    }

    function clearInput() {
        var emptyForm = document.createElement("input");
        emptyForm.type = "file";
        form.files = emptyForm.files;
    }

    function clearInfo() {
        info.innerHTML = "";
        if (cancelBtn) {
            cancelBtn.remove();
            cancelBtn = NaN;
        }
    }

    function createCancelBtn() {
        cancelBtn = document.createElement("button");
        cancelBtn.className = "cancelBtn";
        cancelBtn.innerHTML = msg.cancel_btn;
        cancelBtn.addEventListener('click', () => {
            clearInput();
            clearInfo();
        });
        buttons.appendChild(cancelBtn);
    }

    function validateFileType(file) {
        const validFileTypes = [
          "image/jpg",
          "image/jpeg", 
          "image/png", 
          "application/pdf",
        ];
        return validFileTypes.includes(file.type);
    }

    async function acceptMeta() {
        clearInfo();
        var file = form.files[0];
        var totalSize = convertFileSize(file.size);
        if (totalSize.split(' ')[1] == "MB" && Number(totalSize.split(' ')[0]) > msg.csv_file_size_limit) {
            info.style.color = '#ff4000';
            info.innerHTML = msg.csv_size_exceeds.replace('%', totalSize);
            clearInput();
            return;
        }
        if (file.type != 'text/csv') {
            var filetype = file.type.includes('/') ? file.type.split('/').pop().toUpperCase() : file.type.toUpperCase();
            info.style.color = '#ff4000';
            var infomsg = !filetype ? 
                    (msg.language == 'eng' ? msg.not_csv.replace('a type %', 'an undefined type') : 
                    msg.not_csv.replace('тип %', 'неопределенного типа')) : 
                    msg.not_csv.replace('%', filetype);
            info.innerHTML = infomsg;
            clearInput();
            return;
        }
        info.style.color = 'inherit';
        info.innerHTML = msg.confirm_csv.replace('%name', file.name).replace('%size', totalSize);
        createCancelBtn();
    }

    async function acceptFile() {
        clearInfo();
        var files = form.files;
        if (files.length > msg.file_count_limit) {
            info.style.color = '#ff4000';
            info.innerHTML = msg.total_count_exceeds;
            clearInput();
            return;
        }
        var totalSize = Array.from(files).reduce((acc, curr) => {
            return acc += curr.size;
        }, 0);
        totalSize = convertFileSize(totalSize);
        if (totalSize.split(' ')[1] == "MB" && Number(totalSize.split(' ')[0]) > msg.total_file_size_limit) {
            info.style.color = '#ff4000';
            info.innerHTML = msg.total_size_exceeds.replace('%', totalSize);
            clearInput();
            return;
        }
        var names = new Set();
        for (var file of files) {
            var fileSize = convertFileSize(file.size);
            if (fileSize.split(' ')[1] == "MB" && Number(fileSize.split(' ')[0]) > msg.single_file_size_limit) {
                info.style.color = '#ff4000';
                info.innerHTML = msg.single_size_exceeds.replace('%', fileSize);
                clearInput();
                return;
            }
            if (!validateFileType(file)) {
                var filetype = file.type.includes('/') ? file.type.split('/').pop().toUpperCase() : file.type.toUpperCase();
                var infomsg = !filetype ? 
                    (msg.language == 'eng' ? msg.wrong_file_type.replace('type %', 'undefined type') : 
                    msg.wrong_file_type.replace('типа %', 'неопределенного типа')) : 
                    msg.wrong_file_type.replace('%', filetype);
                info.style.color = '#ff4000';
                info.innerHTML = infomsg;
                clearInput();
                return;
            }
            if (names.has(file.name)) {
                info.style.color = '#ff4000';
                info.innerHTML = msg.duplicate_file_names.replace('%name', file.name);
                clearInput();
                return;
            }
            names.add(file.name);
        }
        info.style.color = 'inherit';
        var infomsg = files.length == 1 ? 
                    (msg.language == 'eng' ? msg.confirm_files.replace('files', 'file') : 
                    msg.confirm_files.replace('файлов', 'файл').replace('Выбрано', 'Выбран')) : 
                    (msg.language == 'rus' && files.length < 5 ? msg.confirm_files.replace('файлов', 'файла') : 
                    msg.confirm_files);
        info.innerHTML = infomsg.replace('%count', files.length).replace('%size', totalSize);
        createCancelBtn();
    }

    if (type == 'meta') {
        form.addEventListener('change', acceptMeta);
    } else if (type == 'file') {
        form.addEventListener('change', acceptFile);
    } else {
        throw Error("Only types 'meta' and 'file' are accepted.");
    }
    uploadBtn.addEventListener('click', () => {form.click();});
}