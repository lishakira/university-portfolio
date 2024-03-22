//
// COMP1521 Lab 07 Exercise - Create an addi instruction
//
// generate the encoded binary for an addi instruction,
// including opcode and operands
//
// Author: Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 31/10/2022
//

#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <assert.h>

#include "addi.h"

// return the encoded binary MIPS for addi $t,$s, i
uint32_t addi(int t, int s, int i) {
    // 000000 sssss ttttt IIIIIIIIIIIIIIII
    return          0x20000000 |    // opcode
           ((uint32_t)s) << 21 |    // operands
           ((uint32_t)t) << 16 |
           (i & 0xFFFF);

}
