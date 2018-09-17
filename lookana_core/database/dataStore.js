/**
 * Created by sadra on 2/13/18.
 */
const config = require('../assets/config');
const storage = require('data-store')(config.data_store.name, {
    cwd: '.data_store'
});


function setDefaultSettings() {
    storage.set(config.data_store.items.is_context_aware, true);
    console.log("default settings is set.");
}

function toggleRecommendType() {
    storage.set(config.data_store.items.is_context_aware, !isRecommendContextAware());
    console.log("toggleRecommendType is set.");
}

function isRecommendContextAware() {
    return storage.get(config.data_store.items.is_context_aware);
}

function setDirectoryPassword(password) {
    storage.set(config.data_store.items.directory_password, password);
    console.log("directory password is set.");
    return
}

function getDirectoryPassword() {
    return storage.get(config.data_store.items.directory_password);
}


module.exports = { setDefaultSettings, toggleRecommendType, isRecommendContextAware, setDirectoryPassword, getDirectoryPassword };