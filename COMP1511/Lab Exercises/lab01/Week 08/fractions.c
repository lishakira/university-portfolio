//
// Author: Shakira Li (z5339356)
// Date: 05/11/2021
//
// Description:
// implements the functions that are detailed in fractions.h

#include "fractions.h"

// These are function stubs!
// They are functions which compile but do not have the correct behaviour.

double convert(struct fraction frac) {

    double result = (frac.top * 1.0) / (frac.bottom * 1.0);

    return result;
}

struct fraction add(struct fraction first, struct fraction second) {
    
    // greatest common denominator
    int gcd;
    for (gcd = 1; gcd <= first.top && gcd <= first.bottom; gcd++) {
        if (first.top % gcd == 0 && first.bottom % gcd ==0) {
            first.top /= gcd;
            first.bottom /= gcd;
        }
    }

    for (gcd = 1; gcd <= second.top && gcd <= second.bottom; gcd++) {
        if (second.top % gcd == 0 && second.bottom % gcd ==0) {
            second.top /= gcd;
            second.bottom /= gcd;
        }
    }

    struct fraction result;

    result.top = (first.top * second.bottom) + (first.bottom * second.top);
    result.bottom = first.bottom * second.bottom;

    for (gcd = 1; gcd <= result.top && gcd <= result.bottom; gcd++) {
        if (result.top % gcd == 0 && result.bottom % gcd ==0) {
            result.top /= gcd;
            result.bottom /= gcd;
        }
    }

    return result;
}