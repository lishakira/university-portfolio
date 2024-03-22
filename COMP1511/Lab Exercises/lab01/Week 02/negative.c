// z5339356
// shows if the number is negative, positive, or zero
// Written on 21/09/2021 
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Don't Be So Negative!

#include <stdio.h>

int main(void) {

    int number;
    scanf("%d", &number);
    if (number > 0) {
        printf("You have entered a positive number.\n");
    } else if (number < 0) {
        printf("Don't be so negative!\n");
    } else {
        printf("You have entered zero.\n");
    }

    return 0;
}
