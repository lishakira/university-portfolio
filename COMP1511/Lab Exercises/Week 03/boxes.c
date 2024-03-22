// z5339356
// draws a series of boxes using astrisks and dashes
// assumptions: values <= 50 will not be tested
// Written on 01/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: COMP1511

#include <stdio.h>

int main(void) {

    int boxes;
    printf("How many boxes: ");
    scanf("%d", &boxes);
    // length and width of box
    int counter = 3;
    // for height
    int counter_h = 0;
    // for length
    int counter_l = 0;
    int i = 0;

    if (boxes > 0) {
        
        while (i < (boxes - 1)) {
            counter = counter + 4;
            i = i + 1;
        }
        
        while (counter_h < counter) {
            if (counter_h == 0 || counter_h == counter) {
                while (counter_l < counter) {
                    printf("*");
                    counter_l = counter_l + 1;
                }
                counter_l = 0;
                printf("\n");
            } else if (counter_h % 2 == 0 && (counter_h != counter || counter_h != 0)) {
                while (counter_l < counter) {
                    if (counter_l >= counter_h && counter_l < (counter - counter_h)) {
                        printf("*");
                        counter_l = counter_l + 1;
                    } else if (counter_l < counter_h && \
                    counter_l >= (counter - counter_h)) {
                        printf("*");
                        counter_l = counter_l + 1;
                    } else {
                        if (counter_l % 2 == 0) {
                            printf("*");
                            counter_l = counter_l + 1;
                        } else {
                            printf("-");
                            counter_l = counter_l + 1;
                        }
                    }
                }
                counter_l = 0;
                printf("\n");
            } else {
                while (counter_l < counter) {
                    if (counter_l >= counter_h && counter_l < (counter - counter_h)) {
                        printf("-");
                        counter_l = counter_l + 1;
                    } else if (counter_l < counter_h && \
                    counter_l >= (counter - counter_h)) {
                        printf("-");
                        counter_l = counter_l + 1;
                    } else {
                        if (counter_l % 2 == 0) {
                            printf("*");
                            counter_l = counter_l + 1;
                        } else {
                            printf("-");
                            counter_l = counter_l + 1;
                        }
                    }
                }
                counter_l = 0;
                printf("\n");
            }
            counter_h ++;
        }
    } 

    return 0;
}
