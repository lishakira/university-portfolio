// z5339356
// calculator for adding or subtracting
// assumptions: inputs are integers and first number will always be 1 or 2
// Written on 22/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Calculator

#include <stdio.h>

int main(void) {

    int operation;
    int num_one;
    int num_two;
    int result;
    printf("Enter instruction: ");
    scanf("%d %d %d", &operation, &num_one, &num_two);
    if (operation == 1) {
        result = num_one + num_two;
        printf("%d\n", result);
    } else {
        result = num_one - num_two;
        printf("%d\n", result);
    }

    return 0;
}
