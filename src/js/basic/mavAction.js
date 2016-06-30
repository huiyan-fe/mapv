import Action from './action';

import Store from './mavStore';

var act = new Action();
// console.log('?', act, act.emit)
act.regest({
    store: Store
})

export default act;