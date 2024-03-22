// z5339356
// prints the first n digits of pi, where n is specified
// assumptions: n>=2 and n<=10
// Written on 06/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Print out pi to a certain number of digits

#include <stdio.h>

#define MAX_DIGITS 10

int main(void) {
    int pi[MAX_DIGITS] = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
    printf("How many digits of pi would you like to print? ");
    //TODO: Insert your code here
    
    int n;
    scanf("%d", &n);
    printf("3.");
    
    int i = 1;
    while (i < n) {
        printf("%d", pi[i]);
        i++;
    }
    
    printf("\n");
    
    return 0;
}
