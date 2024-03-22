// z5339356
// prints all numbers from 0 to n on separate lines
// Written on 28/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Count Up/Down

#include <stdio.h>

int main(void) {
    
    int n;
    int i = 0;
    
    printf("Enter number: ");
    scanf("%d", &n);
    if (n >= 0) {
        while (i <= n) {
            printf("%d\n", i);
            i = i + 1;
        } 
    } else {
        while (i >= n) {
            printf("%d\n", i);
            i = i - 1;
        }
    }

    return 0;

}
