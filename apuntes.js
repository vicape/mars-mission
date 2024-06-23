const fs = require('fs');
const path = require('path');

// Directorio raíz del proyecto
const rootDir = __dirname;
// Archivo de salida
const outputFile = path.join(rootDir, 'todo_nodejs.txt');

// Extensiones de archivos de imagen a excluir
const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.ico'];

// Archivos específicos a excluir
const specificFilesToExclude = ['todo_automatico.txt', 'todo.txt', 'package-lock.json'];

// Directorios a excluir
const directoriesToExclude = ['node_modules', '.git'];

// Eliminar el archivo de salida si existe
if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
}

// Lee el archivo .gitignore y construye una lista de patrones a ignorar
const readGitignore = () => {
    const ignoreFilePath = path.join(rootDir, '.gitignore');
    if (!fs.existsSync(ignoreFilePath)) {
        return [];
    }

    const ignorePatterns = fs.readFileSync(ignoreFilePath, 'utf-8')
        .split('\n')
        .map(pattern => pattern.trim())
        .filter(pattern => pattern && !pattern.startsWith('#'));

    // Añadir node_modules y .git a las exclusiones si no están en .gitignore
    if (!ignorePatterns.includes('node_modules')) {
        ignorePatterns.push('node_modules');
    }
    if (!ignorePatterns.includes('.git')) {
        ignorePatterns.push('.git');
    }

    return ignorePatterns;
};

// Función para verificar si un archivo o directorio debe ser ignorado
const shouldIgnore = (filePath) => {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath);
    
    // Verificar si el archivo o directorio está en la lista de exclusión
    if (imageExtensions.includes(ext) || specificFilesToExclude.includes(baseName)) {
        return true;
    }

    // Verificar si el archivo o directorio está en los directorios a excluir
    for (const dir of directoriesToExclude) {
        if (relativePath.startsWith(dir)) {
            return true;
        }
    }

    // Verificar si el archivo o directorio coincide con algún patrón en .gitignore
    for (const pattern of ignorePatterns) {
        if (relativePath.includes(pattern)) {
            return true;
        }
    }

    return false;
};

// Función para recorrer directorios y registrar archivos
const readDirectory = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (shouldIgnore(filePath)) {
            return;
        }
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            readDirectory(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
};

// Lee los patrones de ignorar del archivo .gitignore
const ignorePatterns = readGitignore();

// Lee la estructura del directorio, excluyendo los patrones de .gitignore
const fileList = readDirectory(rootDir);

// Escribir la lista de archivos en el archivo de salida
const writeToFile = (fileList) => {
    const fileContent = fileList.map(file => {
        try {
            const relativePath = path.relative(rootDir, file);
            return `<!-- ${relativePath} -->\n${fs.readFileSync(file, 'utf-8')}\n`;
        } catch (err) {
            console.error(`Error reading file ${file}: ${err}`);
            return `<!-- ${relativePath} -->\nError reading file\n`;
        }
    }).join('\n');

    try {
        fs.writeFileSync(outputFile, fileContent, 'utf-8');
        console.log(`Archivo combinado creado en ${outputFile}`);
    } catch (err) {
        console.error(`Error writing to file ${outputFile}: ${err}`);
    }
};

writeToFile(fileList);
