//
// COMP1521 Assignment 2 - MIPS-C
//
// mipsc -- a MIPS simulator
//
// Authors:
// Shakira Li (z5339356@unsw.edu.au)
//
//
//
// Written: 24/11/2022
//


#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

// ADD ANY ADDITIONAL #include HERE

#define MAX_LINE_LENGTH     256
#define INSTRUCTIONS_GROW   64

// ADD ANY ADDITIONAL #defines HERE
#define SIXTY_FOUR_BIT_MASK 0xFFFFFFFFFFFFFFFF
#define THIRTY_TWO_BIT_MASK 0xFFFFFFFF
#define SIXTEEN_BIT_MASK    0xFFFF
#define FIVE_BIT_MASK       0x1F
#define SIX_BIT_MASK        0x3F

#define ADD_BIT     0x20        // 0010 0000
#define SUB_BIT     0x22        // 0010 0010
#define SLT_BIT     0x2A        // 0010 1010
#define MFHI_BIT    0x10        // 0001 0000
#define MFLO_BIT    0x12        // 0001 0010
#define MULT_BIT    0x18        // 0001 1000
#define DIV_BIT     0x1A        // 0001 1010
#define MUL_BIT     0x1C        // 0001 1100
#define BEQ_BIT     0x04        // 0000 0100
#define BNE_BIT     0x05        // 0000 0101
#define ADDI_BIT    0x08        // 0000 1000
#define ORI_BIT     0x0D        // 0000 1101
#define LUI_BIT     0x0F        // 0000 1111
#define SYSCALL     0x0C        // 0000 1100

#define TOTAL_NUM_REGISTERS 35
#define EXIT_FAILURE        1
#define EXIT_SUCCESS        0
#define PC_START            0
#define HI                  33
#define LO                  34

void execute_instructions(uint32_t n_instructions,
                          uint32_t instructions[],
                          int trace_mode);
char *process_arguments(int argc, char *argv[], int *trace_mode);
uint32_t *read_instructions(char *filename, uint32_t *n_instructions_p);
uint32_t *instructions_realloc(uint32_t *instructions, uint32_t n_instructions);

// ADD ANY ADDITIONAL FUNCTION PROTOTYPES HERE
void check_instructions(uint32_t pcValue, int32_t registers[], 
                        uint32_t n_instructions, uint32_t instructions[], 
                        int trace_mode);

// Subset Functions
void performAdd(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode);
void performSub(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode);
void performSlt(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode);
void performMfhi(int32_t registers[], uint32_t d, int trace_mode);
void performMflo(int32_t registers[], uint32_t d, int trace_mode);
void performMult(int32_t registers[], uint32_t s, uint32_t t, int trace_mode);
void performDiv(int32_t registers[], uint32_t s, uint32_t t, int trace_mode);
void performMul(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode);
void performBeq(int32_t registers[], uint32_t s, uint32_t t, int16_t i, 
                uint32_t pcValue, uint32_t n_instructions, 
                uint32_t instructions[], int trace_mode);
void performBne(int32_t registers[], uint32_t s, uint32_t t, int16_t i, 
                uint32_t pcValue, uint32_t n_instructions, 
                uint32_t instructions[], int trace_mode);
void performAddi(int32_t registers[], uint32_t t, uint32_t s, int16_t i, 
                 int trace_mode);
void performOri(int32_t registers[], uint32_t t, uint32_t s, int16_t i, 
                uint32_t iThirtyTwo, int trace_mode);
void performLui(int32_t registers[], uint32_t t, int16_t i, int trace_mode);
void syscall(int32_t registers[], int trace_mode);

// Helper Functions
void syscallExit(int32_t registers[]);


// YOU DO NOT NEED TO CHANGE MAIN
// but you can if you really want to
int main(int argc, char *argv[]) {
    int trace_mode;
    char *filename = process_arguments(argc, argv, &trace_mode);

    uint32_t n_instructions;
    uint32_t *instructions = read_instructions(filename, &n_instructions);

    execute_instructions(n_instructions, instructions, trace_mode);

    free(instructions);
    return 0;
}

// simulate execution of  instruction codes in  instructions array
// output from syscall instruction & any error messages are printed
//
// if trace_mode != 0:
//     information is printed about each instruction as it executed
//
// execution stops if it reaches the end of the array
void execute_instructions(uint32_t n_instructions,
                          uint32_t instructions[],
                          int trace_mode) {

    // REPLACE THIS FUNCTION WITH YOUR OWN IMPLEMENTATION

    int32_t registers[TOTAL_NUM_REGISTERS] = {0};
    // Register Constants:
    // registers[0]  = $0
    // registers[2]  = $v0 (for syscall use)
    // registers[4]  = $a0 (for syscall use)
    // registers[33] = HI
    // registers[34] = LO

    uint32_t pcStart = PC_START;
    check_instructions(pcStart, registers, n_instructions, instructions, 
                       trace_mode);
}


// ADD YOUR FUNCTIONS HERE
// checks which insruction is to be executed
void check_instructions(uint32_t pcValue, int32_t registers[], 
                        uint32_t n_instructions, uint32_t instructions[], 
                        int trace_mode) {
    for (uint32_t pc = pcValue; pc < n_instructions; pc++) {
        if (trace_mode) {
            printf("%u: 0x%08X ", pc, instructions[pc]);
        }
        
        uint32_t lastSixBits    = (instructions[pc]) & SIX_BIT_MASK;
        uint32_t firstSixBits   = (instructions[pc] >> 26) & SIX_BIT_MASK;
        uint32_t s              = (instructions[pc] >> 21) & FIVE_BIT_MASK;
        uint32_t t              = (instructions[pc] >> 16) & FIVE_BIT_MASK;
        uint32_t d              = (instructions[pc] >> 11) & FIVE_BIT_MASK;
        int16_t  i              = (instructions[pc]) & SIXTEEN_BIT_MASK;
        int32_t  iThirtyTwo     = (instructions[pc]) & THIRTY_TWO_BIT_MASK;
        registers[0]            = 0;

        if (firstSixBits == MUL_BIT) {
            performMul(registers, d, s, t, trace_mode);
        } else if (firstSixBits == BEQ_BIT) {
            performBeq(registers, s, t, i, pc, n_instructions, 
                       instructions, trace_mode);
        } else if (firstSixBits == BNE_BIT) {
            performBne(registers, s, t, i, pc, n_instructions, 
                       instructions, trace_mode);
        } else if (firstSixBits == ADDI_BIT) {
            performAddi(registers, t, s, i, trace_mode);
        } else if (firstSixBits == ORI_BIT) {
            performOri(registers, t, s, i, iThirtyTwo, trace_mode);
        } else if (firstSixBits == LUI_BIT) {
            performLui(registers, t, i, trace_mode);
        } else if (lastSixBits == SYSCALL) {
            syscall(registers, trace_mode);
        } else if (lastSixBits == ADD_BIT) {
            performAdd(registers, d, s, t, trace_mode);
        } else if (lastSixBits == SUB_BIT) {
            performSub(registers, d, s, t, trace_mode);
        } else if (lastSixBits == SLT_BIT) {
            performSlt(registers, d, s, t, trace_mode);
        } else if (lastSixBits == MFHI_BIT) {
            performMfhi(registers, d, trace_mode);
        } else if (lastSixBits == MFLO_BIT) {
            performMflo(registers, d, trace_mode);
        } else if (lastSixBits == MULT_BIT) {
            performMult(registers, s, t, trace_mode);
        } else if (lastSixBits == DIV_BIT) {
            performDiv(registers, s, t, trace_mode);
        } 
    }
}

//////////////////////
// Subset Functions //
//////////////////////

// C instruction: d = s + t
// Bit pattern: 000000 sssss ttttt ddddd 00000 100000
void performAdd(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode) {
    registers[d] = registers[s] + registers[t];

    if (trace_mode) {
        printf("add  $%d, $%d, $%d\n", d, s, t);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: d = s - t
// Bit pattern: 000000 sssss ttttt ddddd 00000 100010
void performSub(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode) {
    registers[d] = registers[s] - registers[t];

    if (trace_mode) {
        printf("sub  $%d, $%d, $%d\n", d, s, t);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: d = s < t
// Bit pattern: 000000 sssss ttttt ddddd 00000 101010
void performSlt(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode) {
    if (registers[s] < registers[t]) {
        registers[d] = 1;
    } else {
        registers[d] = 0;
    }

    if (trace_mode) {
        printf("slt  $%d, $%d, $%d\n", d, s, t);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: d = HI
// Bit pattern: 000000 00000 00000 ddddd 00000 010000
void performMfhi(int32_t registers[], uint32_t d, int trace_mode) {
    registers[d] = registers[HI];

    if (trace_mode) {
        printf("mfhi $%d\n", d);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: d = LO
// Bit pattern: 000000 00000 00000 ddddd 00000 010010
void performMflo(int32_t registers[], uint32_t d, int trace_mode) {
    registers[d] = registers[LO];

    if (trace_mode) {
        printf("mflo $%d\n", d);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: HI,LO = s * t
// Bit pattern: 000000 sssss ttttt 00000 00000 011000
void performMult(int32_t registers[], uint32_t s, uint32_t t, int trace_mode) {
    int64_t product = (registers[s] & SIXTY_FOUR_BIT_MASK) * 
                      (registers[t] & SIXTY_FOUR_BIT_MASK);
    registers[HI] = (product >> 32) & THIRTY_TWO_BIT_MASK;
    registers[LO] = (product) & THIRTY_TWO_BIT_MASK;
    
    if (trace_mode) {
        printf("mult $%d, $%d\n", s, t);
        printf(">>> HI = %d\n", registers[HI]);
        printf(">>> LO = %d\n", registers[LO]);
    }
}

// C instruction: HI = s % t; LO = s / t
// Bit pattern: 000000 sssss ttttt 00000 00000 011010
void performDiv(int32_t registers[], uint32_t s, uint32_t t, int trace_mode) {
    if (registers[t] == 0) {
        registers[HI] = 0;
        registers[LO] = 0;
    } else {
        registers[HI] = registers[s] % registers[t];
        registers[LO] = registers[s] / registers[t];
    }

    if (trace_mode) {
        printf("div  $%d, $%d\n", s, t);
        printf(">>> HI = %d\n", registers[HI]);
        printf(">>> LO = %d\n", registers[LO]);
    }
}

// C instruction: d = s * t
// Bit pattern: 011100 sssss ttttt ddddd 00000 000010
void performMul(int32_t registers[], uint32_t d, uint32_t s, uint32_t t, 
                int trace_mode) {
    registers[d] = registers[s] * registers[t];

    if (trace_mode) {
        printf("mul  $%d, $%d, $%d\n", d, s, t);
        printf(">>> $%d = %d\n", d, registers[d]);
    }
}

// C instruction: if (s == t) PC += I
// Bit pattern: 000100 sssss ttttt IIIII IIIII IIIIII
void performBeq(int32_t registers[], uint32_t s, uint32_t t, int16_t i, 
                uint32_t pcValue, uint32_t n_instructions, 
                uint32_t instructions[], int trace_mode) {
    if (trace_mode) {
        printf("beq  $%d, $%d, %d\n", s, t, i);
    }

    if (registers[s] == registers[t]) {
        uint32_t newPcValue = pcValue + i;
        if (trace_mode) {
            printf(">>> branch taken to PC = %d\n", newPcValue);
        }

        if (newPcValue > n_instructions || newPcValue < 0) {
            fprintf(stderr, "Illegal branch to non-instruction: PC = %d\n", 
                    newPcValue);
            exit(EXIT_FAILURE);
        }

        check_instructions(newPcValue, registers, n_instructions, instructions, 
                           trace_mode);
    } else {
        if (trace_mode) {
            printf(">>> branch not taken\n");
        }
    }
}

// C instruction: if (s != t) PC += I
// Bit pattern: 000101 sssss ttttt IIIII IIIII IIIIII
void performBne(int32_t registers[], uint32_t s, uint32_t t, int16_t i, 
                uint32_t pcValue, uint32_t n_instructions, 
                uint32_t instructions[], int trace_mode) {
    if (trace_mode) {
        printf("bne  $%d, $%d, %d\n", s, t, i);
    }

    if (registers[s] != registers[t]) {
        uint32_t newPcValue = pcValue + i;
        if (trace_mode) {
            printf(">>> branch taken to PC = %d\n", newPcValue);
        }

        if (newPcValue > n_instructions || newPcValue < 0) {
            fprintf(stderr, "Illegal branch to non-instruction: PC = %d\n", 
                    newPcValue);
            exit(EXIT_FAILURE);
        }

        check_instructions(newPcValue, registers, n_instructions, instructions, 
                           trace_mode);
    } else {
        if (trace_mode) {
            printf(">>> branch not taken\n");
        }
    }
}

// C instruction: t = s + I
// Bit pattern: 001000 sssss ttttt IIIII IIIII IIIIII
void performAddi(int32_t registers[], uint32_t t, uint32_t s, int16_t i, 
                 int trace_mode) {
    registers[t] = registers[s] + i;

    if (trace_mode) {
        printf("addi $%d, $%d, %d\n", t, s, i);
        printf(">>> $%d = %d\n", t, registers[t]);
    }
}

// C instruction: t = s | I
// Bit pattern: 001101 sssss ttttt IIIII IIIII IIIIII
void performOri(int32_t registers[], uint32_t t, uint32_t s, int16_t i, 
                uint32_t iThirtyTwo, int trace_mode) {
    if (i < 0) {
        registers[t] = registers[s] | iThirtyTwo;
    } else {
        registers[t] = registers[s] | i;
    }

    if (trace_mode) {
        printf("ori  $%d, $%d, %d\n", t, s, i);
        printf(">>> $%d = %d\n", t, registers[t]);
    }
}

// C instruction: t = I << 16
// Bit pattern: 001111 00000 ttttt IIIII IIIII IIIIII
void performLui(int32_t registers[], uint32_t t, int16_t i, int trace_mode) {
    registers[t] = i << 16;

    if (trace_mode) {
        printf("lui  $%d, %d\n", t, i);
        printf(">>> $%d = %d\n", t, registers[t]);
    }
}

// C instructions:
//  1. printf("%d", $a0)
//  2. exit(0)
//  3. printf("%c", $a0)
// Bit pattern: 000000 00000 00000 00000 00000 001100
void syscall(int32_t registers[], int trace_mode) {
    if (trace_mode) {
        printf("syscall\n");
        printf(">>> syscall %d\n", registers[2]);

        if (registers[2] == 1) {
            printf("<<< %d\n", registers[4]);
        } else if (registers[2] == 11) {
            printf("<<< %c\n", registers[4]);
        } else {
            syscallExit(registers);
        }
    } else {
        if (registers[2] == 1) {
            printf("%d", registers[4]);
        } else if (registers[2] == 11) {
            printf("%c", registers[4]);
        } else {
            syscallExit(registers);
        }
    }
}

//////////////////////
// Helper Functions //
//////////////////////

// executes the invalid and exit syscalls
void syscallExit(int32_t registers[]) {
    if (registers[2] == 10) {
        exit(EXIT_SUCCESS);  
    } 

    fprintf(stderr, "Unknown system call: %d\n", registers[2]);
    exit(EXIT_FAILURE);
}

// DO NOT CHANGE ANY CODE BELOW HERE


// check_arguments is given command-line arguments
// it sets *trace_mode to 0 if -r is specified
//         *trace_mode is set to 1 otherwise
// the filename specified in command-line arguments is returned
char *process_arguments(int argc, char *argv[], int *trace_mode) {
    if (
        argc < 2 ||
        argc > 3 ||
        (argc == 2 && strcmp(argv[1], "-r") == 0) ||
        (argc == 3 && strcmp(argv[1], "-r") != 0)
    ) {
        fprintf(stderr, "Usage: %s [-r] <file>\n", argv[0]);
        exit(1);
    }
    *trace_mode = (argc == 2);
    return argv[argc - 1];
}


// read hexadecimal numbers from filename one per line
// numbers are return in a malloc'ed array
// *n_instructions is set to size of the array
uint32_t *read_instructions(char *filename, uint32_t *n_instructions_p) {
    FILE *f = fopen(filename, "r");
    if (f == NULL) {
        perror(filename);
        exit(1);
    }

    uint32_t *instructions = NULL;
    uint32_t n_instructions = 0;
    char line[MAX_LINE_LENGTH + 1];
    while (fgets(line, sizeof line, f) != NULL) {

        // grow instructions array in steps of INSTRUCTIONS_GROW elements
        if (n_instructions % INSTRUCTIONS_GROW == 0) {
            instructions = instructions_realloc(instructions, n_instructions + INSTRUCTIONS_GROW);
        }

        char *endptr;
        instructions[n_instructions] = (uint32_t)strtoul(line, &endptr, 16);
        if (*endptr != '\n' && *endptr != '\r' && *endptr != '\0') {
            fprintf(stderr, "line %d: invalid hexadecimal number: %s",
                    n_instructions + 1, line);
            exit(1);
        }
        if (instructions[n_instructions] != strtoul(line, &endptr, 16)) {
            fprintf(stderr, "line %d: number too large: %s",
                    n_instructions + 1, line);
            exit(1);
        }
        n_instructions++;
    }
    fclose(f);
    *n_instructions_p = n_instructions;
    // shrink instructions array to correct size
    instructions = instructions_realloc(instructions, n_instructions);
    return instructions;
}


// instructions_realloc is wrapper for realloc
// it calls realloc to grow/shrink the instructions array
// to the specified size
// it exits if realloc fails
// otherwise it returns the new instructions array
uint32_t *instructions_realloc(uint32_t *instructions, uint32_t n_instructions) {
    instructions = realloc(instructions, n_instructions * sizeof *instructions);
    if (instructions == NULL) {
        fprintf(stderr, "out of memory");
        exit(1);
    }
    return instructions;
}
