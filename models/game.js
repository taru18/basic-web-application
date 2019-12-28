'use strict'

module.exports = {

    grade(answers, game) {
      let points = 0;
      let maxPoints = 0;
      let wrong = 0;

      for (let question of game) {
        maxPoints += question.maxPoints;

        for (let option of question.options) {
          if (option.correctness == true && option.id in answers) {
            ++points;
          } else if (option.correctness == false && option.id in answers) {
            if (points >= 1) {
            --points;
            }
            ++wrong;
          }
        }
      }
      return {
        points: points,
        maxPoints: maxPoints,
        wrongAnswers: wrong
      };
    }
};
