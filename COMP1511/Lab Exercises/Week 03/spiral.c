// z5339356
// draws a spiral using astrisks and dashes
// assumptions: n is odd and >= 5
// Written on 01/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: COMP1511

#include <stdio.h> 

int main(void) {

    int n;
    // for height
    int counter_h = 0;
    // for length
    int counter_l = 0;
    printf("Enter size: ");
    scanf("%d", &n);
    
    while (counter_h < n) {
        if (counter_h == 0 || counter_h == n) {
            while (counter_l < n) {
                printf("*");
                counter_l ++;
            }
            counter_l = 0;
            printf("\n");
        } else {
            while (counter_l < n) {
                if (counter_l >= (counter_h - 2) && \
                counter_l < (n - counter_h)) {
                    if (counter_h % 2 == 0) {
                        printf("*");
                        counter_l ++;
                    } else {
                        printf("-");
                        counter_l ++;
                    }
                } else if (counter_l < counter_h && \
                counter_l >= (n - counter_h)) {
                    if (counter_h % 2 == 0) {
                        printf("*");
                        counter_l ++;
                    } else {
                        printf("-");
                        counter_l ++;
                    }
                } else {
                    if (counter_l % 2 == 0) {
                        printf("*");
                        counter_l ++;
                    } else {
                        printf("-");
                        counter_l ++;
                    }
                }
            }
            counter_l = 0;
            printf("\n");
        }
        counter_h ++;
    }

    return 0;
}
