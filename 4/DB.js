const EventEmitter = require('events');

class Human
{
    constructor()
    {
        this.id = -1;
        this.name = "";
        this.birth = "";
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
        console.log(foundHumanId);
        if(foundHumanId == -1) {
            this.data.push(human);
        }
    }

    async update(human)
    {
        let foundHumanId = await this.data.findIndex(el => el.id == human.id);
        if(foundHumanId != -1)
        {
            let targetHuman = await this.data.slice(foundHumanId, foundHumanId + 1)[0];
            targetHuman.name = human.name;
            targetHuman.birth = human.birth;
        }

    }

    async delete(id)
    {
        let returnHuman = new Human();
        let foundHumanId = await this.data.findIndex(el => el.id == id);

        if(foundHumanId != -1)
        {
            returnHuman.id = this.data[foundHumanId].id;
            returnHuman.name = this.data[foundHumanId].name;
            returnHuman.birth = this.data[foundHumanId].birth;

            this.data.splice(foundHumanId, 1);
        }

        return returnHuman;
    }


}

module.exports.DataBase = DataBase;
module.exports.Human = Human;