class Riddle {
    constructor(riddleId, name, text, difficulty, duration,state="Open", hint1, hint2, authorId, solution , endDate=null) {
        this.riddleId = riddleId;
        this.name = name;
        this.text = text;
        this.difficulty = difficulty;
        this.duration = duration;
        this.state=state;
        this.hint1 = hint1;
        this.hint2 = hint2;
        this.authorId = authorId;
        this.solution = solution;
        this.endDate = endDate;
    }
}
export { Riddle };
