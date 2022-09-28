/**
 * jslib.js: Various utilities
 *
 * (C) 2014-2022 - FabiÃ¡n Mandelbaum
 */

// localStorage wrapper
const Storage = {
    getItem: function (key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (ex) {
            console.warn(ex);
            return null;
        }
    },
    setItem: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    delItem: function (key) {
        localStorage.removeItem(key);
    },
    delItems: function (keyPrefix) {
        // To play safe 1st find out keys to remove, then remove them (2 loops)
        const keysToRemove = [];
        for (var N = localStorage.length, i = 0; i < N; i++) {
            const keyName = localStorage.key(i);
            if (Utils.strStartsWith(keyName, keyPrefix)) {
                keysToRemove.push(keyName);
            }
        }
        for (var N2 = keysToRemove.length, r = 0; r < N2; r++) {
            localStorage.removeItem(keysToRemove[r]);
        }
    },
    getItems: function (keyPrefix) {
        const items = [];
        for (var N = localStorage.length, i = 0; i < N; i++) {
            const keyName = localStorage.key(i);
            if (Utils.strStartsWith(keyName, keyPrefix)) {
                items.push(Storage.getItem(keyName));
            }
        }
        return items;
    },
    kill: function () {
        localStorage.clear();
    }
};

// sessionStorage wrapper
const Session = {
    getItem: function (key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (ex) {
            console.warn(ex);
            return null;
        }
    },
    setItem: function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    delItem: function (key) {
        sessionStorage.removeItem(key);
    },
    delItems: function (keyPrefix) {
        // To play safe 1st find out keys to remove, then remove them (2 loops)
        const keysToRemove = [];
        for (var N = sessionStorage.length, i = 0; i < N; i++) {
            const keyName = sessionStorage.key(i);
            if (Utils.strStartsWith(keyName, keyPrefix)) {
                keysToRemove.push(keyName);
            }
        }
        for (var N2 = keysToRemove.length, r = 0; r < N2; r++) {
            sessionStorage.removeItem(keysToRemove[r]);
        }
    },
    getItems: function (keyPrefix) {
        const items = [];
        for (var N = sessionStorage.length, i = 0; i < N; i++) {
            const keyName = sessionStorage.key(i);
            if (Utils.strStartsWith(keyName, keyPrefix)) {
                items.push(Session.getItem(keyName));
            }
        }
        return items;
    },
    kill: function () {
        sessionStorage.clear();
    }
};

// Various utils
const Utils = {
    strReplaceAll: function (string, search, replacement) {
        // based on split+join implementation at http://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
        return string.split(search).join(replacement);
    },
    strStartsWith: function (string, prefix) {
        return new RegExp("^" + prefix).test(string);
    },
    strEndsWith: function (string, suffix) {
        return new RegExp(suffix + "$").test(string);
    },
    strTrim: function (string, maxLength) {
        const sl = string.length;
        maxLength = maxLength || 20;
        if (sl <= maxLength) {
            // "small" enough, return "as is"...
            return string;
        }
        const index = (maxLength - 1) / 2;
        return (string.slice(0, index) + "â€¦" + string.slice(-index));
    },
    loadJSON: function (file /* path of JSON file to load: ex: /files/mysettings.json */, cache) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            var url = file;
            if (!cache) {
                url = url + "?t=" + (new Date()).getTime();
            }
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
            xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve(JSON.parse(xhr.response));
                        } catch (ex) {
                            reject(Error("Cannot parse JSON from file " + file + ". Exception: " + ex));
                        }
                    } else {
                        reject(Error("Cannot load " + file + ". HTTP " + xhr.status + " : " + xhr.responseText));
                    }
                }
            };
            xhr.send();
        });
    },
    getFilename: function (fhref) {
        return fhref.substring(fhref.lastIndexOf('/') + 1);
    },
    getFileBasename: function (fhref) {
        var fname = Utils.getFilename(fhref);
        return fname.substring(0, fname.lastIndexOf("."));
    },
    getFileExtension: function (fhref) {
        return fhref.substring(fhref.lastIndexOf(".") + 1);
    },
    formatSecs: function (totalNumberOfSeconds) {
        const days = parseInt(totalNumberOfSeconds / 86400);
        const hours = parseInt((totalNumberOfSeconds - (days * 86400)) / 3600);
        const minutes = parseInt((totalNumberOfSeconds - (days * 86400) - (hours * 3600)) / 60);
        const seconds = Math.floor((totalNumberOfSeconds - ((days * 86400) + (hours * 3600) + (minutes * 60))));
        const msec = Math.round((totalNumberOfSeconds - ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds)) * 1000);
        //var result = days + "d" + (hours < 10 ? "0" + hours : hours) + "h" + (minutes < 10 ? "0" + minutes : minutes) + "m" + (seconds  < 10 ? "0" + seconds : seconds) + "s";
        const result = (minutes < 10 ? "0" + minutes : minutes) + "m" + (seconds < 10 ? "0" + seconds : seconds) + "s" + (msec < 10 ? "00" + msec : msec < 100 ? "0" + msec : msec) + "ms";
        return result;
    },
    roundDecs: function (n, decs) {
        return Math.round(n * Math.pow(10, decs)) / Math.pow(10, decs);
    },
    formatFileSize: function (size) {
        if (size > 1073741824) {
            return Utils.roundDecs(size / 1073741824, 2) + "G";
        } else if (size > 1048576) {
            return Utils.roundDecs(size / 1048576, 2) + "M";
        } else if (size > 1024) {
            return Utils.roundDecs(size / 1024, 2) + "K";
        } else if (size === -1) {
            return "???";
        } else {
            return size;
        }
    },
    formatISODateTime: function (msecs, wantMS) {
        const d = msecs ? new Date(msecs) : new Date();
        let fd = d.toJSON().replace("T", " ");
        if (wantMS) {
            return fd.replace("Z", ""); // Removes just the 'Z', leaving the msecs
        } else {
            return fd.substring(0, fd.length - 5); // Removes the msecs and the 'Z'
        }
    },
    fileNameTstamp: function () {
        return Utils.formatISODateTime().replace(" ", "");
    },
    padWithZero: function (n) {
        return n < 10 ? ('0' + n) : n;
    },
    formatDateTime: function (msecs, wantMS) {
        const d = msecs ? new Date(msecs) : new Date();
        return d.getFullYear() + "-"
            + Utils.padWithZero(d.getMonth() + 1) + "-"
            + + Utils.padWithZero(d.getDate()) + " "
            + + Utils.padWithZero(d.getHours()) + ":"
            + + Utils.padWithZero(d.getMinutes()) + ":"
            + + Utils.padWithZero(d.getSeconds())
            + (wantMS ? ("." + d.getMilliseconds()) : "");
    },
    empty: function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    },
    // Shuffle elements of an array in-place using Fisher-Yates algorithm. Taken from https://bost.ocks.org/mike/shuffle/
    shuffle: function (arr) {
        var m = arr.length, t, i;
        // While there remain elements to shuffle...
        while (m) {
            // Pick a remaining element...
            i = Math.floor(Math.random() * m--);
            // ... and swap it with current element
            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }
    },
    // Serialize form data as an array, like jQuery's (taken from https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/)
    serializeArray: function (form) {
        var field, l, s = [];
        if (typeof form == 'object' && form.nodeName == "FORM") {
            const len = form.elements.length;
            for (let i = 0; i < len; i++) {
                field = form.elements[i];
                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        l = form.elements[i].options.length;
                        for (let j = 0; j < l; j++) {
                            if (field.options[j].selected)
                                s[s.length] = { name: field.name, value: field.options[j].value };
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        s[s.length] = { name: field.name, value: field.value };
                    }
                }
            }
        }
        return s;
    },
    serializeJSON: function (form) {
        var field, l, s = {};
        if (typeof form == 'object' && form.nodeName == "FORM") {
            const len = form.elements.length;
            for (let i = 0; i < len; i++) {
                field = form.elements[i];
                if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        l = form.elements[i].options.length;
                        var values = [];
                        for (let j = 0; j < l; j++) {
                            if (field.options[j].selected)
                                values.push(field.options[i].value);
                        }
                        if (!values.length === 0) {
                            s[field.name] = values;
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        s[field.name] = field.value;
                    }
                }
            }
        }
        return s;
    },
    // UUID v4 (Random), taken from https://gist.github.com/LeverOne/1308368
    uuidV4: function (a, b) {
        for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') { }; return b;
    },
    isValidEmail: function (email) {
        // The following email validation Regex has been taken from HTML5 input 'email' type
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    },
    msgFormat: function (src, replacements) {
        var tgt = src;
        for (let i = 0; i < replacements.length; i++) {
            tgt = tgt.replace("{" + i + "}", replacements[i]);
        }
        return tgt;
    },
    // Hides columns if they have 'nothing' on them
    hideColumnsIfEmpty: function (columnsSelector) {
        var columns = document.querySelectorAll(columnsSelector);
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].hasChildNodes()) {
                columns[i].parentElement.classList.remove("column-hide");
            } else {
                columns[i].parentElement.classList.add("column-hide");
            }
        }
    }
};

const DateUtils = {
    getTstamp: function (ndigits) {
        const d = new Date();
        const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        let localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.replace(/[-T:\.Z]/g, '').substring(0, ndigits || 20); // YYYYMMDDhhmmssSSS
    },
    getTstampMS: function (dateInMS, ndigits) {
        const d = new Date(dateInMS);
        const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        let localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.replace(/[-T:\.Z]/g, '').substring(0, ndigits || 20); // YYYYMMDDhhmmssSSS
    },
    formatISOPacked: function (dateInMS) {
        const d = new Date(dateInMS);
        const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(d - tzoffset));
        return localISOTime.getFullYear() + "-" + Utils.padWithZero(localISOTime.getUTCMonth() + 1) + "-" + Utils.padWithZero(localISOTime.getUTCDate()) + " " + Utils.padWithZero(localISOTime.getUTCHours()) + ":" + Utils.padWithZero(localISOTime.getUTCMinutes()) + ":" + Utils.padWithZero(localISOTime.getUTCSeconds());
    },
    formatISOUltraPacked: function (dateInMS) {
        var d = new Date(dateInMS);
        var tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
        var localISOTime = (new Date(d - tzoffset));
        return localISOTime.getFullYear() + "-" + Utils.padWithZero(localISOTime.getUTCMonth() + 1) + "-" + Utils.padWithZero(localISOTime.getUTCDate());
    }
};