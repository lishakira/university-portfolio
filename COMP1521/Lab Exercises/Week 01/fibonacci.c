//
// COMP1521 Lab 01 Exercise - Calculating the Fibonacci Sequence 
// The (Not So) Fast Way
//
// given a line of input containing a natural number,
// the corresponding Fibonacci number is printed
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 20/09/2022
//

#include <stdio.h>
#include <stdlib.h>

#define SERIES_MAX 30

int fibonacci(int input);

int main(void) {
    int input;
    while (scanf("%d", &input) != EOF) {
        printf("%d\n", fibonacci(input));
    }

    return EXIT_SUCCESS;
}

/**
 * Returns the nth (input) fibonacci number
 */
int fibonacci(int input) {
    if (!input) {
        return 0;
    } else if (input == 1) {
        return 1;
    }

    return fibonacci(input - 1) + fibonacci(input - 2);
}