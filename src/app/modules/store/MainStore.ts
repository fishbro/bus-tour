import EventEmitter from "events";

class MainStore{
    events: EventEmitter = new EventEmitter();

    static instance: MainStore;
    static getInstance(): MainStore{
        if(!MainStore.instance){
            MainStore.instance = new MainStore();
        }
        return MainStore.instance;
    }
}

export default MainStore;
