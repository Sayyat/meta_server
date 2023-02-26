// wait file to change
import fs from "fs";

export default function startWaiting(path, callback, timeout) {
    const timer = setTimeout(function () {
        stopWaiting(path);
        callback({id: 0, msg: 'Timed out.'});
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
    let type = {id: 1, msg: 'File modified.'};
    if (current.mode === 0 && previous.mode === 0) type = {id: 2, msg: 'No File.'};
    else if (current.mode > 0 && previous.mode === 0) type = {id: 3, msg: 'File created.'};
    else if (current.mode === 0 && previous.mode > 0) type = {id: 4, msg: 'File deleted.'};

    if (type.id !== 2) {
        stopWaiting(path);
        clearTimeout(timer);
    }

    clientCallback(type, current, previous);
}