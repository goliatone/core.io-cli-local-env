'use strict';

const Installers = {
    caddy: require('./caddy'),
    dnsmasq: require('./dnsmasq'),
    ngrok: require('./ngrok')
};

module.exports = Installers;

module.exports.each = function(cb){
    Object.keys(Installers).forEach((key, index)=>{
        cb(Installers[key], key, index);
    });
};
