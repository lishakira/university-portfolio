// z5339356
// print the wondrous numbers of an integer using asterisks
// sequence generated from the Collatz Conjecture
// Written on 29/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Wondrous

#include <stdio.h>

int main(void) {

    int n;
    int i = 1;
    
    printf("What number would you like to see: ");
    scanf("%d", &n);
    
    while (n != 1) {
    
        while (i <= n) {
            printf("*");
            i = i + 1;
        }
        
        printf("\n");
        i = 1;
        
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = (3 * n) + 1;
        }
        
    }

    return 0;
}
