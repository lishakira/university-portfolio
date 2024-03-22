//
// COMP1521 Lab 05 Exercise - Convert an 8 digit Packed BCD Value to an Integer
//
// given an eight-digit packed binary-coded decimal value,
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

#define N_BCD_DIGITS 8

uint32_t packed_bcd(uint32_t packed_bcd);

int main(int argc, char *argv[]) {

    for (int arg = 1; arg < argc; arg++) {
        long l = strtol(argv[arg], NULL, 0);
        assert(l >= 0 && l <= UINT32_MAX);
        uint32_t packed_bcd_value = l;

        printf("%lu\n", (unsigned long)packed_bcd(packed_bcd_value));
    }

    return 0;
}

// given a packed BCD encoded value between 0 .. 99999999
// return the corresponding integer
uint32_t packed_bcd(uint32_t packed_bcd_value) {
    // corresponding integer
    int corrInt = 0;
    for (int i = N_BCD_DIGITS - 1; i >= 0; i--) {
        int decimal = (packed_bcd_value>> (4 * i)) & 0xF;
        corrInt = corrInt * 10 + decimal;
    }

    return corrInt;
}
