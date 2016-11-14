var CodeGenerator = function () {
    this.codes = {};

    this.colors = ["red", "green", "orange", "blue", "yellow", "black", "white", "purple", "brown", "pink"];
    this.emotions = ["angry", "calm", "loving", "sad", "happy", "excited", "joyful", "raging", "curious", "hopeful"];
    this.animals = ["mouse", "fox", "dog", "cat", "newt", "pig", "cow", "lizard", "camel", "deer"];

    this.getCode = function (id) {
        var color = this.getRandomItemInArray(this.colors);
        var emotion = this.getRandomItemInArray(this.emotions);
        var animal = this.getRandomItemInArray(this.animals);

        var mix = Math.round(Math.random());
        var code;
        if (mix == 1) {
            code = color + " " + emotion + " " + animal
        } else {
            code = emotion + " " + color + " " + animal
        }

        if (this.codes[code]) {
            return this.getCode();
        } else {
            this.codes[code] = id;
            return code;
        }
    };

    this.validateCode = function (code) {
        var id = this.codes[code];

        if (id) return id;
        else return false;
    };

    this.getRandomItemInArray = function (arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }
};

module.exports = CodeGenerator;