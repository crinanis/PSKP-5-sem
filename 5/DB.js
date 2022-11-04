const EventEmitter = require('events');
const ServerRef = require('./4-1');
const fs = require("fs");

class Human
{
    constructor()
    {
        this.id = -1;
        this.name = "";
        this.birth = "";
    }

}
class Statistic
{
    constructor()
    {
        this.startDate = '';
        this.finishDate = '-';
        this.requestsCount = 0;
        this.commitsCount = 0;
    }

    reset()
    {
        this.startDate = '';
        this.finishDate = '-';
        this.requestsCount = 0;
        this.commitsCount = 0;
    }
}
class DataBase extends EventEmitter
{
    constructor()
    {
        super();
        this.data = Array();
        this.data = require('./person');
    }
    async select()
    {
        return JSON.stringify(this.data);
    }

    async insert(human)
    {
        let foundHumanId = await this.data.findIndex(el => el.id == human.id);
        if(foundHumanId == -1) {
            this.data.push(human);
        }
    }

    update(human)
    {
        let foundHumanId = this.data.findIndex(el => el.id == human.id);
        if(foundHumanId == -1){
            return JSON.parse('{"error": "Person with this id doesnt exist"}')
        } else {
            let targetHuman = this.data.slice(foundHumanId, foundHumanId + 1)[0];
            targetHuman.name = human.name;
            targetHuman.birth = human.birth;
        }
    }

    async commit()
    {
        console.log('>>> Commited ' + new Date().toString());
    }

    delete(id)
    {
        let returnHuman = new Human();
        let foundHumanId = this.data.findIndex(el => el.id == id);

        if(foundHumanId != -1)
        {
            returnHuman.id = this.data[foundHumanId].id;
            returnHuman.name = this.data[foundHumanId].name;
            returnHuman.birth = this.data[foundHumanId].birth;
            this.data.splice(foundHumanId, 1);
            return returnHuman;
        }
        else if(foundHumanId == -1){
            return JSON.parse('{"error": "Person with this id doesnt exist"}');
        }
    }
}

module.exports.DataBase = DataBase;
module.exports.Human = Human;
module.exports.Statistic = Statistic;