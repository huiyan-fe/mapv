'use strict';

let Dufing = require('dufing');

let site = new Dufing({
    port: 8333
});

site.get(/online\/editor\/.{1,24}$/, '/online/editor');