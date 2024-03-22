//
// COMP1521 Lab 05 Exercise - Convert 16 Binary Digits to A Signed Number
//
// Convert string of binary digits to 16-bit signed integer
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 24/10/2022
//


#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <assert.h>

#define N_BITS 16

int16_t sixteen_in(char *bits);

int main(int argc, char *argv[]) {

    for (int arg = 1; arg < argc; arg++) {
        printf("%d\n", sixteen_in(argv[arg]));
    }

    return 0;
}

//
// given a string of binary digits ('1' and '0')
// return the corresponding signed 16 bit integer
//
int16_t sixteen_in(char *bits) {
    // signed 16 bit integer
    int16_t bitInt = 0;
    for (int i = 0; i < N_BITS; i++) {
        if (bits[i] == '1') bitInt = bitInt | 1 << (N_BITS - i - 1);
    }

    return bitInt;
}

