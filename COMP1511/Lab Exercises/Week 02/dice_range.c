// z5339356
// shows the range of possible sum the dice can make 
// Written on 22/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Dice Range

#include <stdio.h>

int main(void) {

    int sides;
    int dice;
    int total;
    double average;
    printf("Enter the number of sides on your dice: ");
    scanf("%d", &sides);
    printf("Enter the number of dice being rolled: ");
    scanf("%d", &dice);
    if (sides > 0 && dice > 0) {
        total = sides * dice;
        average = (total + dice) / 2.0;
        printf("Your dice range is %d to %d.\n", dice, total);
        printf("The average value is %.6lf\n", average);
    } else {
        printf("These dice will not produce a range.\n");
    }

    return 0;
}
