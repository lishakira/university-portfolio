// z5339356
// add the number of students and tutors in class
// Written on 21/09/2021 
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Addition

#include <stdio.h>

int main(void) {

    int students;
    int tutors;
    int sum;
    printf("Please enter the number of students and tutors: ");
    scanf("%d %d", &students, &tutors);
    sum = students + tutors;
    printf("%d + %d = %d \n", students, tutors, sum);

    return 0;
}
