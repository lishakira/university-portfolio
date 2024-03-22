// z5339356
// prints whether a year is a leap year 
// Written on 22/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Leap Year Calculator

#include <stdio.h>

int main(void) {

    int year;
    printf("Enter year: ");
    scanf("%d", &year);
    if (year % 4 != 0) {
        printf("%d is not a leap year.\n", year);
    } else if (year % 100 != 0) {
        printf("%d is a leap year.\n", year);
    } else if (year % 400 != 0) {
        printf("%d is not a leap year.\n", year);
    } else {
        printf("%d is a leap year.\n", year);
    }

    return 0;
}
