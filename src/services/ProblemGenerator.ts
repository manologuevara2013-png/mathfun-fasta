import { MathProblem, AgeStage, MathSet, SetItem } from '../types';

export class ProblemGenerator {
  private problemContextos = {
    apple: {
      union: [
        'Tenés 3 manzanas rojas y 2 manzanas verdes. ¿Cuántas manzanas tenés en total?',
        'María tiene 4 manzanas y su mamá le regala 3 más. ¿Cuántas manzanas tiene ahora?',
      ],
      difference: [
        'Tenés 5 manzanas y regalás 2. ¿Cuántas manzanas te quedan?',
        'Había 7 manzanas en la canasta y se llevaron 3. ¿Cuántas manzanas quedan?',
      ],
    },
    star: {
      union: [
        'En el cielo hay 5 estrellas brillantes y aparecen 4 más. ¿Cuántas estrellas hay ahora?',
        'Dibujaste 6 estrellas doradas y 3 plateadas. ¿Cuántas estrellas dibujaste?',
      ],
      difference: [
        'Hay 10 estrellas en el cielo y 6 desaparecen. ¿Cuántas estrellas quedan?',
        'Tenés 8 estrellas y regalás 3. ¿Cuántas estrellas te quedan?',
      ],
    },
    car: {
      union: [
        'En el garaje hay 4 autos rojos y 3 autos azules. ¿Cuántos autos hay en total?',
        'Juan tiene 5 autos de juguete y le regalan 2 más. ¿Cuántos autos tiene?',
      ],
      difference: [
        'La comunidad tiene 6 autos y 2 se van. ¿Cuántos autos quedan?',
        'Había 9 autos en el estacionamiento y se llevaron 5. ¿Cuántos autos quedan?',
      ],
    },
    animal: {
      union: [
        'En la granja hay 4 animales y llegan 3 más. ¿Cuántos animales hay?',
        'En la jaula viven 5 pájaros y traen 2 más. ¿Cuántos pájaros hay ahora?',
      ],
      difference: [
        'En la granja hay 5 animales y 3 se van. ¿Cuántos animales quedan?',
        'Tenés 7 animales de peluche y regalás 4. ¿Cuántos te quedan?',
      ],
    },
  };

  generateProblem(stage: AgeStage, problemIndex: number): MathProblem {
    const problems: MathProblem[] = [];

    if (stage === 'STAGE_1_SETS') {
      problems.push(
        this.createUnionProblem('apple', 3, 2, 'union_001'),
        this.createUnionProblem('star', 4, 3, 'union_002'),
        this.createDifferenceProblem('apple', 5, 2, 'diff_001'),
        this.createDifferenceProblem('car', 6, 2, 'diff_002'),
      );
    } else if
