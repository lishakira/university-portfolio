// z5339356
// prints exponential value of the given integers 
// Written on 09/10/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511
// Exercise: Create a simple calculator, reading different numbers of integers

#include <math.h>
#include <stdio.h>

int main(void) {

    int instruction = 0;
    int num_one = 0;
    int num_two = 0;
    int answer = 0;
    
    printf("Enter instruction: ");
    while (scanf("%d", &instruction) != EOF) {
        
        if (instruction == 1) {
            scanf("%d", &num_one);
            answer = pow (num_one , 2);
            printf("%d\n", answer);
        } else if (instruction == 2) {
            scanf("%d %d", &num_one, &num_two);
            answer = pow (num_one , num_two);
            printf("%d\n", answer);
        }
        
        printf("Enter instruction: ");
    }
    
    return 0;

}
