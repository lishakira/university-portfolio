// z5339356
// prints an "X" shape by nxn pattern
// assumptions: n is off and >=5
// Written on 29/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Draw an X

#include <stdio.h>

int main(void) {

    int n;
    // for length
    int counter_l = 0;
    // for height
    int counter_h = 0;
    
    printf("Enter size: ");
    scanf("%d", &n);
    
    while (counter_h < n) {
        while (counter_l < n) {
            if (counter_l == counter_h || counter_l == (n - counter_h - 1)) {
                printf("*");
                counter_l = counter_l + 1;
            } else {
                printf("-");
                counter_l = counter_l + 1;
            }
        }
        printf("\n");
        counter_l = 0;
        counter_h = counter_h + 1;
    }
    
    return 0;
}
