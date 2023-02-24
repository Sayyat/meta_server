// wait file to change
import fs from "fs";

export default function startWaiting(path, callback, timeout) {
    const timer = setTimeout(function () {
        stopWaiting(path);
        callback('Timed out.');
    }, timeout);

    const options = {
        persistent: true,
        interval: 500
    };

    fs.watchFile(path, options, function (curr, prev) {
        onChanged(curr, prev, path, timer, callback);
    });
}

function stopWaiting(path) {
    fs.unwatchFile(path, this);
}

function onChanged(current, previous, path, timer, clientCallback) {
    let type = 'File modified.';
    if (current.mode === 0 && previous.mode === 0) type = 'No file.';
    else if (current.mode > 0 && previous.mode === 0) type = 'File created.';
    else if (current.mode === 0 && previous.mode > 0) type = 'File deleted.';

    if (type !== 'No file.') {
        stopWaiting(path);
        clearTimeout(timer);
    }

    clientCallback(type, current, previous);
}