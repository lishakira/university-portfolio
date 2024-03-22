// z5339356
// displays the sum of two integers in word
// Written on 22/09/2021
// by Shakira Li (z5339356@unsw.edu.au)
// for COMP1511 
// Exercise: Word Addition 

#include <stdio.h>

int main(void) {

    int num_one;
    int num_two;
    int sum;
    printf("Please enter two integers: ");
    scanf("%d %d", &num_one, &num_two);
    sum = num_one + num_two;
    
    if (num_one == 0) {
        printf("zero");
    } else if (num_one == 1) {
        printf("one");
    } else if (num_one == 2) {
        printf("two");
    } else if (num_one == 3) {
        printf("three");
    } else if (num_one == 4) {
        printf("four");
    } else if (num_one == 5) {
        printf("five");
    } else if (num_one == 6) {
        printf("six");
    } else if (num_one == 7) {
        printf("seven");
    } else if (num_one == 8) {
        printf("eight");
    } else if (num_one == 9) {
        printf("nine");
    } else if (num_one == 10) {
        printf("ten");
    } else if (num_one == -1) {
        printf("negative one");
    } else if (num_one == -2) {
        printf("negative two");
    } else if (num_one == -3) {
        printf("negative three");
    } else if (num_one == -4) {
        printf("negative four");
    } else if (num_one == -5) {
        printf("negative five");
    } else if (num_one == -6) {
        printf("negative six");
    } else if (num_one == -7) {
        printf("negative seven");
    } else if (num_one == -8) {
        printf("negative eight");
    } else if (num_one == -9) {
        printf("negative nine");
    } else if (num_one == -10) {
        printf("negative ten");
    } else {
        printf("%d", num_one);
    }
    
    printf(" + ");
    
    if (num_two == 0) {
        printf("zero");
    } else if (num_two == 1) {
        printf("one");
    } else if (num_two == 2) {
        printf("two");
    } else if (num_two == 3) {
        printf("three");
    } else if (num_two == 4) {
        printf("four");
    } else if (num_two == 5) {
        printf("five");
    } else if (num_two == 6) {
        printf("six");
    } else if (num_two == 7) {
        printf("seven");
    } else if (num_two == 8) {
        printf("eight");
    } else if (num_two == 9) {
        printf("nine");
    } else if (num_two == 10) {
        printf("ten");
    } else if (num_two == -1) {
        printf("negative one");
    } else if (num_two == -2) {
        printf("negative two");
    } else if (num_two == -3) {
        printf("negative three");
    } else if (num_two == -4) {
        printf("negative four");
    } else if (num_two == -5) {
        printf("negative five");
    } else if (num_two == -6) {
        printf("negative six");
    } else if (num_two == -7) {
        printf("negative seven");
    } else if (num_two == -8) {
        printf("negative eight");
    } else if (num_two == -9) {
        printf("negative nine");
    } else if (num_two == -10) {
        printf("negative ten");
    } else {
        printf("%d", num_two);
    }
    
    printf(" = ");
    
    if (sum == 0) {
        printf("zero\n");
    } else if (sum == 1) {
        printf("one\n");
    } else if (sum == 2) {
        printf("two\n");
    } else if (sum == 3) {
        printf("three\n");
    } else if (sum == 4) {
        printf("four\n");
    } else if (sum == 5) {
        printf("five\n");
    } else if (sum == 6) {
        printf("six\n");
    } else if (sum == 7) {
        printf("seven\n");
    } else if (sum == 8) {
        printf("eight\n");
    } else if (sum == 9) {
        printf("nine\n");
    } else if (sum == 10) {
        printf("ten\n");
    } else if (sum == -1) {
        printf("negative one\n");
    } else if (sum == -2) {
        printf("negative two\n");
    } else if (sum == -3) {
        printf("negative three\n");
    } else if (sum == -4) {
        printf("negative four\n");
    } else if (sum == -5) {
        printf("negative five\n");
    } else if (sum == -6) {
        printf("negative six\n");
    } else if (sum == -7) {
        printf("negative seven\n");
    } else if (sum == -8) {
        printf("negative eight\n");
    } else if (sum == -9) {
        printf("negative nine\n");
    } else if (sum == -10) {
        printf("negative ten\n");
    } else {
        printf("%d\n", sum);
    }

    return 0;
}
