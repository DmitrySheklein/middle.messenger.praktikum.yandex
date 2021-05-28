module.exports = {
    locals: {
      getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      getRandomArray: function(count){
        return new Array(count).fill(``)
      }
    }
  };