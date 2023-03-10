class User {
    constructor(userId , name , score , ranking=0) {
        this.userId = userId;
        this.name=name;
        this.score= score;
        this.ranking=ranking;
    }
}
module.exports = {User};