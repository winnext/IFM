import axios from 'axios';

export default class EventService {

    getEvents() {
        return axios.get('assets/demo/data/events.json').then(res => res.data.data);
    }
}
