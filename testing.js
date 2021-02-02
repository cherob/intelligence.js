class Person {
    constructor(props) {
        this.need_to_feed_his_pets = false;
    }

    feed_pets() {
        this.need_to_feed_his_pets = true
    }

}


class Pet {
    constructor(props) {

    }

    hunger(person) {
        person.feed_pets()
    }
}



let person = new Person();
let pet = new Pet();
console.log(person.need_to_feed_his_pets)
pet.hunger(person);
console.log(person.need_to_feed_his_pets)