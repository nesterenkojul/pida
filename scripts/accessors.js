// returns a url of the metadata csv-file
export async function accessMetadata(as_text=false) {

    try {
        var block = document.getElementById('uploadBlockMeta');
        var form = block.querySelector(".uploadForm");
        var file = form.files[0];
        const reader = new FileReader();
       
        return new Promise((resolve, reject) => {
            reader.onerror = () => {
              reader.abort();
              reject(new DOMException("Problem parsing input file."));
            };
        
            reader.onload = () => {
              resolve(reader.result);
            };
            if (as_text) {
              reader.readAsText(file);
            } else {
              reader.readAsDataURL(file);
            }
            
          });
  
    } catch(err) {
        throw err;
    }
    
}


// returns a list of all documents urls
export async function accessAllFiles() {

    try {
        var block = document.getElementById('uploadBlockFile');
        var form = block.querySelector(".uploadForm");
        var files = Array.from(form.files);
        var promises = files.map(file => {
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
        })
        return promises;
    
    } catch(err) {
        throw err;
    }
    
}


// returns a document url or a file object itself
export async function accessFilesById(ids, return_file=false) {

    try {
        var block = document.getElementById('uploadBlockFile');
        var form = block.querySelector(".uploadForm");
        var files = Array.from(form.files);
        var filteredFiles = files.filter(f => {
            var fileId = f.name.split(".")[0];
            if (fileId) {
                return ids.includes(fileId);
            }
            return false;
        })

        if (filteredFiles) {
            var promises = filteredFiles.map(file => {
                if (return_file) {
                    return file;
                }
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
            })
            return promises;
        }
        throw Error;
    
    } catch(err) {
        throw err;
    } 
}

/* https://github.com/Inist-CNRS/node-csv-string/blob/master/src/CSV.ts */
export async function guessDelimiter() {
  var data_text = await accessMetadata(true);
  const separators = [',', ';', '|', '\t'];
  const idx = separators
    .map((separator) => data_text.indexOf(separator))
    .reduce((prev, cur) =>
      prev === -1 || (cur !== -1 && cur < prev) ? cur : prev
    );
  return data_text[idx] || ',';
}