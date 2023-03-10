const dayjs = require('dayjs');

class Riddle {
    constructor(riddleId, name, text, difficulty, duration, state, hint1, hint2, solution, authorId, endDate=null) {
        this.riddleId = riddleId;
        this.name = name;
        this.text = text;
        this.difficulty = difficulty;
        this.duration = duration;
        this.state = state;
        this.hint1 = hint1;
        this.hint2 = hint2;
        this.solution = solution;
        this.authorId = authorId;
        this.endDate = endDate;
    }
}
module.exports = {Riddle};
