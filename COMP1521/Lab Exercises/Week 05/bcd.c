//
// COMP1521 Lab 05 Exercise - Convert a 2 digit BCD Value to an Integer
//
// given a 2 digit Binary-Coded Decimal (BCD) value, 
// it returns the corresponding integer
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 24/10/2022
//

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <assert.h>

int bcd(int bcd_value);

int main(int argc, char *argv[]) {

    for (int arg = 1; arg < argc; arg++) {
        long l = strtol(argv[arg], NULL, 0);
        assert(l >= 0 && l <= 0x0909);
        int bcd_value = l;

        printf("%d\n", bcd(bcd_value));
    }

    return 0;
}

// given a  BCD encoded value between 0 .. 99
// return corresponding integer
int bcd(int bcd_value) {
    int end = bcd_value & 0xF;
    int start = (bcd_value >> 8) & 0xF;

    return start * 10 + end;
}

